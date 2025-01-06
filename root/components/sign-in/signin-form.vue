<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vitepress';
import Cookies from 'js-cookie';

const router = useRouter();

let baseUrl = '';
if (import.meta.env.MODE === 'development') {
  baseUrl = import.meta.env.VITE_DEV_BASE_URL;
} else if (import.meta.env.MODE === 'production') {
  baseUrl = import.meta.env.VITE_PRO_BASE_URL;
} else {
  console.log('Running client in unknown or development mode');
  baseUrl = import.meta.env.VITE_DEV_BASE_URL || '';
}

const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('');

const isSubmitting = ref(false);
const showPassword = ref(false);

const formData = ref({
  username: '',
  password: ''
});

const errors = ref({
  username: null,
  password: null
});

const rules = {
  email: value => {
    if (!value) return 'Email Address is required';
    const emailPattern = /^\S+@\S+\.\S+$/;
    return emailPattern.test(value) ? '' : 'Email Address must be valid';
  },
  password: value => (value ? '' : 'Password is required')
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

const submitSigninForm = async () => {
  if (validateForm()) {
    isSubmitting.value = true;
    try {
      const response = await axios.post(
        `${baseUrl}/api/auth/signin`,
        {
          email: formData.value.email,
          password: formData.value.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const token = response.data.token;
      const refreshToken = response.data.refreshToken;
      if (token) {
        localStorage.setItem('authToken', token);
        Cookies.set('refreshToken', refreshToken, { secure: process.env.NODE_ENV === 'productions', sameSite: 'Strict' });
        snackbarMessage.value = 'You have signed in successfully!';
        snackbarColor.value = 'success';
        snackbar.value = true;
        router.go('/home');
      } else {
        throw new Error('Token not received. Please try again.');
      }
    } catch (error) {
      console.error('Error during sign-in:', error);

      // Determine the error message based on the response
      if (error.response) {
        // Server returned an error response
        snackbarMessage.value = error.response.data.message || 'Sign-in failed. Please try again.';
      } else if (error.request) {
        // Request made but no response received
        snackbarMessage.value = 'No response from the server. Please check your connection.';
      } else {
        // Other errors
        snackbarMessage.value = 'An unexpected error occurred. Please try again.';
      }

      snackbarColor.value = 'error';
      snackbar.value = true;
    } finally {
      isSubmitting.value = false;
    }

    // Reset the form fields
    Object.keys(formData.value).forEach((key) => {
      formData.value[key] = '';
    });
  } else {
    snackbarMessage.value = 'Please fill up all required fields correctly.';
    snackbarColor.value = 'error';
    snackbar.value = true;
  }
};
</script>

<template>
  <div class="d-flex justify-center mt-10 wrapper">
    <v-form>
      <div class="d-flex flex-column align-center ga-5 signin-form">
        <v-text-field variant="underlined" v-model="formData.email" label="Email Address"
          :error-messages="errors.email ? [errors.email] : []" @input="errors.email = rules.email(formData.email)"
          required />
        <v-text-field variant="underlined" v-model="formData.password" :type="showPassword ? 'text' : 'password'"
          label="Password" class="w-100" @click:append-inner="showPassword = !showPassword"
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :error-messages="errors.password ? [errors.password] : []"
          @input="errors.password = rules.password(formData.password)" required />
        <a href="/forgot-password" style="font-size: 14px; text-decoration: none;">Forgot password?</a>
        <div class="d-flex justify-center">
          <v-btn @click="submitSigninForm" :loading="isSubmitting" :disabled="isSubmitting"
            class="elevation-0 signin-btn">
            <span v-if="!isSubmitting" style="margin-right: 5px">Sign In</span>
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
        <a href="/register-ex" style="font-size: 14px; text-decoration: none;">Don't have an account? Register</a>
      </div>
      <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
        {{ snackbarMessage }}
      </v-snackbar>
    </v-form>
  </div>
</template>

<style scoped>
.wrapper {
  color: #000;
}

.signin-form {
  border: 1px solid #000;
  padding: 50px 75px;
}

.v-text-field {
  width: 100%;
}

.signin-btn {
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

.signin-btn:hover {
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
  .signin-form {
    padding: 50px 65px;
  }
}

@media screen and (max-width: 480px) {}
</style>
