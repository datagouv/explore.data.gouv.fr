<template>
  <div class="page">
      <canvas id="myChart"></canvas>
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
  },
  computed: {
  },
  mounted() {

    let labs = []
    this.labels.forEach((l) => {
        labs.push(l.toFixed(2))
    });
    
    const myChart = new Chart(document.getElementById('myChart'), {
        type: 'bar',
        data: {
            labels: labs,
            datasets: [{
            label: this.title,
            data: this.datachart,
            backgroundColor: '#3558A2',
            }]
        },
        options: {
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    grid: {
                        display: false
                    }
                }
            },
        }
    });

  },
  methods: {
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
  width:350px !important;
  margin: auto;

}

</style>