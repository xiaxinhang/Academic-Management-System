<template>
  <section class="panel">
    <div class="panel-top">
      <h2>{{ $t("courses.title") }}</h2>
      <div class="inline">
        <input v-model.trim="store.coursesKeyword" :placeholder="$t('courses.searchPlaceholder')" />
        <button @click="search">{{ $t("common.search") }}</button>
      </div>
    </div>

    <form v-if="store.isAdmin" class="form-grid" @submit.prevent="submitCourse">
      <input v-model.trim="form.courseCode" :placeholder="$t('courses.code')" required />
      <input v-model.trim="form.courseName" :placeholder="$t('courses.name')" required />
      <input v-model.trim="form.teacher" :placeholder="$t('courses.teacher')" required />
      <input v-model.number="form.credit" type="number" min="1" max="8" :placeholder="$t('courses.credit')" required />
      <button type="submit">{{ editId ? $t("common.update") : $t("courses.add") }}</button>
    </form>

    <table>
      <thead><tr><th>ID</th><th>{{ $t("courses.code") }}</th><th>{{ $t("courses.name") }}</th><th>{{ $t("courses.teacher") }}</th><th>{{ $t("courses.credit") }}</th><th>{{ $t("courses.action") }}</th></tr></thead>
      <tbody>
        <tr v-for="item in store.courses" :key="item.id">
          <td>{{ item.id }}</td><td>{{ item.course_code }}</td><td>{{ item.course_name }}</td><td>{{ item.teacher }}</td><td>{{ item.credit }}</td>
          <td>
            <button v-if="store.isAdmin" @click="startEdit(item)">{{ $t("common.update") }}</button>
            <button v-if="store.isAdmin" class="danger" @click="store.safeRun(() => store.deleteCourse(item.id))">{{ $t("common.delete") }}</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pager">
      <button :disabled="store.coursesPage <= 1" @click="changePage(store.coursesPage-1)">{{ $t("common.prev") }}</button>
      <span>{{ $t("courses.pageInfo", { page: store.coursesPage, total: totalPage }) }}</span>
      <button :disabled="store.coursesPage >= totalPage" @click="changePage(store.coursesPage+1)">{{ $t("common.next") }}</button>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useEduStore } from "../stores/edu";
const { t } = useI18n();
const store = useEduStore();
const editId = ref(null);
const form = reactive({ courseCode: "", courseName: "", teacher: "", credit: 3 });
const totalPage = computed(() => Math.max(1, Math.ceil(store.coursesTotal / store.coursesPageSize)));
const search = async () => { store.coursesPage = 1; await store.safeRun(() => store.fetchCourses()); };
const changePage = async (p) => { store.coursesPage = p; await store.safeRun(() => store.fetchCourses()); };
const startEdit = (it) => { editId.value = it.id; form.courseCode = it.course_code; form.courseName = it.course_name; form.teacher = it.teacher; form.credit = it.credit; };
const clearForm = () => { editId.value = null; form.courseCode = ""; form.courseName = ""; form.teacher = ""; form.credit = 3; };
const submitCourse = async () => {
  if (!form.courseCode || !form.courseName || !form.teacher || form.credit < 1 || form.credit > 8) return store.setMessage("error", t("msg.courseFormInvalid"));
  await store.safeRun(() => editId.value ? store.updateCourse(editId.value, { ...form }) : store.addCourse({ ...form }));
  clearForm();
};
onMounted(() => store.safeRun(() => store.fetchCourses()));
</script>
