<template>
  <div class="pt-16">
    <h1 class="text-3xl font-semibold mb-4">Enter your phone number</h1>
    <form
      action="#"
      v-if="!waitingForVerification"
      @submit.prevent="handleLogin"
    >
      <div
        class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left"
      >
        <div class="bg-white px-4 py-5 sm:p-6">
          <div>
            <input
              type="text"
              v-maska
              data-maska="## # #########"
              v-model="credentials.phone"
              name="phone"
              id="phone"
              placeholder="1 (234) 567-8910"
              class="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-black focus:outline-none"
            />
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
          <button
            type="submit"
            class="inline-flex justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none"
          >
            Continue
          </button>
        </div>
      </div>
    </form>
    <form action="#" v-else @submit.prevent="handleVerification">
      <div
        class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left"
      >
        <div class="bg-white px-4 py-5 sm:p-6">
          <div>
            <input
              type="text"
              v-maska
              data-maska="######"
              v-model="credentials.login_code"
              placeholder="123456"
              name="login_code"
              id="login_code"
              class="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-black focus:outline-none"
            />
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
          <button
            type="submit"
            class="inline-flex justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none"
          >
            Verify
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { vMaska } from "maska";
import { computed, onMounted, reactive, ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

const credentials = reactive({
  phone: null,
  login_code: null,
});

const waitingForVerification = ref(false);

//if user already login
onMounted(() => {
  if (localStorage.getItem("token")) {
    router.push({ name: "landing" });
  }
});

//let format phone number
const getFormattedCredentials = () => {
  return {
    phone: credentials.phone.replaceAll(" ", ""),
    login_code: credentials.login_code,
  };
};

const handleLogin = () => {
  // console.log(import.meta.env.VITE_APP_BASE_URL);
  axios
    .post(
      `${import.meta.env.VITE_APP_BASE_URL}/login`,
      getFormattedCredentials()
    )
    .then((response) => {
      console.log(response.data);
      waitingForVerification.value = true;
    })
    .catch((error) => {
      console.log(error);
      alert(error.response.data.message);
    });
};

const handleVerification = () => {
  axios
    .post(
      `${import.meta.env.VITE_APP_BASE_URL}/login/verify`,
      getFormattedCredentials()
    )
    .then((response) => {
      console.log(response.data);
      localStorage.setItem("token", response.data);

      router.push({
        name: "landing",
      });
    })
    .catch((error) => {
      console.log(error);
      alert(error.response.data.message);
    });
};
</script>