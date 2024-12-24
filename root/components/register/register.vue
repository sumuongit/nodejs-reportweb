<script setup>
import BaseLayout from '../layout/base-layout.vue';
import Header from '../header-register.vue';
import Register from '../register/register-form.vue';
import { onMounted } from 'vue';
import { useRouter } from 'vitepress';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import axios from 'axios';

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

onMounted(async () => {
  const token = localStorage.getItem('authToken');
  if (!token || isTokenExpired(token)) {
    try {
      const refreshToken = Cookies.get('refreshToken');
      if (!refreshToken) throw new Error('No refresh token found.');
      const refreshResponse = await axios.post('/api/auth/refreshToken', { refreshToken });
      localStorage.setItem('authToken', refreshResponse.data.token);
    } catch (err) {
      //console.error('Error refreshing access token:', err);
      localStorage.removeItem('authToken');
      Cookies.remove('refreshToken');
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
    <Register></Register>
  </BaseLayout>
</template>

<style scoped></style>
