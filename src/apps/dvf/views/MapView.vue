<template>
    <div class="mainView" id="mapView">
        <left-col></left-col>
        <choro-map></choro-map>
    </div>

</template>

<script>

import appStore from '@/apps/dvf/store'
import LeftCol from '@/apps/dvf/components/LeftCol'
import ChoroMap from '@/apps/dvf/components/ChoroMap'

export default {
  name: 'MapView',
  components: {LeftCol,ChoroMap},
  data() {
    return {
    }
  },
  computed: {
  },
  mounted() {
  },
  methods: {
  },
  watch: {
  }
}

</script>

<style scoped>

</style>