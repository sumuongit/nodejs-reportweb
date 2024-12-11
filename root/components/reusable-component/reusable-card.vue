<script setup>
  const props = defineProps({
    title: String,
    subtitle: String,
    content1: String,
    content2: String,
    content1Color: String,
    color: String,
    btnText: String,
    btnTextColor: String,
    btnBgColor: String,
    btnIcon: String,
    bgColor: String,
    buttonUrl:String
  });
</script>

<template>
  <v-card
    :style="{ backgroundColor: props.bgColor }"
    class="d-flex flex-column pa-5 elevation-0"
  >
    <v-card-title :style="{ color: props.color }" class="flex-grow-1">{{
      title
    }}</v-card-title>
    <v-card-subtitle
      class="text-wrap flex-grow-1"
      :style="{ color: props.color }"
      >{{ subtitle }}</v-card-subtitle
    >
    <div
      class="d-flex flex-column flex-grow-1 align-end align-center-height-auto"
    >
      <v-card-text class="d-flex align-end">
        <div class="d-flex align-center ga-5 gap-80">
          <span class="content1" :style="{ color: props.content1Color }">{{
            content1
          }}</span>
          <span class="content2" :style="{ color: props.color }">{{
            props.content2
          }}</span>
        </div>
      </v-card-text>
      <v-card-actions class="justify-end align-end">
        <v-btn :href="props.buttonUrl"
          :color="btnTextColor"
          :style="{ backgroundColor: props.btnBgColor }"
          ><span style="margin-right: 5px">{{ props.btnText }}</span
          ><img :src="props.btnIcon" alt=""
        /></v-btn>
      </v-card-actions>
    </div>
  </v-card>
</template>

<style scoped>
  .v-card {
    /* height: 370px; */
    width: 320px;
    /* height: 100%; */
    border-radius: 30px;
    border: 1px solid #d0d0d0;
  }

  .v-card-title {
    font-family: 'General Sans Bold';
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }

  .v-card-subtitle {
    color: var(--Black, #000);
    opacity: 1;
    font-family: 'General Sans';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
  }

  .v-card-text .content1 {
    /* color: #16161D;
leading-trim: both;
text-edge: cap; */
    font-family: 'General Sans Bold';
    font-size: 55px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    letter-spacing: -2.2px;
  }

  .v-card-text .content2 {
    font-family: 'General Sans';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
  }

  .v-card-actions {
    justify-content: center;
  }

  .v-btn {
    width: 260px;
    height: 62px;
    border-radius: 31px;
    font-family: 'General Sans Medium';
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    letter-spacing: -0.72px;
    border: 1px solid var(--Black, #000);
    text-transform: unset;
    text-decoration: none;
  }

  /* Adjust size for a 1280px screen */
  @media screen and (max-width: 1280px) {
  }

  /* Further adjustments for smaller screens */
  @media screen and (max-width: 768px) {
    .v-card {
      width: 90%;
      min-height: 450px;
    }

    .align-center-height-auto {
      align-items: center !important;
      height: auto !important;
    }

    .gap-80 {
      gap: 80px !important;
    }
  }

  @media screen and (max-width: 480px) {
  }
</style>
