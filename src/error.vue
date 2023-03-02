<template>
  <section class="error-layout">
    <h1>
      {{ error.statusCode == 404 ? "Page not found" : "An error occurred" }}
    </h1>
    <button @click="handleError" class="button button--primary" href="~/">
      Return home
    </button>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{ error: { statusCode: number } }>();
const handleError = () => clearError({ redirect: "/" });
</script>

<style>
.error-layout {
  height: 100vh;
  width: 100vw;
  background-color: var(--background-color);
  padding-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
