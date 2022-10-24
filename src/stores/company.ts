import { Company } from 'src/models/Company';
import { computed, toRefs } from 'vue';
import { Database, defineState, useStore } from './store';

interface State {
  company?: Company;
}

export const useCompanyState = defineState(
  'company',
  () =>
    ({
      company: undefined,
    } as State)
);

export function useCompany() {
  const store = useStore();
  const state = useCompanyState();

  const updatedAt = computed(() => {
    const updatedAt = state.company?.updatedAt;
    return updatedAt ? new Date(updatedAt).toLocaleString() : 'N/A';
  });

  async function init(index: number) {
    const db = await store.getDb();
    const doc = await db.company.findOne({ skip: index }).exec();
    state.company = doc?.ref as never;
  }

  function startInterval() {
    setInterval(async () => {
      const db = await store.getDb();
      const rxDoc = await db.company.findOne(state.company?.companyId).exec();
      await rxDoc?.update({
        $set: {},
      });
    }, 2000);
  }

  return {
    ...toRefs(state),
    init,
    startInterval,
    updatedAt,
  };
}
