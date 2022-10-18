<template>
  <q-page class="row items-center justify-evenly">
    <q-card>
      <q-card-section>Job Syncronizer (Composable)</q-card-section>
      <q-separator></q-separator>
      <q-card-section>
        <q-list>
          <q-item>Job: {{ job?.name }} - {{ jobUpdatedAt }}</q-item>
          <q-item>Company: {{ company?.name }} - {{ companyUpdatedAt }}</q-item>
        </q-list>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-actions>
        <q-btn @click="query" label="Initialize"></q-btn>
        <q-btn @click="interval" label="Start Interval"></q-btn>
        <q-btn to="/company" label="Go To Company"></q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
/*
import { storeToRefs } from 'pinia';
*/
import { useCompany } from 'src/compasables/company';
import { useJob } from 'src/compasables/job';
/*
import { useCompanyStore } from 'src/stores/company';
import { useJobStore } from 'src/stores/job';
import { computed } from 'vue';
*/

const jobStore = useJob();
const companyStore = useCompany();

const { job, updatedAt: jobUpdatedAt } = jobStore;
const { company, updatedAt: companyUpdatedAt } = companyStore;

async function query() {
  await jobStore.init();
  await companyStore.init();
}

async function interval() {
  await jobStore.startInterval();
}

/*
const jobStore = useJobStore();
const companyStore = useCompanyStore();

const { job } = storeToRefs(jobStore);
const { company } = storeToRefs(companyStore);

const jobUpdatedAt = computed(() => jobStore.updatedAt);
const companyUpdatedAt = computed(() => companyStore.updatedAt);

async function query() {
  await jobStore.init();
  await companyStore.init();
}

async function interval() {
  await jobStore.startInterval();
}
*/
</script>
