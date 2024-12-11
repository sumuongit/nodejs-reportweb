<script setup>
import { onMounted } from 'vue';
import '../../.vitepress/theme/style.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

onMounted(() => {
  // Initialize AOS
  if (typeof window !== 'undefined') {
    AOS.init({
      offset: 200, // Offset (in pixels) from the original trigger point
      duration: 800, // Animation duration (in milliseconds)
      easing: 'ease', // Easing type for the animation
      once: false // Whether animations should only happen once
    });
  }
});
</script>

<template>
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P4C56NSB" height="0" width="0"
      style="display:none;visibility:hidden"></iframe></noscript>

  <div class="layout" style="background-color: #FFF">
    <header>
      <slot name="header"></slot>
    </header>
    <main class="main-content">
      <slot></slot>
    </main>
    <footer style="z-index: 1000">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex-grow: 1;
}
</style>
