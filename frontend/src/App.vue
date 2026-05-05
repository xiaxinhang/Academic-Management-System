<template>
  <div class="global-lang-switch">
    <button class="ghost dark" @click="setLocale('zh')">中文</button>
    <button class="ghost dark" @click="setLocale('en')">EN</button>
  </div>

  <RouterView v-if="isLoginPage" />
  <div class="layout" v-else>
    <aside class="side" v-if="store.isLoggedIn">
      <h1>{{ $t("app.title") }}</h1>
      <p class="role">{{ store.user?.username }} ({{ store.user?.role === "admin" ? $t("app.roleAdmin") : $t("app.roleStudent") }})</p>
      <RouterLink to="/dashboard">{{ $t("nav.dashboard") }}</RouterLink>
      <RouterLink to="/courses">{{ $t("nav.courses") }}</RouterLink>
      <RouterLink v-if="store.isAdmin" to="/students">{{ $t("nav.students") }}</RouterLink>
      <RouterLink v-if="store.isAdmin" to="/users">{{ $t("nav.users") }}</RouterLink>
      <RouterLink to="/enrollments">{{ $t("nav.enrollments") }}</RouterLink>
      <RouterLink to="/grades">{{ $t("nav.grades") }}</RouterLink>
      <RouterLink v-if="store.isAdmin" to="/logs">{{ $t("nav.logs") }}</RouterLink>
      <button class="ghost" @click="logout">{{ $t("common.logout") }}</button>
    </aside>
    <main class="content">
      <div v-if="store.errorMessage" class="alert error">{{ store.errorMessage }}</div>
      <div v-if="store.successMessage" class="alert success">{{ store.successMessage }}</div>
      <RouterView v-slot="{ Component }">
        <KeepAlive>
          <component :is="Component" />
        </KeepAlive>
      </RouterView>
    </main>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useEduStore } from "./stores/edu";

const store = useEduStore();
const router = useRouter();
const route = useRoute();
const { locale } = useI18n();

const isLoginPage = computed(() => route.path === "/login");
const setLocale = (lang) => { locale.value = lang; localStorage.setItem("locale", lang); };
const logout = () => { store.logout(); router.push("/login"); };
</script>
