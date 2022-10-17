<template>
  <q-page class="row items-center justify-evenly">
    <q-btn @click="query" label="Query By Compasable"></q-btn>
    <q-btn to="/store" label="Go To Store"></q-btn>
  </q-page>
</template>

<script setup lang="ts">
import { useDatabase } from 'src/compasables/database';

const databaseModule = useDatabase();
const { peopleCompany, peopleJob, job, company } = databaseModule;

async function query() {
  await databaseModule.query();
  console.log({ peopleCompany, peopleJob, job, company });
}
</script>
