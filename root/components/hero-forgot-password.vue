<script setup></script>

<template>
  <div class="hero">
    <div class="d-flex flex-column justify-center align-center ga-5">
      <div class="d-flex flex-column" data-aos="fade-up" data-aos-delay="200">
        <div class="hero-title">Forgot Password</div>
      </div>
      <div class="hero-sub-title" data-aos="fade-up" data-aos-delay="300">
        Please enter your email address
      </div>
      <div class="hero-sub-title-two" data-aos="fade-up" data-aos-delay="300">
        Upon successfully retrieving your account email address, you will receive an email with a link to reset your password.
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero {
  position: relative;
  display: flex;
  justify-content: center;
  margin-top: 150px;
}

.hero-title {
  color: #1f2937;
  text-align: center;
  font-family: 'General Sans';
  font-size: 36px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.hero-sub-title {
  color: #3f3e3e;
  text-align: center;
  font-family: Inter;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 30px;
}

.hero-sub-title-two {
  color: #4169E1;
  text-align: center;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 30px;
}

/* Adjust size for a 1280px screen */
@media screen and (max-width: 1280px) {
  .hero {
    margin-top: 75px;
  }
}

/* Further adjustments for smaller screens */
@media screen and (max-width: 768px) {
  .hero {
    margin-top: 150px;
  }

  .hero-sub-title-two {
    width: 90%;
  }
}

@media screen and (max-width: 480px) {}
</style>
