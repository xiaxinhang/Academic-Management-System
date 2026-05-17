<template>
  <section class="table-panel" v-loading="store.loading">
    <div class="toolbar">
      <el-input v-model.trim="store.gradesKeyword" :prefix-icon="Search" :placeholder="$t('grades.searchPlaceholder')" clearable @keyup.enter="search" />
      <el-input v-if="store.isAdmin" v-model.trim="studentNo" class="narrow-input" :placeholder="$t('grades.queryByNo')" clearable @keyup.enter="search" />
      <el-button type="primary" :icon="Search" @click="search">{{ $t("common.search") }}</el-button>
      <el-button :icon="Refresh" @click="reset">{{ $t("common.reset") }}</el-button>
      <div class="toolbar-spacer"></div>
      <el-button :icon="Download" @click="store.safeRun(() => store.exportGrades())">{{ $t("common.export") }}</el-button>
      <el-button v-if="store.isAdmin || store.isTeacher" type="primary" :icon="Plus" @click="openEditor">{{ $t("grades.save") }}</el-button>
    </div>

    <el-table :data="store.grades" empty-text="暂无数据">
      <el-table-column prop="student_no" :label="$t('enrollments.studentNo')" min-width="120" />
      <el-table-column prop="student_name" :label="$t('enrollments.studentName')" min-width="120" />
      <el-table-column prop="course_code" :label="$t('courses.code')" min-width="120" />
      <el-table-column prop="course_name" :label="$t('enrollments.courseName')" min-width="160" />
      <el-table-column prop="score" :label="$t('grades.score')" width="120">
        <template #default="{ row }"><el-tag type="success">{{ row.score }}</el-tag></template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="pagination"
      layout="total, sizes, prev, pager, next"
      :total="store.gradesTotal"
      v-model:current-page="store.gradesPage"
      v-model:page-size="store.gradesPageSize"
      :page-sizes="[8, 10, 20, 50]"
      @change="fetch"
    />

    <el-dialog v-model="dialogVisible" :title="$t('grades.editTitle')" width="520px">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-form-item :label="$t('common.selectStudent')" prop="studentId">
          <el-select v-model="form.studentId" filterable>
            <el-option v-for="s in store.studentOptions" :key="s.id" :label="`${s.student_no} - ${s.student_name}`" :value="s.id" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('common.selectCourse')" prop="courseId">
          <el-select v-model="form.courseId" filterable>
            <el-option v-for="c in store.courseOptions" :key="c.id" :label="`${c.course_code} - ${c.course_name}`" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('grades.score')" prop="score">
          <el-input-number v-model="form.score" :min="0" :max="100" :precision="1" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ $t("common.cancel") }}</el-button>
        <el-button type="primary" @click="submit">{{ $t("common.save") }}</el-button>
      </template>
    </el-dialog>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { Download, Plus, Refresh, Search } from "@element-plus/icons-vue";
import { useEduStore } from "../stores/edu";

const { t } = useI18n();
const store = useEduStore();
const studentNo = ref("");
const dialogVisible = ref(false);
const formRef = ref();
const form = reactive({ studentId: null, courseId: null, score: 90 });
const rules = computed(() => ({
  studentId: [{ required: true, message: t("common.selectStudent"), trigger: "change" }],
  courseId: [{ required: true, message: t("common.selectCourse"), trigger: "change" }],
  score: [{ required: true, message: t("grades.score"), trigger: "change" }]
}));

const fetch = () => store.safeRun(() => store.fetchGrades(studentNo.value));
const search = () => {
  store.gradesPage = 1;
  fetch();
};
const reset = () => {
  studentNo.value = "";
  store.gradesKeyword = "";
  search();
};
const openEditor = async () => {
  await store.safeRun(async () => {
    await store.fetchStudentOptions();
    await store.fetchCourseOptions();
  });
  form.studentId = store.studentOptions[0]?.id || null;
  form.courseId = store.courseOptions[0]?.id || null;
  dialogVisible.value = true;
};
const submit = async () => {
  await formRef.value.validate();
  const ok = await store.safeRun(() => store.saveGrade({ ...form }));
  if (ok) dialogVisible.value = false;
};

onMounted(fetch);
</script>
