<script setup>
import { useRouter } from 'vitepress';

const router = useRouter();

const returnToSignIn = async () => {
  router.go('/');
};
</script>

<template>
  <div class="d-flex flex-column justify-center align-center ga-5">
    <div class="d-flex flex-column justify-center align-center wrapper">
      <div class="d-flex flex-column align-center ga-5 return-to-signin-form">
        <div class="sub-title">
          Your password has been reset!
        </div>
        <div class="sub-title-two">
          Sign in again with your new password.
        </div>
        <div class="d-flex justify-center">
          <v-btn @click="returnToSignIn" class="elevation-0 return-to-signin-btn">
            <span style="margin-right: 5px">Return to Sign In</span>
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
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  color: #000;
  margin-top: 20%;
}

.return-to-signin-form {
  border: 1px solid #000;
  padding: 50px 75px;

  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 424px;
  margin: auto;
}

.return-to-signin-btn {
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

.return-to-signin-btn:hover {
  opacity: 0.8;
}

.sub-title {
  color: #3f3e3e;
  text-align: center;
  font-family: Inter;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 30px;
}

.sub-title-two {
  color: #4169E1;
  text-align: center;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 30px;
}

/* Adjust size for a 1280px screen */
@media screen and (max-width: 1280px) {}

/* Further adjustments for smaller screens */
@media screen and (max-width: 768px) {
  .return-to-signin-form {
    max-width: unset;
  }
}

@media screen and (max-width: 480px) {}
</style>
