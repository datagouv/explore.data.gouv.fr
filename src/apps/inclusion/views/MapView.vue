<template>
  <div class="mainView" id="mapView">
    <left-col></left-col>
    <choro-map></choro-map>
  </div>
</template>

<script>
import appStore from "@/apps/inclusion/store";
import LeftCol from "@/apps/inclusion/components/LeftCol";
import ChoroMap from "@/apps/inclusion/components/ChoroMap";

export default {
  name: "MapView",
  components: { LeftCol, ChoroMap },
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  methods: {},
  watch: {},
};
</script>

<style scoped>
</style>