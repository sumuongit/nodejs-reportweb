<script setup></script>

<template>
  <div class="hero">
    <div class="d-flex flex-column justify-center align-center ga-5 hero-container">
      <div class="d-flex flex-column" data-aos="fade-up" data-aos-delay="200">
        <div class="hero-title">Secure Power BI Report</div>
      </div>
      <div>
        <v-btn density="default" href="/contact-us" class="elevation-0 hero-btn">
          <span style="margin-right: 5px">Access to the Report</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM16.6919 12.2871C16.6539 12.3791 16.599 12.462 16.53 12.531L13.53 15.531C13.384 15.677 13.192 15.751 13 15.751C12.808 15.751 12.616 15.678 12.47 15.531C12.177 15.238 12.177 14.763 12.47 14.47L14.1899 12.75H8C7.586 12.75 7.25 12.414 7.25 12C7.25 11.586 7.586 11.25 8 11.25H14.189L12.469 9.53003C12.176 9.23703 12.176 8.76199 12.469 8.46899C12.762 8.17599 13.237 8.17599 13.53 8.46899L16.53 11.469C16.599 11.538 16.6539 11.6209 16.6919 11.7129C16.7679 11.8969 16.7679 12.1031 16.6919 12.2871Z"
              fill="url(#paint0_linear_4961_9599)" />
            <defs>
              <linearGradient id="paint0_linear_4961_9599" x1="3.30567" y1="-1.97616" x2="27.2872" y2="5.89878"
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
</template>

<style scoped>
.hero {
  position: relative;
  display: flex;
  justify-content: center;
  margin-top: 200px;
}

.hero-btn {
  font-family: 'General Sans';
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: -0.16px;
  color: #fff;
  height: 52px;
  border-radius: 100px;
  background-color: #0D0D0D;
  text-transform: unset !important;
  text-decoration: none;
}

.hero-btn:hover {
  color: #fff;
}

.hero-title {
  color: #10172a;
  font-family: 'General Sans Medium';
  font-size: 64px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}

.hero-sub-title {
  color: #3f3e3e;
  text-align: center;
  font-family: Inter;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 35px;
}

/* Adjust size for a 1280px screen */
@media screen and (max-width: 1280px) {
  .hero-title {
    font-size: 44px;
  }

  .hero-sub-title {
    font-size: 20px;
  }

  .hero-btn {
    height: 42px;
  }

  .hero-img {
    width: 400px;
    height: auto;
    margin-top: 10px;
  }

  .click {
    width: 40px;
    margin-top: 5px;
    margin-right: -15px;
  }
}

/* Further adjustments for smaller screens */
@media screen and (max-width: 768px) {
  .hero-container {
    width: 90%;
  }

  .hero-title {
    font-size: 40px;
    text-align: center;
  }

  .hero-sub-title {
    width: 90%;
    font-size: 20px;
  }

  .click {
    margin-top: 0;
    margin-right: 70px;
  }

  .hero-img-container {
    margin-top: -20px !important;
  }
}

@media screen and (max-width: 480px) {}
</style>
