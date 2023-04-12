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
      fullLabels:{},
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
      this.fullLabels = {}
      this.barData[0]["xaxis"].forEach(function(d){
        self.labels.push(d[0])
        self.fullLabels[d[0]] = [d[0],d[1]]
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
      console.log(self.fullLabels)
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
              },
              tooltip: {
                backgroundColor: 'rgba(74, 157, 247, 1)',
                bodyColor: 'rgba(255, 255, 255, 1)',
                displayColors:false,
                callbacks: {
                  label: function (tooltipItems) {
                    return tooltipItems.formattedValue+" ventes"
                  },
                  title: function (tooltipItems) {
                    return "entre "+self.fullLabels[tooltipItems[0]["label"]][0]+"€ et "+self.fullLabels[tooltipItems[0]["label"]][1]+"€"
                  },
                }
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