import { getDbKey } from 'src/boot/database';
import { Company } from 'src/models/Company';
import { computed, inject, ref } from 'vue';
import { useGetDb, useQuery } from './query';

export function useCompany() {
  const company = ref<Company>();
  const updatedAt = computed(() => {
    const updatedAt = company?.value?.updatedAt;
    return updatedAt ? new Date(updatedAt).toLocaleString() : 'N/A';
  });

  const getDb = inject(getDbKey);
  async function init() {
    if (!getDb) return;
    await useGetDb(getDb, async (db) => {
      const jobIndex = 0; //Math.floor(Math.random() * Math.floor(50));
      await useQuery(company, () =>
        db.company.find({ limit: 1, skip: jobIndex })
      );
    });
  }

  function startInterval() {
    if (!getDb) return;
    setInterval(async () => {
      await useGetDb(getDb, async (db) => {
        const rxDoc = await db.company.findOne(company.value?.companyId).exec();
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
    company,
  };
}
