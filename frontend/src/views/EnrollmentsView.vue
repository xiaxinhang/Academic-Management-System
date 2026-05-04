<template>
  <section class="panel">
    <h2>{{ $t("enrollments.title") }}</h2>
    <form v-if="store.isAdmin" @submit.prevent="submit" class="form-grid">
      <input v-model.number="form.studentId" type="number" min="1" :placeholder="$t('enrollments.studentId')" required />
      <input v-model.number="form.courseId" type="number" min="1" :placeholder="$t('enrollments.courseId')" required />
      <button type="submit">{{ $t("enrollments.add") }}</button>
    </form>

    <table>
      <thead>
        <tr><th>ID</th><th>{{ $t("enrollments.studentNo") }}</th><th>{{ $t("enrollments.studentName") }}</th><th>{{ $t("courses.code") }}</th><th>{{ $t("enrollments.courseName") }}</th><th>{{ $t("enrollments.enrolledAt") }}</th><th>{{ $t("courses.action") }}</th></tr>
      </thead>
      <tbody>
        <tr v-for="item in store.enrollments" :key="item.id">
          <td>{{ item.id }}</td><td>{{ item.student_no }}</td><td>{{ item.student_name }}</td><td>{{ item.course_code }}</td><td>{{ item.course_name }}</td><td>{{ item.enrolled_at }}</td>
          <td><button v-if="store.isAdmin" class="danger" @click="remove(item.id)">{{ $t("enrollments.drop") }}</button><span v-else>-</span></td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useEduStore } from "../stores/edu";

const { t } = useI18n();
const store = useEduStore();
const form = reactive({ studentId: 1, courseId: 1 });

const safeRun = async (fn) => { try { store.clearMessage(); await fn(); } catch (e) { store.setMessage("error", e.message); } };

const submit = async () => {
  if (form.studentId < 1 || form.courseId < 1) {
    store.setMessage("error", t("msg.enrollFormInvalid"));
    return;
  }
  await safeRun(() => store.addEnrollment({ ...form }));
};

const remove = async (id) => { await safeRun(() => store.deleteEnrollment(id)); };

onMounted(() => safeRun(() => store.fetchEnrollments()));
</script>
