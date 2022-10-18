import { defineStore, storeToRefs } from 'pinia';
import { RxDocument, RxQuery } from 'rxdb';
import { useArrayQuery, useQuery } from 'src/compasables/query';
import { Company } from 'src/models/Company';
import { Job } from 'src/models/Job';
import { Person } from 'src/models/Person';
import { toRefs } from 'vue';

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
  getters: {
    peopleJobIndex(): Map<string, number> {
      return this.peopleJob.reduce((map, person, index) => {
        map.set(person.personId, index);
        return map;
      }, new Map<string, number>());
    },
    peopleCompanyIndex(): Map<string, number> {
      return this.peopleCompany.reduce((map, person, index) => {
        map.set(person.personId, index);
        return map;
      }, new Map<string, number>());
    },
  },
  actions: {
    async query() {
      const { job, company, peopleJob, peopleCompany } = toRefs(this.$state);

      const companyIndex = Math.floor(Math.random() * Math.floor(50));
      const jobIndex = Math.floor(Math.random() * Math.floor(50));

      useQuery(company, () =>
        this.$db.company.find({ limit: 1, skip: companyIndex })
      );
      useQuery(job, () => this.$db.job.find({ limit: 1, skip: jobIndex }));
      useArrayQuery(
        peopleJob,
        (doc) => doc.personId,
        () => this.$db.person.find({ selector: { job: job?.value?.jobId } })
      );
      useArrayQuery(
        peopleCompany,
        (doc) => doc.personId,
        () =>
          this.$db.person.find({
            selector: { company: company?.value?.companyId },
          })
      );

      setInterval(async () => {
        const rxDoc = await this.$db?.company
          .findOne(company?.value?.companyId)
          .exec();
        rxDoc?.update({
          $set: {},
        });
      }, 2000);
    },
  },
});
