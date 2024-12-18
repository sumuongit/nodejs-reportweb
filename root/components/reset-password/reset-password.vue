<script setup>
import BaseLayout from '../layout/base-layout.vue';
import Header from '../header-reset-password.vue';
import ResetPassword from '../reset-password/reset-password-form.vue';
</script>

<template>
  <BaseLayout>
    <template v-slot:header>
      <Header></Header>
    </template>
    <ResetPassword></ResetPassword>
  </BaseLayout>
</template>

<style scoped></style>
