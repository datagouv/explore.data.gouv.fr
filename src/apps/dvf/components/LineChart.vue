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
    },
    activeFilter:function(){
      return appStore.state.activeFilter
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
        if(self.activeFilter == 'tous'){
          var moyAllVentes = (d["nb_ventes_appartement"] * d["moy_prix_m2_appartement"] + d["nb_ventes_maison"] * d["moy_prix_m2_maison"]) / (d["nb_ventes_appartement"] + d["nb_ventes_maison"])
        }else if(self.activeFilter=='appartement'){
          var moyAllVentes = d["moy_prix_m2_appartement"]
        }else if(self.activeFilter=='maison'){
          var moyAllVentes = d["moy_prix_m2_maison"]
        }else if(self.activeFilter == 'local'){
          var moyAllVentes = d["moy_prix_m2_local"]
        }
        self.values.push(moyAllVentes)
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
    },
    activeFilter(){
      this.updateValues()
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