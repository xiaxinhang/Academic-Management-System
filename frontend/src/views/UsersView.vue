<template>
  <section class="table-panel" v-loading="store.loading">
    <div class="toolbar">
      <div class="panel-title">{{ $t("users.title") }}</div>
      <div class="toolbar-spacer"></div>
      <el-button type="primary" :icon="Plus" @click="openCreate">{{ $t("users.add") }}</el-button>
    </div>

    <el-table :data="store.users" empty-text="暂无数据">
      <el-table-column prop="id" label="ID" width="90" />
      <el-table-column prop="username" :label="$t('users.username')" min-width="140" />
      <el-table-column prop="role" :label="$t('users.role')" width="120">
        <template #default="{ row }"><el-tag>{{ row.role }}</el-tag></template>
      </el-table-column>
      <el-table-column :label="$t('users.bindStudent')" min-width="160">
        <template #default="{ row }">{{ row.student_name ? `${row.student_name} (#${row.student_id})` : "-" }}</template>
      </el-table-column>
      <el-table-column :label="$t('common.actions')" width="160" fixed="right">
        <template #default="{ row }">
          <el-button size="small" :icon="Edit" @click="openEdit(row)">{{ $t("common.edit") }}</el-button>
          <el-popconfirm :title="$t('common.confirmDelete')" @confirm="store.safeRun(() => store.deleteUser(row.id))">
            <template #reference>
              <el-button size="small" type="danger" :icon="Delete">{{ $t("common.delete") }}</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="editId ? $t('users.edit') : $t('users.add')" width="520px">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-form-item :label="$t('users.username')" prop="username">
          <el-input v-model.trim="form.username" :disabled="Boolean(editId)" />
        </el-form-item>
        <el-form-item :label="$t('users.password')" prop="password">
          <el-input v-model.trim="form.password" type="password" show-password :placeholder="editId ? $t('users.passwordTip') : ''" />
        </el-form-item>
        <el-form-item :label="$t('users.role')" prop="role">
          <el-select v-model="form.role">
            <el-option label="admin" value="admin" />
            <el-option label="student" value="student" />
            <el-option label="teacher" value="teacher" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.role === 'student'" :label="$t('users.bindStudent')" prop="studentId">
          <el-select v-model="form.studentId" filterable>
            <el-option v-for="s in store.studentOptions" :key="s.id" :label="`${s.student_no} - ${s.student_name}`" :value="s.id" />
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
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { Delete, Edit, Plus } from "@element-plus/icons-vue";
import { useEduStore } from "../stores/edu";

const { t } = useI18n();
const store = useEduStore();
const dialogVisible = ref(false);
const editId = ref(null);
const formRef = ref();
const form = reactive({ username: "", password: "", role: "student", studentId: null });

const rules = computed(() => ({
  username: [{ required: true, message: t("users.username"), trigger: "blur" }],
  password: [{ required: !editId.value, message: t("users.password"), trigger: "blur" }],
  role: [{ required: true, message: t("users.role"), trigger: "change" }],
  studentId: [{ required: form.role === "student", message: t("common.selectStudent"), trigger: "change" }]
}));

watch(() => form.role, (role) => {
  if (role !== "student") form.studentId = null;
});

const openCreate = () => {
  editId.value = null;
  Object.assign(form, { username: "", password: "", role: "student", studentId: store.studentOptions[0]?.id || null });
  dialogVisible.value = true;
};
const openEdit = (row) => {
  editId.value = row.id;
  Object.assign(form, { username: row.username, password: "", role: row.role, studentId: row.student_id || null });
  dialogVisible.value = true;
};
const submit = async () => {
  await formRef.value.validate();
  const payload = { password: form.password, role: form.role, studentId: form.studentId };
  const ok = await store.safeRun(() => (editId.value ? store.updateUser(editId.value, payload) : store.addUser({ ...form })));
  if (ok) dialogVisible.value = false;
};

onMounted(() => store.safeRun(async () => {
  await store.fetchUsers();
  await store.fetchStudentOptions();
}));
</script>
