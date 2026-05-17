<template>
  <section v-loading="store.loading" class="page-stack">
    <div class="kpi-grid">
      <el-card v-for="item in kpis" :key="item.label" class="kpi-card" shadow="never">
        <div class="kpi-icon"><el-icon><component :is="item.icon" /></el-icon></div>
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
      </el-card>
    </div>

    <div class="chart-grid">
      <section class="chart-panel">
        <h3>{{ $t("dashboard.topCourses") }}</h3>
        <div ref="topChartRef" class="chart"></div>
      </section>
      <section class="chart-panel">
        <h3>{{ $t("dashboard.gradeDistribution") }}</h3>
        <div ref="gradeChartRef" class="chart"></div>
      </section>
      <section v-if="store.isAdmin" class="chart-panel chart-wide">
        <h3>{{ $t("dashboard.logTrend") }}</h3>
        <div ref="logChartRef" class="chart"></div>
      </section>
    </div>

    <section class="table-panel">
      <div class="panel-title">{{ $t("dashboard.hot") }}</div>
      <el-table :data="store.courseStats" empty-text="暂无数据">
        <el-table-column prop="course_name" :label="$t('courses.name')" min-width="160" />
        <el-table-column prop="selectedCount" :label="$t('dashboard.c3')" width="140" />
        <el-table-column prop="avgScore" :label="$t('dashboard.c4')" width="140">
          <template #default="{ row }">{{ row.avgScore || "-" }}</template>
        </el-table-column>
      </el-table>
    </section>
  </section>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import * as echarts from "echarts";
import { Collection, User, Tickets, TrendCharts } from "@element-plus/icons-vue";
import { useEduStore } from "../stores/edu";

const { t } = useI18n();
const store = useEduStore();
const topChartRef = ref();
const gradeChartRef = ref();
const logChartRef = ref();
let topChart;
let gradeChart;
let logChart;

const kpis = computed(() => [
  { label: t("dashboard.c1"), value: store.dashboard.courseCount, icon: Collection },
  { label: t("dashboard.c2"), value: store.dashboard.studentCount, icon: User },
  { label: t("dashboard.c3"), value: store.dashboard.enrollCount, icon: Tickets },
  { label: t("dashboard.c4"), value: store.dashboard.avgScore, icon: TrendCharts }
]);

function renderCharts() {
  topChart = topChart || echarts.init(topChartRef.value);
  gradeChart = gradeChart || echarts.init(gradeChartRef.value);
  if (store.isAdmin && logChartRef.value) logChart = logChart || echarts.init(logChartRef.value);

  topChart.setOption({
    tooltip: {},
    grid: { left: 36, right: 16, top: 20, bottom: 36 },
    xAxis: { type: "category", data: store.topCourses.map((item) => item.course_name) },
    yAxis: { type: "value" },
    series: [{ type: "bar", data: store.topCourses.map((item) => item.selectedCount), itemStyle: { color: "#2563eb" } }]
  });

  const distribution = store.gradeDistribution || {};
  gradeChart.setOption({
    tooltip: { trigger: "item" },
    legend: { bottom: 0 },
    series: [{
      type: "pie",
      radius: ["42%", "68%"],
      data: [
        { name: "<60", value: distribution.fail || 0 },
        { name: "60-69", value: distribution.pass || 0 },
        { name: "70-79", value: distribution.medium || 0 },
        { name: "80-89", value: distribution.good || 0 },
        { name: "90+", value: distribution.excellent || 0 }
      ]
    }]
  });

  if (logChart) {
    logChart.setOption({
      tooltip: { trigger: "axis" },
      grid: { left: 36, right: 16, top: 24, bottom: 36 },
      xAxis: { type: "category", data: store.logTrend.map((item) => String(item.date).slice(0, 10)) },
      yAxis: { type: "value" },
      series: [{ type: "line", smooth: true, areaStyle: {}, data: store.logTrend.map((item) => item.count), color: "#0f766e" }]
    });
  }
}

function resizeCharts() {
  topChart?.resize();
  gradeChart?.resize();
  logChart?.resize();
}

onMounted(() => {
  store.safeRun(async () => {
    await Promise.all([
      store.fetchDashboard(),
      store.fetchCourseStats(),
      store.fetchTopCourses(),
      store.fetchGradeDistribution(),
      store.fetchLogTrend()
    ]);
    await nextTick();
    renderCharts();
  });
  window.addEventListener("resize", resizeCharts);
});

onUnmounted(() => {
  window.removeEventListener("resize", resizeCharts);
  topChart?.dispose();
  gradeChart?.dispose();
  logChart?.dispose();
});
</script>
