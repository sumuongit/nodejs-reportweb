<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

let baseUrl = '';
if (import.meta.env.MODE === 'development') {
  baseUrl = import.meta.env.VITE_DEV_BASE_URL;
} else if (import.meta.env.MODE === 'production') {
  baseUrl = import.meta.env.VITE_PRO_BASE_URL;
} else {
  console.log('Running client in unknown or development mode');
}

const props = defineProps({
  banner: String,
  date: String,
  author: String,
  title: String,
  category: String,
  slug: String
});

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

const minimizetitle = (title, maxlength) => {
  if (title.length > maxlength) {
    return title.slice(0, maxlength) + "...";
  }
  return title;

};
</script>

<template>
  <v-col :cols="isMobile ? 12 : 4" class="d-flex justify-center align-center" style="width: 200px; font:15px">
    <div class="d-flex">
      <a :href="`${baseUrl}/blogs/${props.slug}`">
        <v-card class="d-flex flex-column elevation-0">
          <v-card-title class="d-flex flex-column ga-2">
            <div class="d-flex justify-center align-center">
              <v-img width="100%" :src="props.banner" aspect-ratio="16/9" cover></v-img>
            </div>
            <div class="d-flex ga-1 date-author">
              <span>{{ props.date }}</span>
              <span>-</span>
              <span>
                {{ props.author }}
              </span>
            </div>
          </v-card-title>
          <v-card-text class="d-flex pb-0">
            <span class="blog-title">{{ minimizetitle(props.title, 58) }}</span>
          </v-card-text>
        </v-card>
      </a>
    </div>
  </v-col>
</template>
<style scoped>
.v-card {
  background: transparent;
  width: 500px;
  height: 450px;
  overflow: hidden;
}

.v-img {
  border-radius: 6px;
  height: 300px;
}

.date-author {
  color: #3f3e3e;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.14px;
}

.blog-title {
  color: #12141d;
  font-family: 'General Sans Medium';
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 36px;
}

a {
  text-decoration: none;
}

a:hover .v-card {
  background-color: rgb(235, 245, 247);
}

/* Adjust size for a 1280px screen */
@media screen and (max-width: 1280px) {
  .v-card {
    width: 325px;
    height: 375px;
  }

  .v-img {
    height: 200px;
  }
}

/* Further adjustments for smaller screens */
@media screen and (max-width: 768px) {
  .v-col {
    padding: unset;
  }

  .v-card {
    width: 400px;
    height: 375px;
  }
}

@media screen and (max-width: 480px) {}
</style>
