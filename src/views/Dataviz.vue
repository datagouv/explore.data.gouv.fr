<template>
    <div v-if="csvUrl && !hasError">
        Axe X :
        <br />
        <span v-if="columnsInfos">
          <select class="selectBox" v-model="axex" @change="setUrl('viz_axis_x', axex)">
            <option value="">--Sélectionner--</option>
            <option v-for="item in listex" :key="item">
                {{ item }}
            </option>
          </select>
        </span>
        <br />
        <br />
        Axe Y :
        <br />
        <span v-if="columnsInfos" @change="setUrl('viz_axis_y', axey)">
          <select class="selectBox" v-model="axey">
            <option value="">--Sélectionner--</option>
            <option v-for="item in listey" :key="item">
                {{ item }}
            </option>
          </select>
        </span>
        <br />
        <br />
        Opération :
        <br />
        <span>
          <select class="selectBox" v-model="op" @change="setUrl('viz_op', op)">
            <option value="">--Sélectionner--</option>
            <option value="count">Nombre</option>
            <option value="sum">Somme</option>
            <option value="max">Maximum</option>
            <option value="min">Minimum</option>
            <option value="mean">Moyenne</option>
          </select>
        </span>
        <br />
        <br />
        <br />
        <span v-if="generateChart">
          <bar-chart indicateur="stats-datagouv-datasets" color="#3558a2"></bar-chart>
        </span>
  
    </div>
</template>

<script>
import Table from '@/components/Table'
import Error from '@/components/Error'
import Loader from '@/components/Loader'
import CardLink from '@/components/CardLink'
import BarChart from '@/components/BarChart'

export default {
  name: 'Dataviz',
  components: {Table, Error, Loader, CardLink, BarChart},
  data() {
    return {
      csvUrl: '',
      csvUrlFieldValue: '',
      axex: '',
      axey: '',
      op: '',
      listex: [],
      listey: [],
      generateChart: false
    }
  },
    computed: {
      valuex () {
        return this.$store.state.valuex
      },
      valuey () {
        return this.$store.state.valuey
      },
    hasError () {
      return this.$store.state.hasError
    },
    dgvInfos () {
      return this.$store.state.dgv_infos
    },
    rows () {
      return this.$store.state.rows
    },
    totalRows () {
      return this.$store.state.totalRows
    },
    fields () {
      return this.$store.getters.fields
    },
    filters () {
      return this.$store.state.filters
    },
    pageSize () {
      return this.$store.state.pageSize
    },
    generalInfos () {
      return this.$store.state.generalInfos
    },
    columnsInfos () {
      return this.$store.state.columnsInfos
    },
    colorsCat () {
      return this.$store.state.colorsCat
    },
    sortDesc () {
      return this.$store.state.sortDesc
    },
    sortBy () {
      return this.$store.state.sortBy
    },
    dataEndpoint () {
       return this.$store.state.dataEndpoint
    },
    page: {
      get() {
        return this.$store.state.page;
      },
      set (newValue) {
        this.$store.commit('setPage', newValue)
      }
    }
  },
  created() {
    const params = new URLSearchParams(document.location.search)
    // set filters from query string (before setting url and fetching data)
    this.setFiltersFromQueryString(params)
    const url = params.get('url')
    if (url) {
      this.csvUrl = url
    }
  },
  methods: {
    setFiltersFromQueryString (params) {
      [...params.entries()].filter(([k, v]) => {
        return k.indexOf('__') !== -1 && k.indexOf('_') !== 0
      }).forEach(([k, v]) => {
        this.$store.commit('addFilter', {
          field: k.split('__')[0],
          value: v,
          comp: k.split('__')[1],
        })
      })
    },
    setUrl(param, value){
      let filter = {
        field: param,
        value: value,
      }
      this.removeFromQueryString(param)
      this.$store.commit('deleteAllFiltersWithField', param)
      this.addToQueryString(filter.field, filter.value)
      this.$store.commit('addFilter', filter)
      this.checkPossibleGraph()
    },
    checkPossibleGraph(){
      if(this.getSearchParams().get('viz_axis_x') && this.getSearchParams().get('viz_op') && (this.getSearchParams().get('viz_op') === 'count' || this.getSearchParams().get('viz_axis_y'))){
        this.$store.dispatch('graphdata').finally(() => {})
      }
    },
    getSearchParams () {
      return new URLSearchParams(document.location.search)
    },
    removeFromQueryString (key) {
      const params = this.getSearchParams()
      params.delete(key)
      this.setSearchParams(params)
    },
    setSearchParams (params) {
      window.history.pushState(null, '', `/dataviz?${params.toString()}`)
    },
    addToQueryString (key, value) {
      const params = this.getSearchParams()
      params.set(key, value)
      this.setSearchParams(params)
    },
  },
  watch: {
    csvUrl (value) {
      if (!value) return
      this.$store.dispatch('apify', this.csvUrl).finally(() => {})
    },
    columnsInfos(){
      this.listex = Object.keys(this.columnsInfos).filter(key => (this.columnsInfos[key]['format'] === 'date' || this.columnsInfos[key]['categorical_infos']))
      this.listey = Object.keys(this.columnsInfos).filter(key => (['int', 'float'].includes(this.columnsInfos[key]['format'])))
    },
    valuex(){
      if (this.valuex && this.valuex.length != 0 && this.valuex.length === this.valuey.length) {
        this.generateChart = true
      } else {
        this.generateChart = false
      }
    }
  }
}
</script>

<style scoped>
.selectBox{
  padding: 5px;
  border: 1px solid black;
}
</style>
