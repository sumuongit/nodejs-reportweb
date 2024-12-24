<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vitepress';
import { jwtDecode } from 'jwt-decode';
import BaseLayout from '../layout/base-layout.vue';
import Header from '../header-sign-in.vue';
import Signin from '../sign-in/signin-form.vue';

const router = useRouter();

const isTokenExpired = (token) => {
    try {
        const payload = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp < currentTime;
    } catch (error) {
        // console.error('Invalid token format:', error);
        return true;
    }
};

onMounted(() => {
  const token = localStorage.getItem('authToken');
  if (token && !isTokenExpired(token)) {
    router.go('/home.html');
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
