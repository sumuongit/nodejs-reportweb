<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useDisplay } from 'vuetify';
import { useRoute } from 'vitepress';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import axios from 'axios';
import ReusableNavbar from './reusable-component/reusable-navbar.vue';

// Initialize Vuetify's display service
//const display = useDisplay();

const { mdAndUp } = useDisplay();
const route = useRoute();

// Define the drawer state as a reactive variable
const drawer = ref(false);

const isAuthenticated = ref(false);
const userRole = ref('user');

const isRegisterButtonActive = computed(() => route.path === '/register.html');

const menuItems = ref([
  { title: 'Home', link: '/home.html', showIf: () => isAuthenticated.value },
  // { title: 'Solutions', link: '/solutions' },
  // { title: 'Pricing', link: '/pricing' },
  // { title: 'Blog', link: '/blog' },
  // { title: 'Contact Us', link: '/contact-us' }
]);

const filteredMenuItems = computed(() =>
  menuItems.value.filter(item => item.showIf())
);

const navBarMenuClass = ref('navbar-menu-home');

// Define a reactive variable to track the current route
const currentPath = ref('');

const signout = () => {
  localStorage.removeItem('authToken');
  Cookies.remove('refreshToken');
}

// Click handler to close the drawer
const handleOutsideClick = () => {
  const drawerElement = document.querySelector('.v-navigation-drawer');
  const navIconElement = document.querySelector('.v-app-bar-nav-icon');

  // Check if the click is outside the drawer and hamburger icon
  // if (drawerElement && !drawerElement.contains(event.target) && !navIconElement.contains(event.target)) {
  //     drawer.value = false;
  // }

  if (
    drawerElement &&
    navIconElement &&
    !drawerElement.contains(event.target) &&
    !navIconElement.contains(event.target)
  ) {
    drawer.value = false;
  }
};

const isTokenExpired = (token) => {
  try {
    const payload = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    // console.error('Invalid token format:', error);
    return true;
  }
};

onMounted(async () => {
  if (typeof window !== 'undefined') {
    currentPath.value = window.location.pathname;
  }
  // Attach the click event listener when the component is mounted
  document.addEventListener('click', handleOutsideClick);

  const token = localStorage.getItem('authToken');

  if (token) {
    if (!isTokenExpired(token)) {
      const decodedToken = jwtDecode(token);
      isAuthenticated.value = true;
      userRole.value = decodedToken.role || 'user';
    } else {
      const refreshToken = Cookies.get('refreshToken');
      if (!refreshToken) throw new Error('No refresh token found.');
      const refreshResponse = await axios.post('/api/auth/refreshToken', { refreshToken });
      localStorage.setItem('authToken', refreshResponse.data.token);
      const decodedToken = jwtDecode(token);
      isAuthenticated.value = true;
      userRole.value = decodedToken.role || 'user';
    }
  }
});

onBeforeUnmount(() => {
  // Clean up the event listener when the component is destroyed
  document.removeEventListener('click', handleOutsideClick);
});

// Computed property to determine if the viewport is mdAndUp
const isMdAndUp = computed(() => mdAndUp.value);
</script>

