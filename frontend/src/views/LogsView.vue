<template>
  <section class="table-panel" v-loading="store.loading">
    <div class="toolbar">
      <div class="panel-title">{{ $t("logs.title") }}</div>
    </div>
    <el-table :data="store.logs" empty-text="暂无数据">
      <el-table-column prop="id" label="ID" width="90" />
      <el-table-column prop="action" :label="$t('logs.action')" width="120">
        <template #default="{ row }"><el-tag>{{ row.action }}</el-tag></template>
      </el-table-column>
      <el-table-column prop="target" :label="$t('logs.target')" width="130" />
      <el-table-column prop="detail" :label="$t('logs.detail')" min-width="220" />
      <el-table-column prop="username" :label="$t('logs.operator')" width="140">
        <template #default="{ row }">{{ row.username || "-" }}</template>
      </el-table-column>
      <el-table-column prop="created_at" :label="$t('logs.time')" min-width="180" />
    </el-table>
    <el-pagination
      class="pagination"
      layout="total, sizes, prev, pager, next"
      :total="store.logsTotal"
      v-model:current-page="store.logsPage"
      v-model:page-size="store.logsPageSize"
      :page-sizes="[10, 20, 50]"
      @change="fetch"
    />
  </section>
</template>

<script setup>
import { onMounted } from "vue";
import { useEduStore } from "../stores/edu";

const store = useEduStore();
const fetch = () => store.safeRun(() => store.fetchLogs());

onMounted(fetch);
</script>
