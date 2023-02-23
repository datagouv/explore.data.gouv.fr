<template>
    <div class="leftCol">
      current zoom level : {{zoomLevel}}
    </div>
</template>

<script>

import appStore from '@/apps/dvf/store'

export default {
  name: 'LeftCol',
  components: {},
  data() {
    return {
    }
  },
  computed: {
    zoomLevel:function(){
      return appStore.state.map.zoomLevel
    },
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

.leftCol{
    display: inline-block;
    width: 25%;
    min-height: 100%;
    float:left;
}

</style>