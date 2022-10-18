import { defineStore } from 'pinia';
import { useGetDb, useQuery } from 'src/compasables/query';
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
      await useGetDb(this.getDb, async (db) => {
        await useQuery(company, () =>
          db.company.find({ limit: 1, skip: companyIndex })
        );
      });
    },
    async startInterval() {
      const db = await this.getDb();
      setInterval(async () => {
        await useGetDb(this.getDb, async (db) => {
          const rxDoc = await db.company
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
