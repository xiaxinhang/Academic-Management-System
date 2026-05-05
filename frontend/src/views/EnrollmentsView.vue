<template>
  <section class="panel">
    <h2>{{ $t("enrollments.title") }}</h2>

    <form v-if="store.isAdmin" @submit.prevent="submit" class="form-grid">
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

      <button type="submit">{{ $t("enrollments.add") }}</button>
    </form>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>{{ $t("enrollments.studentNo") }}</th>
          <th>{{ $t("enrollments.studentName") }}</th>
          <th>{{ $t("courses.code") }}</th>
          <th>{{ $t("enrollments.courseName") }}</th>
          <th>{{ $t("enrollments.enrolledAt") }}</th>
          <th>{{ $t("courses.action") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in store.enrollments" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.student_no }}</td>
          <td>{{ item.student_name }}</td>
          <td>{{ item.course_code }}</td>
          <td>{{ item.course_name }}</td>
          <td>{{ item.enrolled_at }}</td>
          <td>
            <button v-if="store.isAdmin" class="danger" @click="store.safeRun(() => store.deleteEnrollment(item.id))">
              {{ $t("enrollments.drop") }}
            </button>
            <span v-else>-</span>
          </td>
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
const form = reactive({ studentId: null, courseId: null });

const submit = async () => {
  if (!form.studentId || !form.courseId) {
    return store.setMessage("error", t("msg.enrollFormInvalid"));
  }
  await store.safeRun(() => store.addEnrollment({ ...form }));
};

onMounted(() => {
  store.safeRun(async () => {
    await store.fetchEnrollments();
    if (store.isAdmin) {
      await store.fetchStudents();
      await store.fetchCourseOptions();
      if (!form.studentId && store.students.length > 0) form.studentId = store.students[0].id;
      if (!form.courseId && store.courseOptions.length > 0) form.courseId = store.courseOptions[0].id;
    }
  });
});
</script>
