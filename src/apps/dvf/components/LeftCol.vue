<template>
    <div class="leftCol">
      current zoom level : {{zoomLevel}}
      <br/>
      current dep : {{dep}}
      <br/>
      current com : {{com}}
      <br/>
      current section : {{section}}
      <br/>
      current parcelle : {{parcelle}}

      <br /><br />
      Resultat API {{ apiLevel }}
      <br />
      {{ apiResult }}
    </div>
</template>

<script>

import appStore from '@/apps/dvf/store'

export default {
  name: 'LeftCol',
  components: {},
  data() {
    return {
      apiLevel: null,
      apiResult: null
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
    fetchHistoricalData(level){
      let code = null
      if (level === "departement"){
        code = this.dep
      }
      if (level === "commune"){
        code = this.com
      }
      if (level === "section"){
        code = this.section
      }
      console.log("toto")
      fetch("http://dvf.dataeng.etalab.studio/" + level + "/" + code)
      .then((response) => {
          return response.json()
      })
      .then((data) => {
       this.apiResult = data
       this.apiLevel = level
      });

    }
  },
  watch: {
    level: {
      handler(value) {
        this.fetchHistoricalData(value)
      }
    },
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