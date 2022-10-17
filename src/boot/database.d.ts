import { RxDatabase, RxCollection } from 'rxdb';
import { Person } from '../../src/models/Person';
import { Job } from '../../src/models/Job';
import { Company } from '../../src/models/Company';
import { InjectionKey } from 'vue';

export interface Collections {
  person: RxCollection<Person>;
  job: RxCollection<Job>;
  company: RxCollection<Company>;
}
type Database = RxDatabase<Collections>;
declare module 'pinia' {
  export interface PiniaCustomProperties {
    $db: Database;
  }
}

export const dbKey: InjectionKey<Database>;
