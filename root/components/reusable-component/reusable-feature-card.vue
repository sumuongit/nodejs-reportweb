<script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue';

  const props = defineProps({
    icon: String,
    title: String,
    description: String,
    shortDescription: String,
    isExpanded: Boolean
  });

  const emit = defineEmits(['expand', 'collapse']);

  const toggleText = () => {
    if (props.isExpanded) {
      emit('collapse');
    } else {
      emit('expand');
    }
  };

  const windowWidth = ref(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );
  const isMobile = computed(() => windowWidth.value < 768);

  // Watch for window resize using a reactive windowWidth
  const handleResize = () => {
    windowWidth.value = window.innerWidth;
  };

  onMounted(() => {
    if (typeof window !== 'undefined') {
      windowWidth.value = window.innerWidth;
      window.addEventListener('resize', handleResize);
    }
  });

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', handleResize);
    }
  });
</script>

<template>
  <v-col :cols="isExpanded ? 12 : isMobile ? 12 : 4" class="d-flex">
    <div class="d-flex flex-grow-1 card">
      <v-card class="d-flex flex-column ga-4 flex-grow-1 elevation-0">
        <v-card-title class="d-flex flex-column ga-5">
          <div class="d-flex justify-center align-center icon">
            <div>
              <v-img width="auto" :src="props.icon"></v-img>
            </div>
          </div>
          <span class="feature-title">{{ props.title }}</span>
        </v-card-title>
        <v-card-text class="d-flex">
          <div class="feature-description">
            {{ props.isExpanded ? props.description : props.shortDescription }}
            <span class="toggle-link" @click="toggleText">
              {{ props.isExpanded ? 'less' : 'more' }}
            </span>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </v-col>
</template>

<style scoped>
  .card {
    padding: 20px 0 0 20px;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0px 23.58px 100px 0px rgba(0, 0, 0, 0.06);
  }

  .icon {
    width: 90px;
    height: 90px;
    border-radius: 100px;
    border: 10px solid #f3f8fc;
  }

  .feature-title {
    color: var(--Black---100, #12141d);
    font-family: 'General Sans Medium';
    font-size: 24px;
    font-style: normal;
    font-weight: 500;
    line-height: 32px;
  }

  .feature-description {
    color: #3f3e3e;
    font-family: 'General Sans';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 30px;
  }

  .toggle-link {
    color: var(--Color-3, #fc6200);
    font-family: 'General Sans';
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 30px;
    text-decoration-line: underline;
    cursor: pointer;
  }
</style>
