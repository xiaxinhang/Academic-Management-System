<template>
  <section class="table-panel" v-loading="store.loading">
    <div class="toolbar">
      <el-input v-model.trim="store.studentsKeyword" :prefix-icon="Search" :placeholder="$t('students.searchPlaceholder')" clearable @keyup.enter="search" />
      <el-button type="primary" :icon="Search" @click="search">{{ $t("common.search") }}</el-button>
      <el-button :icon="Refresh" @click="reset">{{ $t("common.reset") }}</el-button>
      <div class="toolbar-spacer"></div>
      <el-button :icon="Download" @click="store.safeRun(() => store.exportStudents())">{{ $t("common.export") }}</el-button>
      <el-button type="danger" :icon="Delete" :disabled="!store.selectedStudentIds.length" @click="store.safeRun(() => store.batchDeleteStudents())">{{ $t("common.batchDelete") }}</el-button>
      <el-button type="primary" :icon="Plus" @click="openCreate">{{ $t("students.add") }}</el-button>
    </div>

    <el-table :data="store.students" empty-text="暂无数据" @selection-change="onSelectionChange">
      <el-table-column type="selection" width="48" />
      <el-table-column prop="student_no" :label="$t('students.no')" min-width="130" />
      <el-table-column prop="student_name" :label="$t('students.name')" min-width="120" />
      <el-table-column prop="class_name" :label="$t('students.className')" min-width="150" />
      <el-table-column prop="grade_year" :label="$t('students.gradeYear')" width="120" />
      <el-table-column :label="$t('common.actions')" width="160" fixed="right">
        <template #default="{ row }">
          <el-button size="small" :icon="Edit" @click="openEdit(row)">{{ $t("common.edit") }}</el-button>
          <el-popconfirm :title="$t('common.confirmDelete')" @confirm="store.safeRun(() => store.deleteStudent(row.id))">
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
      :total="store.studentsTotal"
      v-model:current-page="store.studentsPage"
      v-model:page-size="store.studentsPageSize"
      :page-sizes="[8, 10, 20, 50]"
      @change="fetch"
    />

    <el-dialog v-model="dialogVisible" :title="editId ? $t('students.edit') : $t('students.add')" width="520px">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-form-item :label="$t('students.no')" prop="studentNo"><el-input v-model.trim="form.studentNo" /></el-form-item>
        <el-form-item :label="$t('students.name')" prop="studentName"><el-input v-model.trim="form.studentName" /></el-form-item>
        <el-form-item :label="$t('students.className')"><el-input v-model.trim="form.className" /></el-form-item>
        <el-form-item :label="$t('students.gradeYear')"><el-input-number v-model="form.gradeYear" :min="2000" :max="2100" /></el-form-item>
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
const form = reactive({ studentNo: "", studentName: "", className: "", gradeYear: 2023 });
const rules = computed(() => ({
  studentNo: [{ required: true, message: t("students.no"), trigger: "blur" }],
  studentName: [{ required: true, message: t("students.name"), trigger: "blur" }]
}));

const fetch = () => store.safeRun(() => store.fetchStudents());
const search = () => {
  store.studentsPage = 1;
  fetch();
};
const reset = () => {
  store.studentsKeyword = "";
  search();
};
const onSelectionChange = (rows) => {
  store.selectedStudentIds = rows.map((row) => row.id);
};
const openCreate = () => {
  editId.value = null;
  Object.assign(form, { studentNo: "", studentName: "", className: "", gradeYear: 2023 });
  dialogVisible.value = true;
};
const openEdit = (row) => {
  editId.value = row.id;
  Object.assign(form, {
    studentNo: row.student_no,
    studentName: row.student_name,
    className: row.class_name || "",
    gradeYear: row.grade_year || 2023
  });
  dialogVisible.value = true;
};
const submit = async () => {
  await formRef.value.validate();
  const ok = await store.safeRun(() => (editId.value ? store.updateStudent(editId.value, { ...form }) : store.addStudent({ ...form })));
  if (ok) dialogVisible.value = false;
};

onMounted(fetch);
</script>
