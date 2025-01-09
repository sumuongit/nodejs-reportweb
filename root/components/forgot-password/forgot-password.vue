<script setup>
import BaseLayout from '../layout/base-layout.vue';
import Header from '../header-forgot-password.vue';
import ForgotPassword from '../forgot-password/forgot-password-form.vue';
import { onMounted } from 'vue';
import { useRouter } from 'vitepress';

const router = useRouter();

onMounted(async () => {
  const token = localStorage.getItem('authToken');
  if (token) {
    router.go('/home');
  }
});
</script>

<template>
  <BaseLayout>
    <template v-slot:header>
      <Header></Header>
    </template>
    <ForgotPassword></ForgotPassword>
  </BaseLayout>
</template>

<style scoped></style>
