<script setup>
import BaseLayout from '../layout/base-layout.vue';
import Header from '../header-register.vue';
import Register from '../register/register-form.vue';
import { onMounted } from 'vue';
import { useRouter } from 'vitepress';

const router = useRouter();

onMounted(() => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    router.go('/');
  } 
});
</script>

<template>
  <BaseLayout>
    <template v-slot:header>
      <Header></Header>
    </template>
    <Register></Register>
  </BaseLayout>
</template>

<style scoped></style>
