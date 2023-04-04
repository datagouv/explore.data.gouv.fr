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
    apiLevel:function(){
      return appStore.state.apiLevel
    },
    apiCode:function(){
      return appStore.state.apiCode
    },

  },
  mounted() {
    this.updateData("nation")
  },
  methods: {
    updateData(code){
      fetch("http://dvf.dataeng.etalab.studio/distribution/"+code)
      .then((response) => {
          return response.json()
      })
      .then((data) => {
        this.barData = data["data"]
        this.updateValues()
      });
    },
    updateValues(){
      var self = this
      this.labels = []
      this.values = []
      this.barData[0]["xaxis"].forEach(function(d){
        self.labels.push(d[0])
      })
      this.barData[0]["yaxis"].forEach(function(d){
        self.values.push(d)
      })
      if(this.chart){
        this.chart.data.datasets[0].data = this.values
        this.chart.labels = this.labels
        this.chart.update()
      }else{
        this.buildChart()
      }
    },
    buildChart(){
      var self = this
      const ctx = document.getElementById('barchart').getContext('2d')
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.labels,
          datasets: [{
            data: this.values,
            borderWidth: 0,
            backgroundColor: '#B6CFFB',
            barPercentage:1.15
          }],
        },
       options: {
          plugins: {
              legend: {
                display: false
              }
            },
          animation: {
            easing: 'easeInOutBack'
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
                    return self.labels[index]+"€"
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
                  return ""
                }
              }
            },
          }
        },
      });
    }
  },
  watch: {
    apiCode(){
      this.updateData(this.apiCode)
    },
  }
}

</script>

<style scoped>
  
  .barChart{
    width: 100%;
    height: 120px;
  }

  .barChart canvas{
    width: 100%;
    max-height: 120px;
  }

</style>