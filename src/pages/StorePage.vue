<template>
  <q-page class="row items-center justify-evenly">
    <q-btn @click="query" label="Query By Store"></q-btn>
    <q-btn to="/composable" label="Go To Composable"></q-btn>
  </q-page>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useDatabaseStore } from 'src/stores/database';

const databaseStore = useDatabaseStore();
const { peopleCompany, peopleJob, job, company } = storeToRefs(databaseStore);

async function query() {
  await databaseStore.query();
  console.log({ peopleCompany, peopleJob, job, company });
}
</script>
