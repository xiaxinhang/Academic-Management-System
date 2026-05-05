<template>
  <section class="panel">
    <h2>{{ $t("users.title") }}</h2>

    <form class="form-grid" @submit.prevent="submit">
      <input v-model.trim="form.username" :placeholder="$t('users.username')" :disabled="Boolean(editId)" required />
      <input v-model.trim="form.password" :placeholder="$t('users.password')" required />

      <select v-model="form.role">
        <option value="admin">admin</option>
        <option value="student">student</option>
      </select>

      <select v-model.number="form.studentId" :disabled="form.role !== 'student'">
        <option :value="null">{{ $t("common.selectStudent") }}</option>
        <option v-for="s in store.students" :key="s.id" :value="s.id">
          {{ s.student_no }} - {{ s.student_name }}
        </option>
      </select>

      <button type="submit">{{ editId ? $t("common.update") : $t("users.add") }}</button>
    </form>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>{{ $t("users.username") }}</th>
          <th>{{ $t("users.role") }}</th>
          <th>{{ $t("users.bindStudent") }}</th>
          <th>{{ $t("courses.action") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in store.users" :key="u.id">
          <td>{{ u.id }}</td>
          <td>{{ u.username }}</td>
          <td>{{ u.role }}</td>
          <td>{{ u.student_name ? `${u.student_name} (#${u.student_id})` : "-" }}</td>
          <td>
            <button @click="edit(u)">{{ $t("common.update") }}</button>
            <button class="danger" @click="store.safeRun(() => store.deleteUser(u.id))">{{ $t("common.delete") }}</button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
import { reactive, ref, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useEduStore } from "../stores/edu";

const { t } = useI18n();
const store = useEduStore();
const editId = ref(null);
const form = reactive({ username: "", password: "", role: "student", studentId: null });

watch(
  () => form.role,
  (role) => {
    if (role !== "student") form.studentId = null;
    if (role === "student" && !form.studentId && store.students.length > 0) form.studentId = store.students[0].id;
  }
);

const edit = (u) => {
  editId.value = u.id;
  form.username = u.username;
  form.password = "123456";
  form.role = u.role;
  form.studentId = u.student_id || null;
};

const clear = () => {
  editId.value = null;
  form.username = "";
  form.password = "";
  form.role = "student";
  form.studentId = store.students[0]?.id || null;
};

const submit = async () => {
  if (form.role === "student" && !form.studentId) {
    return store.setMessage("error", t("common.selectStudent"));
  }
  await store.safeRun(() =>
    editId.value
      ? store.updateUser(editId.value, { password: form.password, role: form.role, studentId: form.studentId })
      : store.addUser({ ...form })
  );
  clear();
};

onMounted(() =>
  store.safeRun(async () => {
    await store.fetchUsers();
    await store.fetchStudents();
    if (!form.studentId && store.students.length > 0) form.studentId = store.students[0].id;
  })
);
</script>
