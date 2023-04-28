import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import LandingView from "../views/LandingView.vue";
import LocationView from "../views/LocationView.vue";
import MapView from "../views/MapView.vue";
import TripView from "../views/TripView.vue";
import StandByView from "../views/StandByView.vue";
import DriverView from "../views/DriverView.vue";
import axios from "axios";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: LoginView,
    },
    {
      path: "/landing",
      name: "landing",
      component: LandingView,
    },
    {
      path: "/location",
      name: "location",
      component: LocationView,
    },
    {
      path: "/map",
      name: "map",
      component: MapView,
    },
    {
      path: "/trip",
      name: "trip",
      component: TripView,
    },
    {
      path: "/standby",
      name: "standby",
      component: StandByView,
    },
    {
      path: "/driver",
      name: "driver",
      component: DriverView,
    },
  ],
});

router.beforeEach((to, from) => {
  if (to.name === "login") {
    return true;
  }

  if (!localStorage.getItem("token")) {
    return {
      name: "login",
    };
  }

  checkTokenAuthenticity();
});

const checkTokenAuthenticity = () => {
  axios
    .get(`${import.meta.env.VITE_APP_BASE_URL}/user`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {})
    .catch((error) => {
      localStorage.removeItem("token");
      router.push({
        name: "login",
      });
    });
};

export default router;
