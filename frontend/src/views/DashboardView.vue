<template>
  <section class="panel">
    <h2>{{ $t("dashboard.hot") }}</h2>
    <div class="kpi-grid">
      <div class="kpi"><span>{{ $t("dashboard.c1") }}</span><strong>{{ store.dashboard.courseCount }}</strong></div>
      <div class="kpi"><span>{{ $t("dashboard.c2") }}</span><strong>{{ store.dashboard.studentCount }}</strong></div>
      <div class="kpi"><span>{{ $t("dashboard.c3") }}</span><strong>{{ store.dashboard.enrollCount }}</strong></div>
      <div class="kpi"><span>{{ $t("dashboard.c4") }}</span><strong>{{ store.dashboard.avgScore }}</strong></div>
    </div>

    <table>
      <thead><tr><th>{{ $t("courses.name") }}</th><th>{{ $t("dashboard.c3") }}</th><th>{{ $t("dashboard.c4") }}</th></tr></thead>
      <tbody>
        <tr v-for="row in store.courseStats" :key="row.course_name">
          <td>{{ row.course_name }}</td><td>{{ row.selectedCount }}</td><td>{{ row.avgScore || '-' }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
import { onMounted } from "vue";
import { useEduStore } from "../stores/edu";
const store = useEduStore();
onMounted(() => store.safeRun(async () => { await store.fetchDashboard(); await store.fetchCourseStats(); }));
</script>
