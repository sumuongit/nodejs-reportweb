<script setup>
  import { ref } from 'vue';

  const props = defineProps({
    faqs: Array
  });

  const expandedIndex = ref(0);
</script>

<template>
  <v-expansion-panels v-model="expandedIndex">
    <v-expansion-panel
      v-for="(faq, index) in props.faqs"
      :key="index"
      elevation="0"
    >
      <v-expansion-panel-title
        collapse-icon="mdi-minus"
        expand-icon="mdi-plus"
        class="question-text"
      >
        <span :class="{ 'active-faq': expandedIndex === index }">{{
          faq.question
        }}</span>
      </v-expansion-panel-title>
      <v-expansion-panel-text class="answer-text">
        {{ faq.answer }}
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<style scoped>
  .v-expansion-panel {
    background: transparent;
  }

  .question-text {
    color: var(--Black, #000);
    font-family: 'General Sans';
    font-size: 30px;
    font-style: normal;
    font-weight: 400;
    line-height: 32px;
  }

  .answer-text {
    color: var(--Black, #000);
    font-family: 'General Sans';
    font-size: 22px;
    font-style: normal;
    font-weight: 400;
    line-height: 40px;
  }

  /* .question-text:hover {
    background: var(--Linear, linear-gradient(90deg, #000 0.75%, #FC6200 59.42%));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
} */

  .active-faq {
    background: var(
      --Linear,
      linear-gradient(90deg, #000 0.75%, #fc6200 59.42%)
    );
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  /* Adjust size for a 1280px screen */
  @media screen and (max-width: 1280px) {
  }

  /* Further adjustments for smaller screens */
  @media screen and (max-width: 768px) {
    .v-expansion-panel-title {
      padding: 16px 1px;
    }
  }

  @media screen and (max-width: 480px) {
  }
</style>
