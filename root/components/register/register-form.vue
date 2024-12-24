<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vitepress';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

const router = useRouter();

let baseUrl = '';
if (import.meta.env.MODE === 'development') {
  baseUrl = import.meta.env.VITE_DEV_BASE_URL;
} else if (import.meta.env.MODE === 'production') {
  baseUrl = import.meta.env.VITE_PRO_BASE_URL;
} else {
  console.log('Running client in unknown or development mode');
}

const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('');

const isSubmitting = ref(false);
const showPassword = ref(false);

const formData = ref({
  name: '',
  email: '',
  password: '',
  role: 'user'
});

const errors = ref({
  name: null,
  email: null,
  password: null,
  role: null
});

const rules = {
  name: value => (value ? '' : 'Name is required'),
  email: value => {
    if (!value) return 'Email Address is required';
    const emailPattern = /^[^@]+@anwargroup\.net$/;
    //const emailPattern = /^\S+@\S+\.\S+$/;
    return emailPattern.test(value) ? '' : 'Email must be a valid @anwargroup.net address';
  },
  password: value => {
    if (!value) return 'Password is required';

    // Check if password meets the criteria
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordPattern.test(value)
      ? ''
      : 'Password must be at least 6 characters long and include uppercase, lowercase, numbers, and symbols';
  },
  role: (value) => (value ? '' : 'Role is required')
};

const isTokenExpired = (token) => {
  try {
    const payload = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    //console.error('Invalid token format:', error);
    return true;
  }
};

const validateForm = () => {
  let isValid = true;
  Object.keys(rules).forEach(field => {
    const rule = rules[field];
    const error = rule(formData.value[field]);
    errors.value[field] = error;
    if (error) isValid = false;
  });
  return isValid;
};

const submitRegisterForm = async () => {
  if (validateForm()) {
    isSubmitting.value = true;
    try {
      const token = localStorage.getItem('authToken');
      if (token && isTokenExpired(token)) throw new Error('Token expired. Please log in again.');

      await axios.post(
        `${baseUrl}/api/auth/register`,
        {
          name: formData.value.name,
          email: formData.value.email,
          password: formData.value.password,
          role: formData.value.role
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      snackbarMessage.value = 'User registered and email sent successfully';
      snackbarColor.value = 'success';
      snackbar.value = true;
      //router.go('/home');     
    } catch (error) {
      try {
        const refreshToken = Cookies.get('refreshToken');
        const refreshResponse = await axios.post('/api/auth/refreshToken', { refreshToken });
        localStorage.setItem('authToken', refreshResponse.data.token);

        await axios.post(
          `${baseUrl}/api/auth/register`,
          {
            name: formData.value.name,
            email: formData.value.email,
            password: formData.value.password,
            role: formData.value.role
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${refreshResponse.data.token}`,
            },
          }
        );

        snackbarMessage.value = 'User registered and email sent successfully';
        snackbarColor.value = 'success';
        snackbar.value = true;
      }
      catch {
        localStorage.removeItem('authToken');
        Cookies.remove('refreshToken');
        router.go('/');
      }    
    } finally {
      snackbar.value = true;
      isSubmitting.value = false;
    }

    // Reset the form fields
    Object.keys(formData.value).forEach((key) => {
      formData.value[key] = '';
      formData.value[key] = key === 'role' ? 'user' : ''
    });
  } else {
    snackbarMessage.value = 'Please fill up all required fields correctly.';
    snackbarColor.value = 'error';
    snackbar.value = true;
  }
};
</script>

<template>
  <div class="d-flex flex-column justify-center align-center ga-5">
    <div class="d-flex flex-column justify-center align-center mt-16 wrapper">
      <v-form>
        <div class="d-flex flex-column ga-5 register-form">
          <v-text-field variant="underlined" v-model="formData.name" label="Name"
            :error-messages="errors.name ? [errors.name] : []" @input="errors.name = rules.name(formData.name)"
            required />
          <v-text-field variant="underlined" v-model="formData.email" label="Email Address"
            :error-messages="errors.email ? [errors.email] : []" @input="errors.email = rules.email(formData.email)"
            placeholder="youremail@anwargroup.net" required />
          <v-text-field variant="underlined" v-model="formData.password" :type="showPassword ? 'text' : 'password'"
            label="Password" class="w-100" @click:append-inner="showPassword = !showPassword"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :error-messages="errors.password ? [errors.password] : []"
            @input="errors.password = rules.password(formData.password)" required />
          <v-select variant="underlined" v-model="formData.role" :items="['admin', 'user']" label="Role"
            :error-messages="errors.role ? [errors.role] : []" @change="errors.role = rules.role(formData.role)"
            required />
          <div class="d-flex justify-center">
            <v-btn @click="submitRegisterForm" :loading="isSubmitting" :disabled="isSubmitting"
              class="elevation-0 register-btn">
              <span v-if="!isSubmitting" style="margin-right: 5px">Register</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM16.6919 12.2871C16.6539 12.3791 16.599 12.462 16.53 12.531L13.53 15.531C13.384 15.677 13.192 15.751 13 15.751C12.808 15.751 12.616 15.678 12.47 15.531C12.177 15.238 12.177 14.763 12.47 14.47L14.1899 12.75H8C7.586 12.75 7.25 12.414 7.25 12C7.25 11.586 7.586 11.25 8 11.25H14.189L12.469 9.53003C12.176 9.23703 12.176 8.76199 12.469 8.46899C12.762 8.17599 13.237 8.17599 13.53 8.46899L16.53 11.469C16.599 11.538 16.6539 11.6209 16.6919 11.7129C16.7679 11.8969 16.7679 12.1031 16.6919 12.2871Z"
                  fill="url(#paint0_linear_5252_12040)" />
                <defs>
                  <linearGradient id="paint0_linear_5252_12040" x1="3.30567" y1="-1.97616" x2="27.2872" y2="5.89878"
                    gradientUnits="userSpaceOnUse">
                    <stop stop-color="#F5FDFF" />
                    <stop offset="1" stop-color="#F5FDFF" />
                  </linearGradient>
                </defs>
              </svg>
            </v-btn>
          </div>
        </div>
        <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
          {{ snackbarMessage }}
        </v-snackbar>
      </v-form>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  color: #000;
}

.register-form {
  border: 1px solid #000;
  padding: 50px 75px;

  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 424px;
  margin: auto;
}

.v-text-field {
  width: 100%;
}

.register-btn {
  color: #fff;
  font-family: 'General Sans';
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: -0.16px;
  text-transform: unset;
  min-width: 177px;
  height: 52px;
  border-radius: 100px;
  background: #0D0D0D;
}

.register-btn:hover {
  opacity: 0.8;
}

/* Adjust size for a 1280px screen */
@media screen and (max-width: 1280px) {
  .wrapper {
    margin: 20px !important;
  }
}

/* Further adjustments for smaller screens */
@media screen and (max-width: 768px) {
  .register-form {
    padding: 50px 65px;
    max-width: unset;
  }
}

@media screen and (max-width: 480px) {}
</style>
