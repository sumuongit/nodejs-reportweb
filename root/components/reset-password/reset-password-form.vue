<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vitepress';

const router = useRouter();
const route = useRoute();

let baseUrl = '';
if (import.meta.env.MODE === 'development') {
  baseUrl = import.meta.env.VITE_DEV_BASE_URL;
} else if (import.meta.env.MODE === 'production') {
  baseUrl = import.meta.env.VITE_PRO_BASE_URL;
} else {
  console.log('Running client in unknown or development mode');
  baseUrl = import.meta.env.VITE_DEV_BASE_URL || '';
}

const emit = defineEmits(['reset-complete']);

const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('');

const isSubmitting = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const token = ref('');

const formData = ref({
  password: '',
  confirmPassword: ''
});

const errors = ref({
  password: null,
  confirmPassword: null
});

const rules = {
  password: value => {
    if (!value) return 'Password is required';

    // Check if password meets the criteria
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordPattern.test(value)
      ? ''
      : 'Password must be at least 6 characters long and include uppercase, lowercase, numbers, and symbols';
  },
  confirmPassword: value => {
    if (!value) return 'Confirm Password is required';

    if (value !== formData.value.password) {
      return 'Passwords do not match';
    }

    // Check if password meets the criteria
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordPattern.test(value)
      ? ''
      : 'Confirm Password must be at least 6 characters long and include uppercase, lowercase, numbers, and symbols';
  }
};

onMounted(async () => {
  token.value = route.query?.token || getTokenFromUrl();
  if (!token.value) {
    await axios.post(`${baseUrl}/api/auth/signout`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      withCredentials: true
    });
    localStorage.removeItem('authToken');
    router.go('/');
  }

  try {
    const response = await axios.post(`${baseUrl}/api/auth/validateResetToken`, {
      token: token.value,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Token validation failed.');
    }
  } catch {
    // await axios.post(`${baseUrl}/api/auth/signout`, {}, {
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //   },
    //   withCredentials: true
    // });
    localStorage.removeItem('authToken');
    router.go('/');
  }
});

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

const getTokenFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('token');
};

const submitResetPasswordForm = async () => {
  if (validateForm()) {
    isSubmitting.value = true;
    try {
      const response = await axios.post(
        `${baseUrl}/api/auth/resetPassword`,
        {
          token: token.value,
          newPassword: formData.value.password
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.data.success) {
        snackbarMessage.value = 'Password reset successfully!';
        snackbarColor.value = 'success';
        snackbar.value = true;
        //router.go('/');
        emit('reset-complete');
      } else {
        throw new Error('Password not reset. Please try again.');
      }
    } catch (error) {
      console.error('Error during resetting password:', error);

      // Determine the error message based on the response
      if (error.response) {
        // Server returned an error response
        snackbarMessage.value = error.response.data.message || 'Password reset failed. Please try again.';
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
  <div class="d-flex flex-column justify-center align-center ga-5">
    <div class="d-flex flex-column justify-center align-center mt-10 wrapper">
      <v-form>
        <div class="d-flex flex-column align-center ga-5 reset-password-form">
          <v-text-field variant="underlined" v-model="formData.password" :type="showPassword ? 'text' : 'password'"
            label="New Password" class="w-100" @click:append-inner="showPassword = !showPassword"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :error-messages="errors.password ? [errors.password] : []"
            @input="errors.password = rules.password(formData.password)" required />
          <v-text-field variant="underlined" v-model="formData.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'" label="Confirm Password" class="w-100"
            @click:append-inner="showConfirmPassword = !showConfirmPassword"
            :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :error-messages="errors.confirmPassword ? [errors.confirmPassword] : []"
            @input="errors.confirmPassword = rules.confirmPassword(formData.confirmPassword)" required />
          <div class="d-flex justify-center">
            <v-btn @click="submitResetPasswordForm" :loading="isSubmitting" :disabled="isSubmitting"
              class="elevation-0 password-reset-btn">
              <span v-if="!isSubmitting" style="margin-right: 5px">Reset Password</span>
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
          <a href="/" style="font-size: 14px; text-decoration: none;">Sign In</a>
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

.reset-password-form {
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

.password-reset-btn {
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

.password-reset-btn:hover {
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
  .reset-password-form {
    max-width: unset;
  }
}

@media screen and (max-width: 480px) {}
</style>
