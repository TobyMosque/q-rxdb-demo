import { dbKey } from 'src/boot/database';
import { inject, ref } from 'vue';

export function useDatabase() {
  const job = ref();
  const company = ref();
  const peopleJob = ref();
  const peopleCompany = ref();

  const db = inject(dbKey);
  async function query() {
    if (!db) {
      return;
    }
    const companyIndex = Math.floor(Math.random() * Math.floor(50));
    const jobIndex = Math.floor(Math.random() * Math.floor(50));

    const companies = await db.company
      .find({ limit: 1, skip: companyIndex })
      .exec();
    const jobs = await db.job.find({ limit: 1, skip: jobIndex }).exec();
    job.value = jobs[0]._data;
    company.value = companies[0]._data;

    peopleJob.value = (
      await db.person.find({ selector: { job: job.value?.jobId } }).exec()
    ).map((doc) => doc._data);
    peopleCompany.value = (
      await db.person
        .find({ selector: { company: company.value?.companyId } })
        .exec()
    ).map((doc) => doc._data);
  }

  return {
    query,
    job,
    company,
    peopleJob,
    peopleCompany,
  };
}
