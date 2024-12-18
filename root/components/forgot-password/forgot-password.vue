<script setup>
import BaseLayout from '../layout/base-layout.vue';
import Header from '../header-forgot-password.vue';
import ForgotPassword from '../forgot-password/forgot-password-form.vue';
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
