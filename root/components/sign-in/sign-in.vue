<script setup>
import BaseLayout from '../layout/base-layout.vue';
import Header from '../header-sign-in.vue';
import Signin from '../sign-in/signin-form.vue';

import { onMounted } from 'vue';
import { useRouter } from 'vitepress';

const router = useRouter();

onMounted(() => {
  const token = localStorage.getItem('authToken');
  console.log(token);
  if (!!token) {
    router.go('/home');
  } 
});
</script>

<template>
  <BaseLayout>
    <template v-slot:header>
      <Header></Header>
    </template>
    <Signin></Signin>
  </BaseLayout>
</template>

<style scoped></style>
