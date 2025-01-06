<script setup>
import BaseLayout from '../layout/base-layout.vue';
import Header from '../header-register-ex.vue';
import Register from '../register-ex/register-form.vue';
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
