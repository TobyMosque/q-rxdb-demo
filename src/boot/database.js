import { boot } from 'quasar/wrappers';
import { createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/dexie';
import { personSchema } from 'src/models/Person';
import { jobSchema } from 'src/models/Job';
import { companySchema } from 'src/models/Company';
import { seed } from './database/seed';

export const dbKey = 'api-key';
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app, store }) => {
  const db = await createRxDatabase({
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
