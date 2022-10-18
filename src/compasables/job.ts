import { dbKey } from 'src/boot/database';
import { Job } from 'src/models/Job';
import { computed, inject, ref } from 'vue';
import { useElection, useQuery } from './query';

export function useJob() {
  const job = ref<Job>();
  const updatedAt = computed(() => {
    const updatedAt = job?.value?.updatedAt;
    return updatedAt ? new Date(updatedAt).toLocaleString() : 'N/A';
  });

  const db = inject(dbKey);
  async function init() {
    if (!db) {
      return;
    }
    await useElection(db, async () => {
      const jobIndex = 0; //Math.floor(Math.random() * Math.floor(50));
      await useQuery(job, () => db.job.find({ limit: 1, skip: jobIndex }));
    });
  }

  function startInterval() {
    if (!db) {
      return;
    }

    setInterval(async () => {
      await useElection(db, async () => {
        const rxDoc = await db.job.findOne(job.value?.jobId).exec();
        await rxDoc?.update({
          $set: {},
        });
      });
    }, 2000);
  }

  return {
    init,
    startInterval,
    updatedAt,
    job,
  };
}