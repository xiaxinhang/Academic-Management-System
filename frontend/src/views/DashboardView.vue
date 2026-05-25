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
      <section v-if="store.isAdmin" class="chart-panel">
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

    <section class="table-panel notice-panel">
      <div class="notice-head">
        <div class="panel-title">事务通知</div>
        <el-button v-if="store.isAdmin" size="small" type="primary" :icon="Plus" @click="noticeDialogVisible = true">发布事务</el-button>
      </div>
      <el-scrollbar height="220px">
        <div v-if="!store.notices.length" class="notice-empty">暂无通知</div>
        <a
          v-for="(item, index) in store.notices"
          :key="item.id"
          class="notice-row"
          :href="item.link_url"
          @click.prevent="openNotice(item.link_url)"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="notice-title">{{ `${index + 1}. ${item.title}` }}</span>
          <span class="notice-time">{{ String(item.created_at).slice(0, 10) }}</span>
        </a>
      </el-scrollbar>
    </section>

    <section v-if="store.isAdmin" class="table-panel">
      <div class="panel-title">{{ $t("dashboard.hot") }}</div>
      <el-table :data="store.courseStats" empty-text="暂无数据">
        <el-table-column prop="course_name" :label="$t('courses.name')" min-width="160" />
        <el-table-column prop="selectedCount" :label="$t('dashboard.c3')" width="140" />
        <el-table-column prop="avgScore" :label="$t('dashboard.c4')" width="140">
          <template #default="{ row }">{{ row.avgScore || "-" }}</template>
        </el-table-column>
      </el-table>
    </section>

    <el-dialog v-model="noticeDialogVisible" title="发布事务" width="620px">
      <el-form ref="noticeFormRef" :model="noticeForm" :rules="noticeRules" label-position="top">
        <el-form-item label="新闻标题" prop="title">
          <el-input v-model.trim="noticeForm.title" maxlength="80" show-word-limit />
        </el-form-item>
        <el-form-item label="事务链接" prop="linkUrl">
          <el-input v-model.trim="noticeForm.linkUrl" placeholder="https://example.com/news/123" />
        </el-form-item>
        <el-form-item label="简述">
          <el-input v-model.trim="noticeForm.summary" type="textarea" :rows="3" maxlength="200" show-word-limit />
        </el-form-item>
      </el-form>

      <el-table :data="store.noticeAdminList" height="220">
        <el-table-column prop="title" label="已发布标题" min-width="260">
          <template #default="{ row }">
            <a :href="row.link_url" target="_blank" rel="noopener noreferrer">{{ row.title }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="发布时间" width="140">
          <template #default="{ row }">{{ String(row.created_at).slice(0, 10) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-popconfirm title="确认删除该通知？" @confirm="store.safeRun(() => store.deleteNotice(row.id))">
              <template #reference>
                <el-button size="small" type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <template #footer>
        <el-button @click="noticeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitNotice">发布</el-button>
      </template>
    </el-dialog>
  </section>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import * as echarts from "echarts";
import { Collection, User, Tickets, TrendCharts, Plus } from "@element-plus/icons-vue";
import { useEduStore } from "../stores/edu";

const { t } = useI18n();
const store = useEduStore();
const noticeDialogVisible = ref(false);
const noticeFormRef = ref();
const noticeForm = ref({ title: "", linkUrl: "", summary: "" });
const noticeRules = {
  title: [{ required: true, message: "请输入新闻标题", trigger: "blur" }],
  linkUrl: [{ required: true, message: "请输入事务链接", trigger: "blur" }]
};
const topChartRef = ref();
const gradeChartRef = ref();
const logChartRef = ref();
let topChart;
let gradeChart;
let logChart;

const kpis = computed(() => {
  const base = [
    { label: t("dashboard.c1"), value: store.dashboard.courseCount, icon: Collection },
    { label: t("dashboard.c3"), value: store.dashboard.enrollCount, icon: Tickets },
    { label: t("dashboard.c4"), value: store.dashboard.avgScore, icon: TrendCharts }
  ];

  if (store.isAdmin) {
    base.splice(1, 0, { label: t("dashboard.c2"), value: store.dashboard.studentCount, icon: User });
  }

  return base;
});

function renderCharts() {
  if (store.isAdmin && topChartRef.value) {
    topChart = topChart || echarts.init(topChartRef.value);
  }
  gradeChart = gradeChart || echarts.init(gradeChartRef.value);
  if (store.isAdmin && logChartRef.value) logChart = logChart || echarts.init(logChartRef.value);

  if (topChart) {
    topChart.setOption({
      tooltip: {},
      grid: { left: 36, right: 16, top: 20, bottom: 36 },
      xAxis: { type: "category", data: store.topCourses.map((item) => item.course_name) },
      yAxis: { type: "value" },
      series: [{ type: "bar", data: store.topCourses.map((item) => item.selectedCount), itemStyle: { color: "#2563eb" } }]
    });
  }

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

function openNotice(rawUrl) {
  const url = String(rawUrl || "").trim();
  if (!url) return;
  const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  const win = window.open(normalized, "_blank", "noopener,noreferrer");
  if (!win) {
    window.location.href = normalized;
  }
}

async function submitNotice() {
  try {
    await noticeFormRef.value.validate();
  } catch {
    return;
  }
  const ok = await store.safeRun(() => store.createNotice(noticeForm.value));
  if (ok) {
    noticeForm.value = { title: "", linkUrl: "", summary: "" };
  }
}

onMounted(() => {
  store.safeRun(async () => {
    await store.fetchDashboard();
    await store.fetchGradeDistribution();
    await store.fetchNotices();
    if (store.isAdmin) {
      await Promise.all([
        store.fetchCourseStats(),
        store.fetchTopCourses(),
        store.fetchLogTrend(),
        store.fetchNoticeAdminList()
      ]);
    }
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
