<script setup>
  const props = defineProps({
    menuItems: Array,
    currentPath: String,
    navBarMenuClass: String
  });
</script>

<template>
  <div class="navbar-menu" :class="props.navBarMenuClass">
    <v-btn
      v-for="item in props.menuItems"
      :key="item.title"
      :href="item.link"
      :class="{
        isActive:
          (item.link === '/blog' && props.currentPath.includes('blogs')) ||
          item.link === props.currentPath.split('.')[0]
      }"
      flat
      >{{ item.title }}</v-btn
    >
  </div>
</template>

<style scoped>
  .navbar-menu {
    display: flex;
  }

  /* HOME */
  .navbar-menu-home .v-btn {
    color: var(--Black, #000);
    text-align: right;
    font-family: 'General Sans Medium';
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: -0.16px;
    text-decoration: none;
    text-transform: unset !important;
    cursor: pointer;
  }

  .navbar-menu-home .v-btn:hover {
    background: linear-gradient(90deg, #000 0.75%, #fc6200 59.42%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .navbar-menu-home .isActive {
    background: linear-gradient(90deg, #000 0.75%, #fc6200 59.42%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  /* Further adjustments for smaller screens */
  @media screen and (max-width: 768px) {
    .navbar-menu {
      flex-direction: column;
      padding-top: 25px;
    }

    .navbar-menu .v-btn {
      width: 100%;
      justify-content: flex-start;
    }

    .navbar-menu-home .isActive::before {
      left: 0;
      transform: translate(5%, -35%);
      width: 90%;
    }
  }

  @media screen and (max-width: 480px) {
  }
</style>
