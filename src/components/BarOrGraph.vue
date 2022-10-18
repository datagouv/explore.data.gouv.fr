<template>
  <div>
    <div class="widget">
      <div class="chart">
        <h6 class="titleChart">{{ titleChart }}</h6>
        <div class="barchart_tooltip" v-if="tooltip.display" :style="{top:tooltip.top,left:tooltip.left}">
          <div class="tooltip_header">{{ tooltip.x }}</div>
          <div class="tooltip_body">
            <div class="tooltip_value">
              <span class="legende_dot" :style="dotStyles"></span>
              {{tooltip.value}}
            </div>
          </div>
        </div>
        <canvas :ref="chartId" :id="chartId"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto'
export default {
  name: 'BarOrGraph',
  data(){
    return {
      chartId: '',
      tooltip: {
        top: '0px',
        left: '0px',
        display: false,
        value: 110,
        x: '',
      },
      unite:'',
      tooltip: {
        top: '0px',
        left: '0px',
        display: false,
        value: 110,
        date: '',
      }
    }
  },
  props: {
    indicateur: String,
    color: String,
    titleChart: String,
    unitChart: String,
    typeChart: String,
    valuesx: Array,
    valuesy: Array,
  },
  computed: {
    dotStyles() {
      return {
        "background-color": this.color
      };
    },
  },
  methods: {
    async getData () {
      var url = this.indicateur
      this.chartId = 'myChart' + Math.floor(Math.random() * (1000))
      this.createChart()
    },
    createChart () {
      const self = this
      const labels = []
      const datapoints = []
      if(self.valuesx && self.valuesy && self.valuesx.length != 0 && self.valuesx.length === self.valuesy.length) {
        for (let i = 0; i < self.valuesx.length; i++) {
          labels.push(self.valuesx[i])
          datapoints.push(self.valuesy[i])
        } 

        let xTickLimit = 6    
        let bgColor = this.color   
        setTimeout((e) => {
          const ctx = document.getElementById(self.chartId).getContext('2d')
          if(ctx){
            let configDataset = {
              data: datapoints,
              backgroundColor: bgColor,
              type: this.typeChart, 
              pointRadius: 0.1
            }
            if(this.typeChart != 'bar') {
              configDataset['borderWidth'] = 2
              configDataset['borderColor'] = bgColor
            }

            this.chart = new Chart(ctx, {
              data: {
                labels: labels,
                datasets: [configDataset]
              },
              options: {
                animation: {
                  easing: 'easeInOutBack'
                },
                onHover: (e) => {
                  if (this.chart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, true).length !== 0) {
                    self.tooltip.display = true
                    const index = this.chart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, true)[0].index
                    const pxTop = this.chart.scales['yAxis'].getPixelForValue(datapoints[index])
                    self.tooltip.top = (this.$refs[this.chartId].getBoundingClientRect().top + pxTop - 60) + 'px'
                    self.tooltip.left = (this.$refs[this.chartId].getBoundingClientRect().left + this.chart.scales['xAxis'].getPixelForTick(index)) + 'px'
                    self.tooltip.value = datapoints[index] + " " + self.unitChart
                    self.tooltip.x = labels[index]
                    // var date = new Date(labels[index])
                    // const options = {day: 'numeric', month: 'long', year: 'numeric'};
                    // var ndate = date.toLocaleDateString('fr-FR',options)
                    // self.tooltip.date = ndate
                  } else {
                    self.tooltip.display = false
                  }
                },
                scales: {
                    xAxis: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            maxTicksLimit: 10,
                            callback: function(tick) {
                                var characterLimit = 15;
                                if (this.getLabelForValue(tick).length >= characterLimit) {
                                    return this.getLabelForValue(tick).slice(0, this.getLabelForValue(tick).length).substring(0, characterLimit - 1).trim() + '...';
                                }
                                return this.getLabelForValue(tick);
                            }
                        }
                    },
                    yAxis: {
                        grid: {
                          color: '#e5e5e5',
                          borderDash: [3]
                        },
                        ticks: {
                            maxTicksLimit: 5
                        }
                    }
                },
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    enabled: false // <-- this option disables tooltips
                  }
                },
              }
            })
          }
        },100)
      }
    },
    updateChart () {
      this.getData()
      this.chart.destroy()
      this.chart.update()
    }
  },
  created(){
    this.chartId = 'myChart' + Math.floor(Math.random() * (1000))
    this.getData()
  },
  watch: {
    valuesy() {
        if (this.valuesy != null) {
            this.updateChart()
        }
    }
  }
}
</script>

<style scoped lang="scss">
  .widget{
    max-width: 600px;
    border: 1px solid #E5E5E5;
    padding: 10px;
  }
  .chart{
    width: 100%;
  }
  canvas{
    width: 100%;
  }
  .barchart_tooltip{
      min-width: 165px;
      height: auto;
      background-color: white;
      position: fixed;
      z-index: 999;
      border-radius: 4px;
      box-shadow: 0 8px 16px 0 rgba(22, 22, 22, 0.12), 0 8px 16px -16px rgba(22, 22, 22, 0.32);
      text-align: left;
      pointer-events: none;
      font-size: 0.75rem;
      .tooltip_header{
        width: 100%;
        height: 30px;
        background-color: #f6f6f6;
        color:#6b6b6b;
        padding-left: 5px;
        padding-right: 5px;
        padding-top: 3px;
      }
      .tooltip_body{
        padding-left: 5px;
        padding-bottom: 5px;
        line-height: 1.67;
        .legende_dot{
          width: 0.7rem;
          height: 0.7rem;
          border-radius: 50%;
          
          display: inline-block;
          margin-top: 0.25rem;
        }
        .tooltip_place{
          color:#242424;
        }
        .tooltip_value{
          color:#242424;
          font-weight: bold;
        }
      }
    }
.titleChart{
  margin-left: 15px;
  font-size: 16px;
}
</style>