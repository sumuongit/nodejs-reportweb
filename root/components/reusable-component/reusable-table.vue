<script setup>
  import { ref, computed, onMounted, onUnmounted, watchEffect } from 'vue';

  const props = defineProps({
    columns: Array,
    rows: Array,
    infoIcon: String
  });

  const windowWidth = ref(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );
  const isMobile = computed(() => windowWidth.value < 768);

  const displayTexts = ref([]);
  const displayHeads = ref([]);

  const updateText = () => {
    displayTexts.value = props.rows.map(row => {
      ['freeRun', 'team', 'enterprise'].forEach(field => {
        if (row[field] === 'Unlimited') {
          row[field] = isMobile.value ? '∞' : 'Unlimited';
        }
      });
      return row;
    });

    displayHeads.value = props.columns.map(item => {
      let newItem = item;
      if (item === 'Free Run') {
        newItem = isMobile.value ? 'FR' : 'Free Run';
      }
      if (item === 'Team') {
        newItem = isMobile.value ? 'TM' : 'Team';
      }
      if (item === 'Enterprise') {
        newItem = isMobile.value ? 'EP' : 'Enterprise';
      }
      return newItem;
    });
  };

  // Watch for window resize using a reactive windowWidth
  const handleResize = () => {
    windowWidth.value = window.innerWidth;
  };

  onMounted(() => {
    updateText();
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

  // Automatically update text when window size changes or on initial mount
  watchEffect(() => {
    updateText();
  });
</script>

<template>
  <div class="data-table w-100">
    <div class="header-row">
      <div
        v-for="(column, index) in displayHeads"
        :key="index"
        :class="[
          'd-flex header-cell',
          index === 0 ? 'first-column-width-fixed' : 'justify-center'
        ]"
      >
        {{ column }}
      </div>
    </div>
    <div class="body">
      <div
        v-for="(row, rowIndex) in displayTexts"
        :key="rowIndex"
        class="body-row"
      >
        <div
          class="first-column-width-fixed"
          :class="[
            rowIndex !== displayTexts.length - 1
              ? 'body-cell'
              : 'body-cell-no-border-bottom'
          ]"
        >
          <span>{{ row.name }}</span>
          <v-tooltip location="top">
            <template #activator="{ props }">
              <img v-bind="props" :src="props.infoIcon" class="info-icon" />
            </template>
            <span>{{ row.tooltip }}</span>
          </v-tooltip>
        </div>
        <div
          class="d-flex justify-center align-center"
          :class="[
            rowIndex !== displayTexts.length - 1
              ? 'body-cell'
              : 'body-cell-no-border-bottom'
          ]"
        >
          <span v-if="row.freeRun && row.freeRun.includes('.png')">
            <img :src="row.freeRun" />
          </span>
          <span v-else>
            {{ row.freeRun }}
          </span>
        </div>
        <div
          class="d-flex justify-center"
          :class="[
            rowIndex !== displayTexts.length - 1
              ? 'body-cell'
              : 'body-cell-no-border-bottom'
          ]"
        >
          <span v-if="row.team && row.team.includes('.png')">
            <img :src="row.team" />
          </span>
          <span v-else>
            {{ row.team }}
          </span>
        </div>
        <div
          class="d-flex justify-center"
          :class="[
            rowIndex !== displayTexts.length - 1
              ? 'body-cell'
              : 'body-cell-no-border-bottom'
          ]"
        >
          <span v-if="row.enterprise && row.enterprise.includes('.png')">
            <img :src="row.enterprise" />
          </span>
          <span v-else>
            {{ row.enterprise }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .data-table {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .header-row,
  .body-row {
    display: flex;
    gap: 30px;
  }

  .body-row:hover {
    background-color: #f5f5f5;
    border-radius: 10px;
  }

  .header-row {
    color: #16161d;
    font-family: 'General Sans Bold';
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }

  .body-row {
    color: var(--Black, #000);
    font-family: 'General Sans Medium';
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
  }

  .header-cell,
  .body-cell {
    display: flex;
    gap: 10px;
    flex: 1;
    padding: 30px;
    border-bottom: 1px solid #d0d0d0;
  }

  .body-cell-no-border-bottom {
    display: flex;
    gap: 10px;
    flex: 1;
    padding: 30px;
  }

  .body-cell img {
    max-width: 50px;
    max-height: 50px;
  }

  .info-icon {
    display: none;
  }

  .body-row:hover .info-icon {
    display: inline;
    cursor: pointer;
  }

  .first-column-width-fixed {
    justify-content: flex-start;
    flex: 0 0 350px;
  }

  /* Adjust size for a 1280px screen */
  @media screen and (max-width: 1280px) {
  }

  /* Further adjustments for smaller screens */
  @media screen and (max-width: 768px) {
    .first-column-width-fixed {
      flex: 0 0 225px;
    }

    .header-cell,
    .body-cell,
    .body-cell-no-border-bottom {
      padding: 30px 0;
    }

    .header-row,
    .body-row {
      gap: 10px;
    }

    .body-cell {
      align-items: center;
    }
  }

  @media screen and (max-width: 480px) {
  }
</style>
