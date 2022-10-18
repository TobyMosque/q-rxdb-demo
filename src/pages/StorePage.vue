<template>
  <q-page class="row items-center justify-evenly">
    {{ company?.name }} - {{ updatedAt }}
    <q-btn @click="query" label="Query By Store"></q-btn>
    <q-btn to="/composable" label="Go To Composable"></q-btn>
  </q-page>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useDatabaseStore } from 'src/stores/database';
import { computed } from 'vue';

const databaseStore = useDatabaseStore();
const { peopleCompany, peopleJob, job, company } = storeToRefs(databaseStore);

async function query() {
  await databaseStore.init();
  console.log({ peopleCompany, peopleJob, job, company });
}

const updatedAt = computed(() => {
  const updatedAt = company?.value?.updatedAt;
  return updatedAt ? new Date(updatedAt).toLocaleString() : 'N/A';
});
</script>
