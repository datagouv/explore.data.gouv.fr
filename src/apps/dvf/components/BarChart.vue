<template>
    <div class="barChart">
      <canvas id="barchart"></canvas>
    </div>
</template>

<script>

import appStore from '@/apps/dvf/store'
import { Chart } from 'chart.js'

export default {
  name: 'BarChart',
  components: {},
  data() {
    return {
      values:[],
      labels:[],
      chart: undefined,
    }
  },
  computed: {
    apiData:function(){
      return appStore.state.apiData
    }
  },
  mounted() {
  },
  methods: {
    updateValues(){
      var self = this
      this.values = []
      this.labels = []
      this.apiData["data"].forEach(function(d,i){
        self.labels.push(d["annee_mois"])
        self.values.push(d["moy_prix_m2_appartement"])
      })
    }
  },
  watch: {
    apiData(){
      this.updateValues()
    },
    values(){

    }
  }
}

</script>

<style scoped>
  
  .barChart{
    width: 100%;
    height: 120px;
    background-color: #B6CFFB;
  }

</style>