<template>
  <div class="pt-16">
    <h1 class="text-3xl font-semibold mb-4">{{ title }}</h1>
    <div>
      <div
        class="overflow-hidden shadow sm:rounded-md max-w-sm mx-auto text-left"
      >
        <div class="bg-white px-4 py-5 sm:p-6">
          <div>
            <GMapMap
              :zoom="14"
              :center="location.current.geometry"
              ref="gMap"
              style="width: 100%; height: 256px"
            >
              <GMapMarker
                :position="location.current.geometry"
                :icon="currentIcon"
              />
              <GMapMarker
                :position="location.destination.geometry"
                :icon="destinationIcon"
              />
            </GMapMap>
          </div>
          <div class="mt-2">
            <p class="text-xl">Going to <strong>pick up a passenger</strong></p>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
          <button
            v-if="trip.is_started"
            @click="handleCompleteTrip"
            class="inline-flex justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none"
          >
            Complete Trip
          </button>
          <button
            v-else
            @click="handlePassengerPickedUp"
            class="inline-flex justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-600 focus:outline-none"
          >
            Passenger Picked Up
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useLocationStore } from "@/stores/location";
import { useTripStore } from "@/stores/trip";
import { useRouter } from "vue-router";
import { ref, onMounted, onUnmounted } from "vue";
import http from "@/helpers/http";
const location = useLocationStore();
const trip = useTripStore();
const router = useRouter();
const gMap = ref(null);
const title = ref("Driving to passenger...");
const intervelRef = ref(null);
const currentIcon = {
  url: "https://openmoji.org/data/color/svg/1F698.svg",
  scaledSize: {
    width: 32,
    height: 32,
  },
};
const destinationIcon = {
  url: "https://openmoji.org/data/color/svg/1F920.svg",
  scaledSize: {
    width: 24,
    height: 24,
  },
};
const handlePassengerPickedUp = () => {
  http()
    .post(`/trip/${trip.id}/start`)
    .then((response) => {
      title.value = "Travelling to destination";
      location.$patch({
        destination: {
          geometry: response.data.destination,
          name: response.data.destination_name,
        },
      });

      trip.$patch(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

const handleCompleteTrip = () => {
  http()
    .post(`/trip/${trip.id}/end`)
    .then((response) => {
      title.value = "Completed Trip";

      trip.$patch(response.data);

      //reset trip and location after 3 sec of completing trip
      setTimeout(() => {
        trip.reset();
        location.reset();
        router.push({
          name: "standby",
        });
      }, 3000);
    })
    .catch((error) => {
      console.log(error);
    });
};
//map bound betweeen driver location and pessenger location
const updateMapBounds = (mapObject) => {
  let originPoint = new google.maps.LatLng(location.current.geometry),
    destinationPoint = new google.maps.LatLng(location.destination.geometry),
    latLngBounds = new google.maps.LatLngBounds();
  latLngBounds.extend(originPoint);
  latLngBounds.extend(destinationPoint);
  mapObject.fitBounds(latLngBounds);
};
const broadcastDriverLocation = () => {
  http()
    .post(`/trip/${trip.id}/location`, {
      driver_location: location.current.geometry,
    })
    .then((response) => {})
    .catch((error) => {
      console.log(error);
    });
};

onMounted(() => {
  gMap.value.$mapPromise.then((mapObject) => {
    updateMapBounds(mapObject);

    //update driver current llcation in store and MapBound in each 5 sec
    intervelRef.value = setInterval(async () => {
      await location.updateCurrentLocation();

      //update driver location in database
      broadcastDriverLocation();

      updateMapBounds(mapObject);
    }, 5000);
  });
});

onUnmounted(() => {
  //clear interval
  clearInterval(intervelRef.value);
  intervelRef.value = null;
});
</script>