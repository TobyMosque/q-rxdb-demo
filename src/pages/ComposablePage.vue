<template>
  <q-page class="row items-center justify-evenly">
    {{ company?.name }} - {{ updatedAt }}
    <q-btn @click="query" label="Query By Compasable"></q-btn>
    <q-btn to="/store" label="Go To Store"></q-btn>
  </q-page>
</template>

<script setup lang="ts">
import { useDatabase } from 'src/compasables/database';
import { computed } from 'vue';

const databaseModule = useDatabase();
const { company } = databaseModule;

async function query() {
  await databaseModule.query();
}

const updatedAt = computed(() => {
  const updatedAt = company?.value?.updatedAt;
  return updatedAt ? new Date(updatedAt).toLocaleString() : 'N/A';
});
</script>
