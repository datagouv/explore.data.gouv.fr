<template>
    <div class="lineChart">
      LineChart
    </div>
</template>

<script>

import appStore from '@/apps/dvf/store'

export default {
  name: 'LineChart',
  components: {},
  data() {
    return {
    }
  },
  computed: {
    zoomLevel:function(){
      return appStore.state.map.zoomLevel
    },
    dep:function(){
      return appStore.state.location.dep
    },
    com:function(){
      return appStore.state.location.com
    },
    section:function(){
      return appStore.state.location.section
    },
    parcelle:function(){
      return appStore.state.location.parcelle
    },
    level:function(){
      return appStore.state.location.level
    }
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
  
  .lineChart{
    width: 100%;
    height: 120px;
    background-color: #B6CFFB;
  }

</style>