import { defineStore } from 'pinia';
import { useElection, useQuery } from 'src/compasables/query';
import { Job } from 'src/models/Job';
import { toRefs } from 'vue';

interface State {
  job?: Job;
}

export const useJobStore = defineStore('job', {
  state: () =>
    ({
      job: undefined,
    } as State),
  getters: {
    updatedAt(): string {
      const updatedAt = this.job?.updatedAt;
      return updatedAt ? new Date(updatedAt).toLocaleString() : 'N/A';
    },
  },
  actions: {
    async init() {
      const { job } = toRefs(this.$state);

      const companyIndex = 0; //Math.floor(Math.random() * Math.floor(50));
      await useElection(this.$db, async () => {
        await useQuery(job, () =>
          this.$db.job.find({ limit: 1, skip: companyIndex })
        );
      });
    },
    startInterval() {
      setInterval(async () => {
        await useElection(this.$db, async () => {
          const rxDoc = await this.$db.company.findOne(this.job?.jobId).exec();
          await rxDoc?.update({
            $set: {},
          });
        });
      }, 2000);
    },
  },
});
