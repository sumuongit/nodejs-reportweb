<script setup>
const props = defineProps({
  menuItems: Array,
  currentPath: String,
  navBarMenuClass: String
});
</script>

<template>
  <div class="navbar-menu" :class="props.navBarMenuClass">
    <v-btn v-for="item in props.menuItems" :key="item.title" :href="item.link" :class="{
      isActive:
        // (item.link === '/blog' && props.currentPath.includes('blogs')) ||
        item.link === props.currentPath //.split('.')[0]
    }" flat>{{ item.title }}</v-btn>
  </div>
</template>

<style scoped>
.navbar-menu {
  display: flex;
}

/* HOME */
.navbar-menu-home .v-btn {
  color: var(--Black, #000);
  font-family: 'General Sans Medium';
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: -0.16px;
  height: 44px !important;
  border-radius: 100px;
  border: 1px solid #dce2ec;
  background: #fff;
  text-transform: unset !important;
  text-decoration: none;
}

.navbar-menu-home .v-btn:hover,
.navbar-menu-home .isActive {
  color: #0d0d0d;
  background: #4169E1;
  color: #FFF;
  border-radius: 100px;
  width: 100px;
}

.navbar-menu-home .isActive {
  pointer-events: none;
}

/* Further adjustments for smaller screens */
@media screen and (max-width: 768px) {
  .navbar-menu {
    flex-direction: column;
    padding-top: 25px;
    width: 100px;
    margin-left: 20px;
  }

  .navbar-menu .v-btn {
    width: 100%;
    /* justify-content: flex-start; */
  }

  .navbar-menu-home .isActive::before {
    left: 0;
    transform: translate(5%, -35%);
    width: 90%;
  } 
}

@media screen and (max-width: 480px) {}
</style>
