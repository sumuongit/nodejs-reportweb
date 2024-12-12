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
    color: gray;
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
   color: #0D0D0D;
  }

  .navbar-menu-home .isActive {
    color: #0D0D0D;
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
