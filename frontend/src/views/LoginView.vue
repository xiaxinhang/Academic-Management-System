<template>
  <section class="login-wrap">
    <form class="card" @submit.prevent="submit">
      <div class="login-head">
        <h2>{{ $t("app.title") }}</h2>
      </div>
      <p>{{ $t("login.subtitle") }}</p>
      <input v-model.trim="form.username" :placeholder="$t('login.username')" required />
      <input v-model.trim="form.password" type="password" :placeholder="$t('login.password')" required />
      <button type="submit">{{ $t("login.submit") }}</button>
      <small>{{ $t("login.tips") }}</small>
    </form>
  </section>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useEduStore } from "../stores/edu";

const router = useRouter();
const store = useEduStore();
const form = reactive({ username: "admin", password: "admin123" });

const submit = async () => {
  try {
    store.clearMessage();
    await store.login(form);
    router.push("/courses");
  } catch (e) {
    store.setMessage("error", e.message);
  }
};
</script>
