<script setup>
import BaseLayout from '../layout/base-layout.vue';
import Header from '../header-register.vue';
import Register from '../register/register-form.vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vitepress';
import { jwtDecode } from 'jwt-decode';

const router = useRouter();

//const isAuthenticated = ref(false);
const userRole = ref('user');

onMounted(() => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    router.go('/');
  }

  if (!!token) {
    //isAuthenticated.value = true;
    try {
      // Decode the token to extract the role
      const decodedToken = jwtDecode(token);
      userRole.value = decodedToken.role || 'user';
      if (userRole.value === 'user') {
        router.go('/home');
      }
    } catch (error) {
      //console.error('Error decoding token:', error);
      //isAuthenticated.value = false;
      userRole.value = 'user';
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
