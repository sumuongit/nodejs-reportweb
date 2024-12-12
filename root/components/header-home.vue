<script setup>
import NavBar from './nav-bar.vue';
import HeroHome from './hero-home.vue';
</script>

<template>
  <NavBar></NavBar>
  <HeroHome></HeroHome>
</template>

<style scoped>
/* Adjust size for a 1280px screen */
@media screen and (max-width: 1280px) {}

/* Further adjustments for smaller screens */
@media screen and (max-width: 768px) {}

@media screen and (max-width: 480px) {}
</style>
