import { dbKey } from 'src/boot/database';
import { Company } from 'src/models/Company';
import { Job } from 'src/models/Job';
import { Person } from 'src/models/Person';
import { inject, ref } from 'vue';
import { useArrayQuery, useQuery } from './query';

export function useDatabase() {
  const job = ref<Job>();
  const company = ref<Company>();
  const peopleJob = ref<Person[]>([]);
  const peopleCompany = ref<Person[]>([]);

  const db = inject(dbKey);
  async function query() {
    if (!db) {
      return;
    }
    const companyIndex = Math.floor(Math.random() * Math.floor(50));
    const jobIndex = Math.floor(Math.random() * Math.floor(50));

    useQuery(company, () => db.company.find({ limit: 1, skip: companyIndex }));
    useQuery(job, () => db.job.find({ limit: 1, skip: jobIndex }));
    useArrayQuery(
      peopleJob,
      (doc) => doc.personId,
      () => db.person.find({ selector: { job: job.value?.jobId } })
    );
    useArrayQuery(
      peopleCompany,
      (doc) => doc.personId,
      () => db.person.find({ selector: { company: company.value?.companyId } })
    );
  }

  setInterval(async () => {
    const rxDoc = await db?.company.findOne(company.value?.companyId).exec();
    rxDoc?.update({
      $set: {},
    });
  }, 2000);

  return {
    query,
    job,
    company,
    peopleJob,
    peopleCompany,
  };
}
