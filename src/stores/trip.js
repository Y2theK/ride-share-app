import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useTripStore = defineStore("trip", () => {
  const id = ref(null);
  const user_id = ref(null);
  const destination_name = ref("");
  const origin = reactive({
    lat: null,
    lng: null,
  });

  const destination = reactive({
    lat: null,
    lng: null,
  });

  return { id, user_id, destination_name, origin, destination };
});