<template>
  <v-app>
    <v-app-bar app flat color="transparent">
      <v-toolbar-title class="flex-grow-tt justify-start align-center title">
        <span style="font-weight: bold;">Path Point:</span> A1 Polymer Power BI Report
      </v-toolbar-title>
      <v-spacer class="flex-grow-vs"></v-spacer>
      <v-toolbar-items class="flex-grow-tim justify-center align-center" v-if="isMdAndUp">
        <ReusableNavbar :class="navBarMenuClass" :menuItems="filteredMenuItems" :currentPath="currentPath">
        </ReusableNavbar>
      </v-toolbar-items>
      <v-spacer class="flex-grow-vs"></v-spacer>
      <!-- Desktop Menu Items -->
      <v-toolbar-items class="flex-grow-tir ga-5 pr-5 justify-end align-center" v-if="isMdAndUp">
        <!-- <v-btn flat class="login-btn">Login</v-btn> -->
        <v-btn v-if="isAuthenticated && userRole === 'admin'" :class="{ 'active-register-btn': isRegisterButtonActive }"
          :style="{ backgroundColor: isRegisterButtonActive ? '#4169E1' : '' }" flat href="/register.html"
          class="elevation-0 register-btn">
          <span style="margin-right: 5px">User Register</span>
        </v-btn>
        <v-btn v-if="isAuthenticated" @click="signout" flat href="/" class="elevation-0 sign-out-btn">
          <span style="margin-right: 5px">Sign Out</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M12.6536 7.16751C12.6314 7.22118 12.5994 7.26954 12.5592 7.30979L8.47585 11.3931C8.39068 11.4783 8.27867 11.5214 8.16667 11.5214C8.05467 11.5214 7.94265 11.4789 7.85748 11.3931C7.68657 11.2222 7.68657 10.9451 7.85748 10.7742L11.1941 7.43753H1.75C1.5085 7.43753 1.3125 7.24153 1.3125 7.00003C1.3125 6.75853 1.5085 6.56253 1.75 6.56253H11.1936L7.85691 3.22588C7.686 3.05497 7.686 2.77786 7.85691 2.60695C8.02783 2.43603 8.30493 2.43603 8.47585 2.60695L12.5592 6.69028C12.5994 6.73053 12.6314 6.77889 12.6536 6.83255C12.6979 6.93989 12.6979 7.06018 12.6536 7.16751Z"
              fill="black" />
          </svg>
        </v-btn>
      </v-toolbar-items>
      <!-- Mobile Menu Button -->
      <v-app-bar-nav-icon @click="drawer = !drawer" v-if="!isMdAndUp"></v-app-bar-nav-icon>
    </v-app-bar>
    <!-- Mobile Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" app temporary>
      <ReusableNavbar :class="navBarMenuClass" :menuItems="filteredMenuItems" :currentPath="currentPath" />
      <v-divider></v-divider>
      <!-- <v-btn flat class="login-btn">Login</v-btn> -->
      <v-btn v-if="isAuthenticated && userRole === 'admin'" :class="{ 'active-register-btn': isRegisterButtonActive }"
        :style="{ backgroundColor: isRegisterButtonActive ? '#4169E1' : '' }" flat href="/register.html"
        class="elevation-0 register-btn">
        <span style="margin-right: 5px">User Register</span>
      </v-btn>
      <v-btn v-if="isAuthenticated" @click="signout" flat href="/" class="sign-out-btn">
        <span style="margin-right: 5px">Sign Out</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M12.6536 7.16751C12.6314 7.22118 12.5994 7.26954 12.5592 7.30979L8.47585 11.3931C8.39068 11.4783 8.27867 11.5214 8.16667 11.5214C8.05467 11.5214 7.94265 11.4789 7.85748 11.3931C7.68657 11.2222 7.68657 10.9451 7.85748 10.7742L11.1941 7.43753H1.75C1.5085 7.43753 1.3125 7.24153 1.3125 7.00003C1.3125 6.75853 1.5085 6.56253 1.75 6.56253H11.1936L7.85691 3.22588C7.686 3.05497 7.686 2.77786 7.85691 2.60695C8.02783 2.43603 8.30493 2.43603 8.47585 2.60695L12.5592 6.69028C12.5994 6.73053 12.6314 6.77889 12.6536 6.83255C12.6979 6.93989 12.6979 7.06018 12.6536 7.16751Z"
            fill="black" />
        </svg>
      </v-btn>
    </v-navigation-drawer>
  </v-app>
</template>

<style scoped>
.v-app-bar {
  /* padding: 5px 10px; */
  position: absolute !important;
  border-bottom: 1px solid #c5c5c5;
}

.v-app-bar-nav-icon {
  display: none;
}

.sign-out-btn,
.register-btn {
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

.sign-out-btn:hover {
  color: var(--Black, #000);
}

.register-btn:hover {
  color: #FFF;
  background-color: #4169E1;
}

.active-register-btn {
  color: white;
  background-color: #4169E1 !important;
  pointer-events: none;
}

.logo {
  width: 169px;
}

.flex-grow-tt,
.flex-grow-vs,
.flex-grow-tim,
.flex-grow-tir {
  flex: 1 1 20% !important;
}

/* Adjust size for a 1280px screen */
@media screen and (max-width: 1280px) {
  .flex-grow-tt {
    flex: 1 1 25% !important;
  }

  .flex-grow-vs {
    flex: 12.5% !important;
  }

  .flex-grow-tim {
    flex: 1 1 25% !important;
  }

  .flex-grow-tir {
    flex: 1 1 25% !important;
  }
}

/* Further adjustments for smaller screens */
@media screen and (max-width: 768px) {
  .v-app-bar-nav-icon {
    display: block;
  }

  .sign-out-btn,
  .register-btn {
    margin-left: 18px;
    margin-bottom: 20px;
  }

  .title {
    font-size: 17px;
  }

  .flex-grow-tt {
    flex: 1 1 80% !important;
  }

  .flex-grow-vs {
    flex: unset !important;
  }

  .flex-grow-tim {
    flex: unset !important;
  }

  .flex-grow-tir {
    flex: 1 1 20% !important;
  }
}

@media screen and (max-width: 480px) {}
</style>
