<script setup>
import BaseLayout from '../layout/base-layout.vue';
import Header from '../header-home.vue';
import Home from '../home/home-content.vue';
import { onMounted } from 'vue';
import { useRouter } from 'vitepress';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

let baseUrl = '';
if (import.meta.env.MODE === 'development') {
  baseUrl = import.meta.env.VITE_DEV_BASE_URL;
} else if (import.meta.env.MODE === 'production') {
  baseUrl = import.meta.env.VITE_PRO_BASE_URL;
} else {
  console.log('Running client in unknown or development mode');
  baseUrl = import.meta.env.VITE_DEV_BASE_URL || '';
}

const router = useRouter();

const isTokenExpired = (token) => {
  try {
    const payload = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    //console.error('Invalid token format:', error);
    return true;
  }
};

onMounted(async () => {
  const token = localStorage.getItem('authToken');
  if (!token || isTokenExpired(token)) {
    try {
      const refreshResponse = await axios.post(`${baseUrl}/api/auth/refreshToken`, {}, {
        withCredentials: true
      });

      localStorage.setItem('authToken', refreshResponse.data.token);
    } catch {
      // await axios.post(`${baseUrl}/api/auth/signout`, {}, {
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //   },
      //   withCredentials: true
      // });
      localStorage.removeItem('authToken');
      router.go('/');
    }
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
