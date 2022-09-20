<template>
  <div class="page">
      <canvas :id="id"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables);

export default {
  name: 'Histogram',
  mixins: [],
  components:{
      
  },
  data(){
    return {
    }
  },
  props: {
    title: String,
    datachart: Array,
    labels: Array,
    id: String,
  },
  computed: {
  },
  mounted() {

    let labs = []
    let max = this.labels.length
    let originLabels = this.labels
    for (let i = 0; i < max; i++) {
      if(i+1 != max) {
        labs.push('valeurs entre '+this.choseIntFloat(originLabels[i])+' et '+this.choseIntFloat(originLabels[i+1]))
      } else {
        labs.push('supérieur à '+this.choseIntFloat(originLabels[i]))
      }
    }  
    
    const myChart = new Chart(document.getElementById(this.id), {
        type: 'bar',
        data: {
            labels: labs,
            datasets: [{
            label: 'occurrences',
            data: this.datachart,
            backgroundColor: '#dae6fd',
            }]
        },
        options: {
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        display: false,
                        //maxTicksLimit: 2
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxTicksLimit: 5
                    }
                }
            },
        }
    });

  },
  methods: {
    choseIntFloat(n) {
      if(n.toFixed(1) % 1 === 0) {
        return n.toFixed(0)
      } else {
        return n.toFixed(1)
      }
    }
  },
  watch:{
  },
  created(){
  },
  updated(){
  }
}
</script>

<style scoped lang="scss">

canvas{
  width:300px !important;
  margin: auto;

}
</style>
