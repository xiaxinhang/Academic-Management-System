<template>
  <section class="panel">
    <h2>{{ $t("grades.title") }}</h2>

    <form class="inline" @submit.prevent="query" v-if="store.isAdmin">
      <input v-model.trim="studentNo" :placeholder="$t('grades.queryByNo')" />
      <button type="submit">{{ $t("common.search") }}</button>
    </form>

    <form v-if="store.isAdmin" @submit.prevent="save" class="form-grid">
      <select v-model.number="form.studentId" required>
        <option :value="null" disabled>{{ $t("common.selectStudent") }}</option>
        <option v-for="s in store.students" :key="s.id" :value="s.id">
          {{ s.student_no }} - {{ s.student_name }}
        </option>
      </select>

      <select v-model.number="form.courseId" required>
        <option :value="null" disabled>{{ $t("common.selectCourse") }}</option>
        <option v-for="c in store.courseOptions" :key="c.id" :value="c.id">
          {{ c.course_code }} - {{ c.course_name }}
        </option>
      </select>

      <input v-model.number="form.score" type="number" min="0" max="100" :placeholder="$t('grades.score')" required />
      <button type="submit">{{ $t("grades.save") }}</button>
    </form>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>{{ $t("enrollments.studentNo") }}</th>
          <th>{{ $t("enrollments.studentName") }}</th>
          <th>{{ $t("courses.code") }}</th>
          <th>{{ $t("enrollments.courseName") }}</th>
          <th>{{ $t("grades.score") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in store.grades" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.student_no }}</td>
          <td>{{ item.student_name }}</td>
          <td>{{ item.course_code }}</td>
          <td>{{ item.course_name }}</td>
          <td><strong>{{ item.score }}</strong></td>
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
const form = reactive({ studentId: null, courseId: null, score: 90 });

const query = async () => store.safeRun(() => store.fetchGrades(studentNo.value));

const save = async () => {
  if (!form.studentId || !form.courseId || form.score < 0 || form.score > 100) {
    return store.setMessage("error", t("msg.gradeInvalid"));
  }
  await store.safeRun(() => store.saveGrade({ ...form }));
};

onMounted(() => {
  store.safeRun(async () => {
    await store.fetchGrades();
    if (store.isAdmin) {
      await store.fetchStudents();
      await store.fetchCourseOptions();
      if (!form.studentId && store.students.length > 0) form.studentId = store.students[0].id;
      if (!form.courseId && store.courseOptions.length > 0) form.courseId = store.courseOptions[0].id;
    }
  });
});
</script>
