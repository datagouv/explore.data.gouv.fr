<template>
    <div class="lineChart">
      <canvas id="linechart"></canvas>
    </div>
</template>

<script>

import appStore from '@/apps/dvf/store'
import { Chart } from 'chart.js'

export default {
  name: 'LineChart',
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
    },
    buildChart(){
      var self = this
      const ctx = document.getElementById('linechart').getContext('2d')
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.labels,
          datasets: [{
            data: this.values,
            borderWidth: 1,
            pointRadius:0,
            borderColor:"rgba(22, 22, 22, 1)"
          }],

        },
        options: {
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              grid:{
                display:false,
                drawBorder: false
              },
              ticks: {
                callback: function(value, index, ticks) {
                  if(index==0||index==self.labels.length-1){
                    return self.labels[index]
                  }
                }
              }
            },
            y: {
              beginAtZero: false,
              grid:{
                display:false,
                drawBorder: false
              },
              ticks: {
                callback: function(value, index, ticks) {
                  if(index==0||index==ticks.length-1){
                    return value+"€"
                  }
                }
              }
            },
          }
        },
      });
    }
  },
  watch: {
    apiData(){
      this.updateValues()
    },
    values(){
      if(this.chart){
        this.chart.data.datasets[0].data = this.values
        this.chart.labels = this.labels
        this.chart.update()
      }else{
        this.buildChart()
      }
     }
  }
}

</script>

<style scoped>
  
  .lineChart{
    width: 100%;
    height: 120px;
  }

  .lineChart canvas{
    width: 100%;
    max-height: 120px;
  }

</style>