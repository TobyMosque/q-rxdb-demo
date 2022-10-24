import {
  addRxPlugin,
  createRxDatabase,
  RxCollection,
  RxDatabase,
  RxDocument,
} from 'rxdb';
import { Person, personSchema } from 'src/models/Person';
import { Job, jobSchema } from 'src/models/Job';
import { Company, companySchema } from 'src/models/Company';
import {
  InjectionKey,
  Plugin,
  inject,
  reactive,
  Ref,
  ref,
  UnwrapNestedRefs,
} from 'vue';
import { wrappedKeyCompressionStorage } from 'rxdb/plugins/key-compression';
import { wrappedKeyEncryptionStorage } from 'rxdb/plugins/encryption';
import { getRxStorageDexie } from 'rxdb/plugins/dexie';
import { seed } from './utils/seed';

interface Entity {
  _deleted?: boolean;
  updatedAt?: number;
}

export interface Collections {
  person: RxCollection<Person>;
  job: RxCollection<Job>;
  company: RxCollection<Company>;
}
export type Database = RxDatabase<Collections>;

export interface StoreOptions {
  getPassword?: () => string;
  getPasswordAsync?: () => Promise<string>;
  compression: boolean;
  encryption: boolean;
}
type Store = Plugin &
  StoreOptions & {
    $state: Map<string, unknown>;
    $db?: Database;
    getDb: () => Promise<Database>;
    use: (callback: <T extends object>() => T) => void;
  };

declare module 'rxdb' {
  export interface RxDocumentBase<RxDocumentType> {
    ref: Ref<RxDocumentType>;
  }
}

const storeKey: InjectionKey<Store> = Symbol('store-key');
export function useStore() {
  const store = inject(storeKey);
  if (!store) {
    throw 'there is no store!';
  }
  return store;
}

export function defineState<T extends object>(
  key: string,
  callback: () => T
): () => UnwrapNestedRefs<T> {
  return function () {
    const store = useStore();
    if (!store?.$state.has(key)) {
      const state = reactive(callback());
      store?.$state.set(key, state);
    }
    return store?.$state.get(key) as UnwrapNestedRefs<T>;
  };
}

async function getDb(this: Store): Promise<Database> {
  if (!this.$db) {
    let password = '';
    if (this.getPassword) password = this.getPassword();
    if (this.getPasswordAsync) password = await this.getPasswordAsync();

    let storage = getRxStorageDexie();
    if (this.compression) {
      storage = wrappedKeyCompressionStorage({ storage }) as never;
    }
    if (this.encryption) {
      storage = wrappedKeyEncryptionStorage({ storage }) as never;
    }
    this.$db = await createRxDatabase<Collections>({
      name: 'peopledb',
      storage,
      password: password,
      multiInstance: true,
    });

    function entityHooks<T extends Entity>(collection: RxCollection<T>) {
      collection.preInsert((data: T) => {
        data._deleted = false;
        data.updatedAt = new Date().getTime();
      }, false);

      collection.preSave((data: T, doc: unknown) => {
        console.log('saved: ', data, doc);
        data.updatedAt = new Date().getTime();
      }, false);

      collection.preRemove((data: T, doc: unknown) => {
        console.log('removed: ', data, doc);
        data._deleted = true;
        data.updatedAt = new Date().getTime();
      }, false);
    }

    await this.$db.addCollections({
      person: {
        schema: personSchema,
      },
      job: {
        schema: jobSchema,
      },
      company: {
        schema: companySchema,
      },
    });

    entityHooks(this.$db.person);
    entityHooks(this.$db.job);
    entityHooks(this.$db.company);

    addRxPlugin({
      hooks: {
        createRxDocument: {
          before(doc: RxDocument<unknown>) {
            doc.ref = ref<unknown>();
            doc.ref.value = doc.toMutableJSON();
            doc?.$.subscribe((evt) => {
              doc.ref.value = doc.toMutableJSON();
            });
            return doc;
          },
        },
      },
      name: 'bind-doc-to-ref',
      rxdb: true,
    });

    await seed(this.$db);
  }
  return this.$db;
}

export default function createStore(
  { getPassword, getPasswordAsync, compression, encryption }: StoreOptions = {
    compression: false,
    encryption: false,
  }
): Store {
  if (encryption && !(getPassword || getPasswordAsync)) {
    throw 'encryption requires a password';
  }
  const store: Store = {
    $state: new Map(),
    getPassword,
    getPasswordAsync,
    compression,
    encryption,
    getDb,
    use(callback: <T extends object>({ store }: { store: Store }) => T) {
      const obj = callback({ store: this });
      if (obj) {
        for (const [key, value] of Object.entries(obj)) {
          (this as never as Record<string, unknown>)[key] = value;
        }
      }
    },
    install(app) {
      app.provide(storeKey, this);
    },
  };
  return store;
}
