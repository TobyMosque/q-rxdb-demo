import { Job } from 'src/models/Job';
import { computed, toRefs } from 'vue';
import { defineState, useStore } from './store';

interface State {
  job?: Job;
}

export const useJobState = defineState<State>('job', () => ({
  job: undefined,
}));

export function useJob() {
  const store = useStore();
  const state = useJobState();

  const updatedAt = computed(() => {
    const updatedAt = state.job?.updatedAt;
    return updatedAt ? new Date(updatedAt).toLocaleString() : 'N/A';
  });

  async function init(index: number) {
    const db = await store.getDb();
    const doc = await db.job.findOne({ skip: index }).exec();
    state.job = doc?.ref as never;
  }

  function startInterval() {
    setInterval(async () => {
      const db = await store.getDb();
      const rxDoc = await db.job.findOne(state.job?.jobId).exec();
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
