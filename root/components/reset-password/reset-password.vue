<script setup>
import { ref } from 'vue';
import BaseLayout from '../layout/base-layout.vue';
import Header from '../header-reset-password.vue';
import ResetPassword from '../reset-password/reset-password-form.vue';
import ReturnToSignIn from '../reset-password/return-to-signin.vue';
import NavBar from '../nav-bar.vue';

const currentView = ref('reset'); // 'reset' for password reset, 'signin' for return to sign-in

const handleResetComplete = () => {
  currentView.value = 'signin'; // Switch to the sign-in view
};
</script>

<template>
  <BaseLayout>
    <template v-if="currentView === 'reset'" v-slot:header>
      <Header></Header>
    </template>
    <!-- <ResetPassword></ResetPassword> -->
    <template v-if="currentView === 'reset'">
      <ResetPassword @reset-complete="handleResetComplete"></ResetPassword>
    </template>
    <template v-else-if="currentView === 'signin'">
      <NavBar></NavBar>
      <ReturnToSignIn></ReturnToSignIn>
    </template>
  </BaseLayout>
</template>

<style scoped></style>
