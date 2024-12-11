<script setup>
import BaseLayout from '../layout/base-layout.vue';
import Header from '../header-home.vue';
import Home from '../home/home-content.vue';
import { onMounted } from 'vue';
import { useRouter } from 'vitepress';

const router = useRouter();

onMounted(() => {
  const token = localStorage.getItem('authToken');
  console.log(token);
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
    <Home></Home>
  </BaseLayout>
</template>

<style scoped></style>
