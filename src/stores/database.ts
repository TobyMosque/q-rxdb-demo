import { defineStore } from 'pinia';
import { Company } from 'src/modals/Company';
import { Job } from 'src/modals/Job';
import { Person } from 'src/modals/Person';

interface State {
  job?: Job;
  company?: Company;
  peopleJob: Person[];
  peopleCompany: Person[];
}

export const useDatabaseStore = defineStore('database', {
  state: () =>
    ({
      job: undefined,
      company: undefined,
      peopleJob: [],
      peopleCompany: [],
    } as State),
  actions: {
    async query() {
      const companyIndex = Math.floor(Math.random() * Math.floor(50));
      const jobIndex = Math.floor(Math.random() * Math.floor(50));

      const companies = await this.$db.company
        .find({ limit: 1, skip: companyIndex })
        .exec();
      const jobs = await this.$db.job.find({ limit: 1, skip: jobIndex }).exec();
      this.job = jobs[0]._data;
      this.company = companies[0]._data;

      this.peopleJob = (
        await this.$db.person.find({ selector: { job: this.job.jobId } }).exec()
      ).map((doc) => doc._data);
      this.peopleCompany = (
        await this.$db.person
          .find({ selector: { company: this.company.companyId } })
          .exec()
      ).map((doc) => doc._data);
    },
  },
});