<template>
  <RouterView v-if="isLoginPage" />

  <el-container v-else class="app-shell">
    <el-aside v-if="store.isLoggedIn" class="app-aside" width="248px">
      <div class="brand">
        <el-icon><School /></el-icon>
        <span>{{ $t("app.title") }}</span>
      </div>
      <div class="profile">
        <strong>{{ store.user?.username }}</strong>
        <el-tag size="small" type="success">{{ roleLabel }}</el-tag>
      </div>
      <el-scrollbar>
        <el-menu :default-active="route.path" router class="side-menu">
          <el-menu-item index="/dashboard"><el-icon><DataAnalysis /></el-icon><span>{{ $t("nav.dashboard") }}</span></el-menu-item>
          <el-menu-item index="/courses"><el-icon><Collection /></el-icon><span>{{ $t("nav.courses") }}</span></el-menu-item>
          <el-menu-item v-if="store.isAdmin" index="/students"><el-icon><User /></el-icon><span>{{ $t("nav.students") }}</span></el-menu-item>
          <el-menu-item v-if="store.isAdmin" index="/users"><el-icon><Avatar /></el-icon><span>{{ $t("nav.users") }}</span></el-menu-item>
          <el-menu-item index="/enrollments"><el-icon><Tickets /></el-icon><span>{{ $t("nav.enrollments") }}</span></el-menu-item>
          <el-menu-item index="/grades"><el-icon><TrendCharts /></el-icon><span>{{ $t("nav.grades") }}</span></el-menu-item>
          <el-menu-item v-if="store.isAdmin" index="/logs"><el-icon><Document /></el-icon><span>{{ $t("nav.logs") }}</span></el-menu-item>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header class="app-header">
        <div class="page-title">{{ currentTitle }}</div>
        <div class="header-actions">
          <el-segmented v-model="currentLocale" :options="localeOptions" @change="setLocale" />
          <el-button :icon="SwitchButton" @click="logout">{{ $t("common.logout") }}</el-button>
        </div>
      </el-header>

      <el-main class="app-main">
        <el-alert v-if="store.errorMessage" class="app-alert" type="error" show-icon :closable="false" :title="store.errorMessage" />
        <el-alert v-if="store.successMessage" class="app-alert" type="success" show-icon :closable="false" :title="store.successMessage" />
        <RouterView v-slot="{ Component }">
          <KeepAlive>
            <component :is="Component" />
          </KeepAlive>
        </RouterView>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { SwitchButton } from "@element-plus/icons-vue";
import { useEduStore } from "./stores/edu";

const store = useEduStore();
const router = useRouter();
const route = useRoute();
const { locale, t } = useI18n();

const currentLocale = ref(locale.value);
const localeOptions = [
  { label: "中文", value: "zh" },
  { label: "EN", value: "en" }
];

const isLoginPage = computed(() => route.path === "/login");
const roleLabel = computed(() => {
  if (store.user?.role === "admin") return t("app.roleAdmin");
  if (store.user?.role === "teacher") return t("app.roleTeacher");
  return t("app.roleStudent");
});
const currentTitle = computed(() => {
  const map = {
    "/dashboard": "nav.dashboard",
    "/courses": "nav.courses",
    "/students": "nav.students",
    "/users": "nav.users",
    "/enrollments": "nav.enrollments",
    "/grades": "nav.grades",
    "/logs": "nav.logs"
  };
  return t(map[route.path] || "app.title");
});

watch(locale, (value) => {
  currentLocale.value = value;
});

const setLocale = (lang) => {
  locale.value = lang;
  localStorage.setItem("locale", lang);
};
const logout = () => {
  store.logout();
  router.push("/login");
};
</script>
