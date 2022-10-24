<template>
  <q-page class="row items-center justify-evenly">
    <q-card>
      <q-card-section>Company Syncronizer (Store)</q-card-section>
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
        <q-btn to="/job" label="Go To Job"></q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useCompany } from 'src/stores/company';
import { useJob } from 'src/stores/job';

const jobStore = useJob();
const companyStore = useCompany();

const { job, updatedAt: jobUpdatedAt } = jobStore;
const { company, updatedAt: companyUpdatedAt } = companyStore;

async function query() {
  await jobStore.init(0);
  await companyStore.init(0);
}

function interval() {
  companyStore.startInterval();
}
</script>
