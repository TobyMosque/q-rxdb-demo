import { Company } from 'src/models/Company';
import { Job } from 'src/models/Job';
import { Person } from 'src/models/Person';
import { Ref } from 'vue';

export function useDatabase(): {
  job: Ref<Job>;
  company: Ref<Company>;
  peopleJob: Ref<Person[]>;
  peopleCompany: Ref<Person[]>;
  query(): void;
};
