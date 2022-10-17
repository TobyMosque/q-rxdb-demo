import { boot } from 'quasar/wrappers';
import { addRxPlugin, createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/dexie';
import { personSchema } from 'src/models/Person';
import { jobSchema } from 'src/models/Job';
import { companySchema } from 'src/models/Company';
import { seed } from './database/seed';
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration';

export const dbKey = 'api-key';
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app, store }) => {
  if (process.env.DEBUG) {
    const RxDBDevModePlugin = await import('rxdb/plugins/dev-mode');
    addRxPlugin(RxDBDevModePlugin);
  }
  addRxPlugin(RxDBMigrationPlugin);

  const db = await createRxDatabase({
    name: 'peopledb',
    storage: getRxStorageDexie(),
  });

  await db.addCollections({
    person: {
      schema: personSchema,
      migrationStrategies: {
        [personSchema.version](oldDoc) {
          return oldDoc;
        },
      },
    },
    job: {
      schema: jobSchema,
      migrationStrategies: {
        [jobSchema.version](oldDoc) {
          return oldDoc;
        },
      },
    },
    company: {
      schema: companySchema,
      migrationStrategies: {
        [companySchema.version](oldDoc) {
          return oldDoc;
        },
      },
    },
  });

  await seed(db);
  app.provide(dbKey, db);
  store.use(() => ({
    $db: db,
  }));
});
