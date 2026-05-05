<template>
  <section class="panel">
    <h2>{{ $t("logs.title") }}</h2>
    <table>
      <thead><tr><th>ID</th><th>{{ $t("logs.action") }}</th><th>{{ $t("logs.target") }}</th><th>{{ $t("logs.detail") }}</th><th>{{ $t("logs.operator") }}</th><th>{{ $t("logs.time") }}</th></tr></thead>
      <tbody><tr v-for="item in store.logs" :key="item.id"><td>{{ item.id }}</td><td>{{ item.action }}</td><td>{{ item.target }}</td><td>{{ item.detail }}</td><td>{{ item.username || '-' }}</td><td>{{ item.created_at }}</td></tr></tbody>
    </table>
    <div class="pager">
      <button :disabled="store.logsPage <= 1" @click="change(store.logsPage-1)">{{ $t("common.prev") }}</button>
      <span>{{ store.logsPage }} / {{ totalPage }}</span>
      <button :disabled="store.logsPage >= totalPage" @click="change(store.logsPage+1)">{{ $t("common.next") }}</button>
    </div>
  </section>
</template>
<script setup>
import { computed, onMounted } from "vue";
import { useEduStore } from "../stores/edu";
const store = useEduStore();
const totalPage = computed(() => Math.max(1, Math.ceil(store.logsTotal / store.logsPageSize)));
const change = async (p) => { store.logsPage = p; await store.safeRun(() => store.fetchLogs()); };
onMounted(() => store.safeRun(() => store.fetchLogs()));
</script>
