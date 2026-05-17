<template>
  <section class="table-panel" v-loading="store.loading">
    <div class="toolbar">
      <el-input v-model.trim="store.enrollmentsKeyword" :prefix-icon="Search" :placeholder="$t('enrollments.searchPlaceholder')" clearable @keyup.enter="search" />
      <el-button type="primary" :icon="Search" @click="search">{{ $t("common.search") }}</el-button>
      <el-button :icon="Refresh" @click="reset">{{ $t("common.reset") }}</el-button>
      <div class="toolbar-spacer"></div>
      <el-button type="primary" :icon="Plus" @click="openCreate">{{ $t("enrollments.add") }}</el-button>
    </div>

    <el-table :data="store.enrollments" empty-text="暂无数据">
      <el-table-column prop="student_no" :label="$t('enrollments.studentNo')" min-width="120" />
      <el-table-column prop="student_name" :label="$t('enrollments.studentName')" min-width="120" />
      <el-table-column prop="course_code" :label="$t('courses.code')" min-width="120" />
      <el-table-column prop="course_name" :label="$t('enrollments.courseName')" min-width="160" />
      <el-table-column prop="enrolled_at" :label="$t('enrollments.enrolledAt')" min-width="170" />
      <el-table-column :label="$t('common.actions')" width="110" fixed="right">
        <template #default="{ row }">
          <el-popconfirm :title="$t('common.confirmDelete')" @confirm="store.safeRun(() => store.deleteEnrollment(row.id))">
            <template #reference>
              <el-button size="small" type="danger" :icon="Delete">{{ $t("enrollments.drop") }}</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="pagination"
      layout="total, sizes, prev, pager, next"
      :total="store.enrollmentsTotal"
      v-model:current-page="store.enrollmentsPage"
      v-model:page-size="store.enrollmentsPageSize"
      :page-sizes="[8, 10, 20, 50]"
      @change="fetch"
    />

    <el-dialog v-model="dialogVisible" :title="$t('enrollments.add')" width="520px">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-form-item v-if="store.isAdmin" :label="$t('common.selectStudent')" prop="studentId">
          <el-select v-model="form.studentId" filterable>
            <el-option v-for="s in store.studentOptions" :key="s.id" :label="`${s.student_no} - ${s.student_name}`" :value="s.id" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('common.selectCourse')" prop="courseId">
          <el-select v-model="form.courseId" filterable>
            <el-option v-for="c in store.courseOptions" :key="c.id" :label="`${c.course_code} - ${c.course_name}`" :value="c.id" />
          </el-select>
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
import { Delete, Plus, Refresh, Search } from "@element-plus/icons-vue";
import { useEduStore } from "../stores/edu";

const { t } = useI18n();
const store = useEduStore();
const dialogVisible = ref(false);
const formRef = ref();
const form = reactive({ studentId: null, courseId: null });
const rules = computed(() => ({
  studentId: [{ required: store.isAdmin, message: t("common.selectStudent"), trigger: "change" }],
  courseId: [{ required: true, message: t("common.selectCourse"), trigger: "change" }]
}));

const fetch = () => store.safeRun(() => store.fetchEnrollments());
const search = () => {
  store.enrollmentsPage = 1;
  fetch();
};
const reset = () => {
  store.enrollmentsKeyword = "";
  search();
};
const openCreate = async () => {
  await store.safeRun(async () => {
    if (store.isAdmin) await store.fetchStudentOptions();
    await store.fetchCourseOptions();
  });
  form.studentId = store.studentOptions[0]?.id || null;
  form.courseId = store.courseOptions[0]?.id || null;
  dialogVisible.value = true;
};
const submit = async () => {
  await formRef.value.validate();
  const ok = await store.safeRun(() => store.addEnrollment({ ...form }));
  if (ok) dialogVisible.value = false;
};

onMounted(fetch);
</script>
