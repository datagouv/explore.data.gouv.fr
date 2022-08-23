<template>
  <div @mouseenter="getInfos()" @mouseleave="hideBox" @keyup.esc="hideBox" class="fr-input-group">
    <label v-if="label" class="fr-label" :for="field.key">{{ label }}</label>
    <div class="fr-input-wrap fr-input-wrap--icon-left fr-icon-filter-line relative" :class="inputWrapClass">
      <input 
        @focus="getInfos()"
        @input="filterText($event)"
        type="search"
        class="fr-input"
        :class="inputClass"
        :value="inputValue"
        :id="field.key"
        placeholder="Filtrer"
      />
      <template v-if="columnInfos && activeFilterBox">
      <template v-if="columnInfos.type == 'Categorical'">
        <div v-if="categoricalInfos.length > 0" class="relTh">
          <h3 class="fr-mb-1w fr-text--sm fr-text--regular">Catégories :</h3>
          <div class="catFilter fr-my-1v" v-for="cat in categoricalInfos" :key="cat.value">
            <button @click="filterTextCat(cat.value)"
              :class="'fr-tag fr-tag--sm cat' + getColor(field.key, cat.value)">
              {{ cat.value + " (" + cat.count + ")" }}
            </button>
          </div>
        </div>
        <div v-else-if="topInfos.length > 0" class="relTh">
          <h3 class="fr-mb-1w fr-text--sm fr-text--regular">Valeurs les plus fréquentes :</h3>
          <div class="catFilter fr-mb-1w" v-for="top in topInfos" :key="top.value">
            <button class="fr-tag fr-tag--sm" @click="filterTextCat(top.value)">
              {{ top.value }} ({{ top.count }})
            </button>
          </div>
        </div>
      </template>
      <div v-if="columnInfos.type == 'Numeric' && numericPlotInfos.bin_edges && numericPlotInfos.bin_edges.length > 0" class="relTh">
        <h3 class="fr-mb-1w fr-text--sm fr-text--regular">Distribution :</h3>
        <histogram :datachart="numericPlotInfos.counts" :labels="numericPlotInfos.bin_edges" :title="field.label"></histogram>
      </div>
    </template>
    </div>
  </div>
</template>

<script>
import Histogram from '@/components/Histogram.vue'

export default {
  components: {Histogram},
  props: {
    field: {
      type: Object,
      required: true,
    },
    label: {
      type: String,
      required: false,
    }
  },
  data() {
    return {
      activeFilterBox: false,
      timer: null,
    }
  },
  computed: {
    categoricalInfos() {
      return this.columnInfos['categorical_infos'] ? this.columnInfos['categorical_infos'] : [];
    },
    columnInfos() {
      return this.columnsInfos[this.field.key] ? this.columnsInfos[this.field.key] : {}
    },
    columnsInfos () {
      return this.$store.state.columnsInfos
    },
    filter() {
      return this.filters.find(filter => filter.field === this.field.key)
    },
    filters() {
      return this.$store.state.filters
    },
    inputClass() {
      return { 'fr-input--filled': this.isFieldFiltered, 'fr-input--empty': !this.isFieldFiltered, ['inputTextFilter-' + this.field.key]: true }
    },
    inputValue() {
      return this.filter ? this.filter.value : ''
    },
    inputWrapClass() {
      return this.isFieldFiltered ? 'fr-input-wrap--filled' : 'fr-input-wrap--empty'
    },
    isFieldFiltered() {
      return !!this.filter
    },
    numericPlotInfos() {
      return this.columnInfos['numeric_plot_infos'] ? this.columnInfos['numeric_plot_infos'] : {}
    },
    topInfos() {
      return this.columnInfos['top_infos']? this.columnInfos['top_infos'] : []
    },
  },
  methods: {
    addToQueryString (key, value) {
      const params = this.getSearchParams()
      params.set(key, value)
      this.setSearchParams(params)
    },
    filterText(e) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        let filter = {
          field: this.field.key,
          value: e.target.value,
          comp: 'contains'
        }
        if (e.target.value != '') {
          this.$store.commit('deleteAllFiltersWithField', filter.field)
          this.$store.commit('addFilter', filter)
          this.addToQueryString(`${filter.field}__${filter.comp}`, filter.value)
          this.$store.dispatch('getData')
        } else {
          this.removeFromQueryString(`${filter.field}__${filter.comp}`)
          this.$store.commit('deleteAllFiltersWithField', filter.field)
          this.$store.dispatch('getData')
        }
      }, 650)
    },
    filterTextCat(value) {
      let filter = {
        field: this.field.key,
        value: value,
        comp: 'exact'
      }
      this.$store.commit('deleteAllFiltersWithField', filter.field)
      this.$store.commit('addFilter', filter)
      this.addToQueryString(`${filter.field}__${filter.comp}`, filter.value)
      this.activeFilterBox = false
      this.$store.dispatch('getData')
      let obj = document.getElementsByClassName('inputTextFilter-' + this.field.key)
      obj[0].value = value
    },
    getColor(key, value) {
      return this.$store.getters.color(key, value)
    },
    getInfos() {
      this.activeFilterBox = false
      const key = this.field.key
      if ((this.columnsInfos[key]) && (this.columnsInfos[key]['categorical_infos']) && (Array.isArray(this.columnsInfos[key]['categorical_infos']))) {
        this.activeFilterBox = true
      }
      else if ((this.columnsInfos[key]) && (this.columnsInfos[key]['top_infos'])) {
        this.activeFilterBox = true
      }
      if ((this.columnsInfos[key]) && (this.columnsInfos[key]['numeric_plot_infos'])) {
        this.activeFilterBox = true
      }
    },
    getSearchParams () {
      return new URLSearchParams(document.location.search)
    },
    hideBox() {
      this.activeFilterBox = false
    },
    removeFromQueryString (key) {
      const params = this.getSearchParams()
      params.delete(key)
      this.setSearchParams(params)
    },
    setSearchParams (params) {
      window.history.pushState(null, '', `/?${params.toString()}`)
    },
  }
}
</script>

<style>
.relTh {
  z-index: 5;
  position: absolute;
  top: 2.5rem;
  width: 250px;
  margin: 0;
  background-color: white;
  padding: 16px;
  font-weight: normal;
  font-size: 14px;
  border-bottom: 1px solid black;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.16), 0px 1px 0px -2px rgba(0, 0, 0, 0.16), 0px 1px 4px rgba(0, 0, 0, 0.23);
}

.topInfo {
  background-color: var(--background-contrast-grey);
  cursor: pointer;
}
</style>
