<template>
  <section class="panel">
    <h2>{{ $t("students.title") }}</h2>
    <form class="form-grid" @submit.prevent="submit">
      <input v-model.trim="form.studentNo" :placeholder="$t('students.no')" required />
      <input v-model.trim="form.studentName" :placeholder="$t('students.name')" required />
      <input v-model.trim="form.className" :placeholder="$t('students.className')" />
      <input v-model.number="form.gradeYear" type="number" :placeholder="$t('students.gradeYear')" />
      <button type="submit">{{ editId ? $t("common.update") : $t("students.add") }}</button>
    </form>
    <table>
      <thead><tr><th>ID</th><th>{{ $t("students.no") }}</th><th>{{ $t("students.name") }}</th><th>{{ $t("students.className") }}</th><th>{{ $t("students.gradeYear") }}</th><th>{{ $t("courses.action") }}</th></tr></thead>
      <tbody><tr v-for="s in store.students" :key="s.id"><td>{{s.id}}</td><td>{{s.student_no}}</td><td>{{s.student_name}}</td><td>{{s.class_name}}</td><td>{{s.grade_year}}</td><td><button @click="edit(s)">{{ $t("common.update") }}</button><button class="danger" @click="store.safeRun(()=>store.deleteStudent(s.id))">{{ $t("common.delete") }}</button></td></tr></tbody>
    </table>
  </section>
</template>
<script setup>
import { reactive, ref, onMounted } from "vue";
import { useEduStore } from "../stores/edu";
const store = useEduStore();
const editId = ref(null);
const form = reactive({ studentNo: "", studentName: "", className: "", gradeYear: 2023 });
const edit = (s) => { editId.value = s.id; form.studentNo=s.student_no; form.studentName=s.student_name; form.className=s.class_name||""; form.gradeYear=s.grade_year||2023; };
const clear = () => { editId.value = null; form.studentNo=""; form.studentName=""; form.className=""; form.gradeYear=2023; };
const submit = async () => { await store.safeRun(()=> editId.value ? store.updateStudent(editId.value,{...form}) : store.addStudent({...form})); clear(); };
onMounted(()=>store.safeRun(()=>store.fetchStudents()));
</script>
