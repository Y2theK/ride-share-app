<template>
  <div class="pt-16">
    <h1 class="text-3xl font-semibold mb-4">{{ title }}</h1>
    <div class="mt-8 flex justify-center">
      <Loader />
    </div>
  </div>
</template>
<script setup>
import Loader from "@/components/Loader.vue";
import { ref } from "vue";

const title = ref("Waiting for ride request...");
</script>