import { boot } from 'quasar/wrappers';
import { RxDatabase, createRxDatabase, RxCollection } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/dexie';
import { Person, personSchema } from 'src/modals/Person';
import { Job, jobSchema } from 'src/modals/Job';
import { Company, companySchema } from 'src/modals/Company';
import { InjectionKey } from 'vue';
import { seed } from './database/seed';

interface Collections {
  person: RxCollection<Person>;
  job: RxCollection<Job>;
  company: RxCollection<Company>;
}
export type Database = RxDatabase<Collections>;
declare module 'pinia' {
  export interface PiniaCustomProperties {
    $db: Database;
  }
}

export const dbKey: InjectionKey<Database> = Symbol('api-key');
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app, store }) => {
  const db: Database = await createRxDatabase<Collections>({
    name: 'peopledb',
    storage: getRxStorageDexie(),
  });

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

  await seed(db);
  app.provide(dbKey, db);
  store.use(() => ({
    $db: db,
  }));
});
