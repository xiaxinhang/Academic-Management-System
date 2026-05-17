<template>
  <section class="table-panel" v-loading="store.loading">
    <div class="toolbar">
      <el-input v-model.trim="store.coursesKeyword" :prefix-icon="Search" :placeholder="$t('courses.searchPlaceholder')" clearable @keyup.enter="search" />
      <el-button type="primary" :icon="Search" @click="search">{{ $t("common.search") }}</el-button>
      <el-button :icon="Refresh" @click="reset">{{ $t("common.reset") }}</el-button>
      <div class="toolbar-spacer"></div>
      <el-button :icon="Download" @click="store.safeRun(() => store.exportCourses())">{{ $t("common.export") }}</el-button>
      <el-button v-if="store.isAdmin" type="danger" :icon="Delete" :disabled="!store.selectedCourseIds.length" @click="batchDelete">{{ $t("common.batchDelete") }}</el-button>
      <el-button v-if="store.isAdmin" type="primary" :icon="Plus" @click="openCreate">{{ $t("courses.add") }}</el-button>
    </div>

    <el-table :data="store.courses" empty-text="暂无数据" @selection-change="onSelectionChange">
      <el-table-column v-if="store.isAdmin" type="selection" width="48" />
      <el-table-column prop="course_code" :label="$t('courses.code')" min-width="120" />
      <el-table-column prop="course_name" :label="$t('courses.name')" min-width="160" />
      <el-table-column prop="teacher" :label="$t('courses.teacher')" min-width="120" />
      <el-table-column prop="credit" :label="$t('courses.credit')" width="90" />
      <el-table-column prop="capacity" :label="$t('courses.capacity')" width="100" />
      <el-table-column prop="selected_count" :label="$t('courses.selected')" width="110" />
      <el-table-column v-if="store.isAdmin" :label="$t('common.actions')" width="160" fixed="right">
        <template #default="{ row }">
          <el-button size="small" :icon="Edit" @click="openEdit(row)">{{ $t("common.edit") }}</el-button>
          <el-popconfirm :title="$t('common.confirmDelete')" @confirm="store.safeRun(() => store.deleteCourse(row.id))">
            <template #reference>
              <el-button size="small" type="danger" :icon="Delete">{{ $t("common.delete") }}</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="pagination"
      layout="total, sizes, prev, pager, next"
      :total="store.coursesTotal"
      v-model:current-page="store.coursesPage"
      v-model:page-size="store.coursesPageSize"
      :page-sizes="[8, 10, 20, 50]"
      @change="fetch"
    />

    <el-dialog v-model="dialogVisible" :title="editId ? $t('courses.edit') : $t('courses.add')" width="520px">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-form-item :label="$t('courses.code')" prop="courseCode"><el-input v-model.trim="form.courseCode" /></el-form-item>
        <el-form-item :label="$t('courses.name')" prop="courseName"><el-input v-model.trim="form.courseName" /></el-form-item>
        <el-form-item :label="$t('courses.teacher')" prop="teacher"><el-input v-model.trim="form.teacher" /></el-form-item>
        <div class="form-two">
          <el-form-item :label="$t('courses.credit')" prop="credit"><el-input-number v-model="form.credit" :min="1" :max="8" /></el-form-item>
          <el-form-item :label="$t('courses.capacity')" prop="capacity"><el-input-number v-model="form.capacity" :min="1" /></el-form-item>
        </div>
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
import { Delete, Download, Edit, Plus, Refresh, Search } from "@element-plus/icons-vue";
import { useEduStore } from "../stores/edu";

const { t } = useI18n();
const store = useEduStore();
const dialogVisible = ref(false);
const editId = ref(null);
const formRef = ref();
const form = reactive({ courseCode: "", courseName: "", teacher: "", credit: 3, capacity: 50 });

const rules = computed(() => ({
  courseCode: [{ required: true, message: t("courses.code"), trigger: "blur" }],
  courseName: [{ required: true, message: t("courses.name"), trigger: "blur" }],
  teacher: [{ required: true, message: t("courses.teacher"), trigger: "blur" }],
  credit: [{ required: true, message: t("courses.credit"), trigger: "change" }],
  capacity: [{ required: true, message: t("courses.capacity"), trigger: "change" }]
}));

const fetch = () => store.safeRun(() => store.fetchCourses());
const search = () => {
  store.coursesPage = 1;
  fetch();
};
const reset = () => {
  store.coursesKeyword = "";
  search();
};
const onSelectionChange = (rows) => {
  store.selectedCourseIds = rows.map((row) => row.id);
};
const openCreate = () => {
  editId.value = null;
  Object.assign(form, { courseCode: "", courseName: "", teacher: "", credit: 3, capacity: 50 });
  dialogVisible.value = true;
};
const openEdit = (row) => {
  editId.value = row.id;
  Object.assign(form, {
    courseCode: row.course_code,
    courseName: row.course_name,
    teacher: row.teacher,
    credit: row.credit,
    capacity: row.capacity
  });
  dialogVisible.value = true;
};
const submit = async () => {
  await formRef.value.validate();
  const ok = await store.safeRun(() => (editId.value ? store.updateCourse(editId.value, { ...form }) : store.addCourse({ ...form })));
  if (ok) dialogVisible.value = false;
};
const batchDelete = () => store.safeRun(() => store.batchDeleteCourses());

onMounted(fetch);
</script>
