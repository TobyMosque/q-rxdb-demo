import { boot } from 'quasar/wrappers';
import { RxDatabase, createRxDatabase, RxCollection, addRxPlugin } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/dexie';
import { Person, personSchema } from 'src/models/Person';
import { Job, jobSchema } from 'src/models/Job';
import { Company, companySchema } from 'src/models/Company';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';
import { InjectionKey } from 'vue';
import { wrappedKeyEncryptionStorage } from 'rxdb/plugins/encryption';

import { seed } from './database/seed';
import { Dialog } from 'quasar';

interface Collections {
  person: RxCollection<Person>;
  job: RxCollection<Job>;
  company: RxCollection<Company>;
}
export type Database = RxDatabase<Collections>;
declare module 'pinia' {
  export interface PiniaCustomProperties {
    getDb: () => Promise<Database>;
  }
}

interface Entity {
  _deleted?: boolean;
  updatedAt?: number;
}

export const getDbKey: InjectionKey<() => Promise<Database>> =
  Symbol('get-db-key');
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app, store }) => {
  if (process.env.DEBUG) {
    const { RxDBDevModePlugin } = await import('rxdb/plugins/dev-mode');
    addRxPlugin(RxDBDevModePlugin);
  }
  addRxPlugin(RxDBUpdatePlugin);
  addRxPlugin(RxDBLeaderElectionPlugin);

  let db: Database;
  async function getDb() {
    if (db) {
      return db;
    }

    await new Promise((resolve) =>
      Dialog.create({
        message: 'you would ask the user by the password here',
      }).onOk(resolve)
    );

    const secret = 'KeetItSuperSecret$512';
    let password = secret;
    if (process.env.MODE === 'electron') {
      password = window.getPassword(secret);
    }
    db = await createRxDatabase<Collections>({
      name: 'peopledb',
      storage: wrappedKeyEncryptionStorage({
        storage: getRxStorageDexie(),
      }),
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

    await db.addCollections({
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

    entityHooks(db.person);
    entityHooks(db.job);
    entityHooks(db.company);

    await seed(db);
    return db;
  }
  // this secret would be provided by the user;

  app.provide(getDbKey, getDb);
  store.use(() => ({
    getDb: getDb,
  }));
});
