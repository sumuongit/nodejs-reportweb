<script setup>
</script>

<template>
  <div class="hero">
    <div class="d-flex flex-column justify-center align-center ga-5 hero-container">
      <div class="d-flex flex-column" data-aos="fade-up" data-aos-delay="200">
        <div class="hero-title">Secure Power BI Report</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero {
  position: relative;
  display: flex;
  justify-content: center;
  margin-top: 100px;
}

.hero-title {
  color: #10172a;
  font-family: 'General Sans Medium';
  font-size: 64px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}

/* Adjust size for a 1280px screen */
@media screen and (max-width: 1280px) {
  .hero-title {
    font-size: 44px;
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
}

@media screen and (max-width: 480px) {}
</style>