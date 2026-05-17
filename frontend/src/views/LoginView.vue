<template>
  <section class="login-page">
    <div class="login-intro">
      <el-tag effect="dark" type="success">Vue3 + Node.js</el-tag>
      <h1>{{ $t("app.title") }}</h1>
      <h2>{{ $t("login.subtitle") }}</h2>
      <p>{{ $t("login.intro") }}</p>
    </div>

    <el-card class="login-card" shadow="never">
      <template #header>
        <div class="login-card-head">
          <span>{{ $t("login.submit") }}</span>
          <el-segmented v-model="currentLocale" :options="localeOptions" @change="setLocale" />
        </div>
      </template>

      <el-alert v-if="store.errorMessage" class="login-error" type="error" show-icon :closable="false" :title="store.errorMessage" />

      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent>
        <el-form-item :label="$t('login.username')" prop="username">
          <el-input v-model.trim="form.username" :prefix-icon="User" clearable />
        </el-form-item>
        <el-form-item :label="$t('login.password')" prop="password">
          <el-input v-model.trim="form.password" :prefix-icon="Lock" type="password" show-password />
        </el-form-item>
        <el-button class="login-submit" type="primary" :loading="submitting" @click="submit">
          {{ $t("login.submit") }}
        </el-button>
      </el-form>

      <el-alert class="account-tip" type="info" :closable="false" show-icon :title="$t('login.tips')" />
    </el-card>
  </section>
</template>

<script setup>
import { reactive, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { User, Lock } from "@element-plus/icons-vue";
import { useEduStore } from "../stores/edu";

const router = useRouter();
const store = useEduStore();
const { locale, t } = useI18n();
const formRef = ref();
const submitting = ref(false);
const currentLocale = ref(locale.value);
const localeOptions = [
  { label: "中文", value: "zh" },
  { label: "EN", value: "en" }
];
const form = reactive({ username: "admin", password: "admin123" });

const rules = computed(() => ({
  username: [{ required: true, message: t("login.username"), trigger: "blur" }],
  password: [{ required: true, message: t("login.password"), trigger: "blur" }]
}));

const setLocale = (lang) => {
  locale.value = lang;
  localStorage.setItem("locale", lang);
};

const submit = async () => {
  try {
    await formRef.value.validate();
  } catch {
    return;
  }
  submitting.value = true;
  const ok = await store.safeRun(() => store.login({ ...form }));
  submitting.value = false;
  if (ok) router.push("/dashboard");
};
</script>
