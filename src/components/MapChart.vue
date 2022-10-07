<template>
  <div>
    <h6 class="titleChart">{{ titleChart }}</h6>
    <div class="widget_container fr-grid-row" :id="widgetId">
      <div class="r_col fr-col-12 fr-col-lg-9">
        <div class="map m-lg">
          <div class="map_tooltip" v-if="tooltip.display" :style="{top:tooltip.top,left:tooltip.left}">
            <div class="tooltip_header">{{ tooltip.x }}</div>
            <div class="tooltip_body">
              <div class="tooltip_value">{{ tooltip.value }} {{ unitChart }}</div>
            </div>
          </div>
          <div class="france_container no_select">
            <france :onenter="hello" :onleave="bye"></france>
          </div>
          <!-- <div class="om_container fr-grid-row no_select">
            <div class="om fr-col-4 fr-col-sm">
              <span class="fr-text--xs fr-my-1w">Guadeloupe</span>
              <guadeloupe :onenter="displayTooltip" :onleave="hideTooltip"></guadeloupe>
            </div>
            <div class="om fr-col-4 fr-col-sm">
              <span class="fr-text--xs fr-my-1w">Martinique</span>
              <martinique :onenter="displayTooltip" :onleave="hideTooltip"></martinique>
            </div>
            <div class="om fr-col-4 fr-col-sm">
              <span class="fr-text--xs fr-my-1w">Guyane</span>
              <guyane :onenter="displayTooltip" :onleave="hideTooltip"></guyane>
            </div>
            <div class="om fr-col-4 fr-col-sm">
              <span class="fr-text--xs fr-my-1w">La Réunion</span>
              <reunion :onenter="displayTooltip" :onleave="hideTooltip"></reunion>
            </div>
            <div class="om fr-col-4 fr-col-sm">
              <span class="fr-text--xs fr-my-1w">Mayotte</span>
              <mayotte :onenter="displayTooltip" :onleave="hideTooltip"></mayotte>
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import maps from '@/components/maps'
import * as d3 from 'd3-scale'
import { isMobile } from 'mobile-device-detect'

export default {
  name: 'MapChart',
  components: {
    ...maps
  },
  data () {
    return {
      indicateur_data: undefined,
      labels: [],
      dataset: [],
      widgetId: '',
      chartId: '',
      display: '',
      scaleMin: 0,
      scaleMax: 0,
      units: [],
      chart: undefined,
      loading: true,
      legendLeftMargin: 0,
      geoFallback: false,
      geoFallbackMsg: '',
      tooltip: {
        top: '0px',
        left: '0px',
        display: false,
        value: 0,
        x: '',
      }
    }
  },
  props: {
    indicateur: String,
    titleChart: String,
    unitChart: String,
  },
  computed: {
    valuesx () {
      return this.$store.state.valuesx
    },
    valuesy () {
      return this.$store.state.valuesy
    },
  },
  methods: {
    getData () {
      let x
      const parentWidget = document.getElementById('mapViz')
      let elCol 
      const min = Math.min(...this.valuesy)
      const max = Math.max(...this.valuesy)
      console.log(min)
      console.log(max)
      x = d3.scaleLinear().domain([min,max]).range(['#ffc700', '#715845'])
      for (let i = 0; i < this.valuesx.length; i++) {
        elCol = parentWidget.getElementsByClassName('FR-' + this.valuesx[i])
        elCol.length !== 0 && elCol[0].setAttribute('fill', x(this.valuesy[i]))
      }
      
    },
    hello(e){      
      console.log(e)
      if (isMobile) return
      const hoverdep = e.target.className.baseVal.replace(/FR-/g, '')
      this.tooltip.top = e.clientY + 'px'
      this.tooltip.left = e.clientX + 'px'
      this.tooltip.display = true
      this.tooltip.x = hoverdep
      for (let i = 0; i < this.valuesx.length; i++) {
        if(this.valuesx[i] === hoverdep) {
          this.tooltip.value = this.valuesy[i]
        }
      }
      console.log(hoverdep)
    },
    bye(){
      this.tooltip.display = false
      return
    }
  },

  watch: {
    valuesx(){
      this.getData()
    },
    valuesy(){
      this.getData()
    }
  },

  mounted () {
    this.chartId = 'myChart' + Math.floor(Math.random() * (1000))
    this.widgetId = 'widget' + Math.floor(Math.random() * (1000))
    this.getData()
  }
}

</script>

<style scoped lang="scss">

  .no_select {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
  }

  .widget_container{
    margin-left: 70px;
    .m-lg {
      margin-left:0;
      margin-top:1.5rem;
    }
    .map {
      display:flex;
      flex-direction:column;
      align-items:center;
      .map_tooltip{
        width: 165px;
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
          padding-top: 3px;
        }
        .tooltip_body{
          padding-left: 5px;
          padding-bottom: 5px;
          line-height: 1.67;
          .tooltip_place{
            color:#242424;
          }
          .tooltip_value{
            color:#242424;
            font-weight: bold;
          }
        }
      }
      .france_container{
        height:100%;
        svg {
          height:100%;
          width:100%;
          g {
            cursor: pointer;
          }
        }
      }
      .om_container{
        width:100%;
        .om{
          display: flex;
          flex-direction: column;
          align-items: center;
          color: #616161;
          span{
            display: block;
            white-space: nowrap;
          }
          g{
            cursor: pointer;
          }
        }
      }
    }
    @media (min-width: 62em) {
      .m-lg {
        margin-left:3rem;
        margin-top:0
      }
      .map {
        height:100%;
      }
    }
    @media (max-width: 62em) {
      .chart .flex {
        margin-left:0!important
      }
      .map {
        width:100%;
      }
    }
    .r_col {
      align-self:stretch;
      .flex{
        display: flex;
        align-items: center;
      }
    }

  }

.titleChart{
  margin-left: 45px;
}
</style>
