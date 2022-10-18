import { defineStore } from 'pinia';
import { useElection, useQuery } from 'src/compasables/query';
import { Company } from 'src/models/Company';
import { toRefs } from 'vue';

interface State {
  company?: Company;
}

export const useCompanyStore = defineStore('company', {
  state: () =>
    ({
      company: undefined,
    } as State),
  getters: {
    updatedAt(): string {
      const updatedAt = this.company?.updatedAt;
      return updatedAt ? new Date(updatedAt).toLocaleString() : 'N/A';
    },
  },
  actions: {
    async init() {
      const { company } = toRefs(this.$state);

      const companyIndex = 0; //Math.floor(Math.random() * Math.floor(50));
      await useElection(this.$db, async () => {
        await useQuery(company, () =>
          this.$db.company.find({ limit: 1, skip: companyIndex })
        );
      });
    },
    startInterval() {
      set(async () => {
        await useElection(this.$db, async () => {
          const rxDoc = await this.$db.company
            .findOne(this.company?.companyId)
            .exec();
          await rxDoc?.update({
            $set: {},
          });
        });
      }, 2000);
    },
  },
});
