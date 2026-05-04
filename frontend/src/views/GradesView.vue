<template>
  <section class="panel">
    <h2>{{ $t("grades.title") }}</h2>
    <form class="inline" @submit.prevent="query" v-if="store.isAdmin">
      <input v-model.trim="studentNo" :placeholder="$t('grades.queryByNo')" />
      <button type="submit">{{ $t("common.search") }}</button>
    </form>

    <h3 v-if="store.isAdmin">{{ $t("grades.editTitle") }}</h3>
    <form v-if="store.isAdmin" @submit.prevent="save" class="form-grid">
      <input v-model.number="form.studentId" type="number" min="1" :placeholder="$t('enrollments.studentId')" required />
      <input v-model.number="form.courseId" type="number" min="1" :placeholder="$t('enrollments.courseId')" required />
      <input v-model.number="form.score" type="number" min="0" max="100" :placeholder="$t('grades.score')" required />
      <button type="submit">{{ $t("grades.save") }}</button>
    </form>

    <table>
      <thead>
        <tr><th>ID</th><th>{{ $t("enrollments.studentNo") }}</th><th>{{ $t("enrollments.studentName") }}</th><th>{{ $t("courses.code") }}</th><th>{{ $t("enrollments.courseName") }}</th><th>{{ $t("grades.score") }}</th></tr>
      </thead>
      <tbody>
        <tr v-for="item in store.grades" :key="item.id">
          <td>{{ item.id }}</td><td>{{ item.student_no }}</td><td>{{ item.student_name }}</td><td>{{ item.course_code }}</td><td>{{ item.course_name }}</td><td><strong>{{ item.score }}</strong></td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useEduStore } from "../stores/edu";

const { t } = useI18n();
const store = useEduStore();
const studentNo = ref("");
const form = reactive({ studentId: 1, courseId: 1, score: 90 });

const safeRun = async (fn) => { try { store.clearMessage(); await fn(); } catch (e) { store.setMessage("error", e.message); } };
const query = async () => { await safeRun(() => store.fetchGrades(studentNo.value)); };

const save = async () => {
  if (form.studentId < 1 || form.courseId < 1 || form.score < 0 || form.score > 100) {
    store.setMessage("error", t("msg.gradeInvalid"));
    return;
  }
  await safeRun(() => store.saveGrade({ ...form }));
};

onMounted(() => safeRun(() => store.fetchGrades()));
</script>
