<template>
  <div class="fr-table">
    <table ref="table">
      <thead>
        <tr>
          <th 
            scope="col"
            class="header"
            :class="{'header--sorted': field.key === sortBy }"
            @click="sortbyfield(field.key)" 
            v-for="field in fields" 
            :key="'header-'+field.key"
          >
            <div 
                class="fr-grid-row fr-grid-row--middle no-wrap" 
                @mouseover="hoverArrow = true" 
                @mouseleave="hoverArrow = false"
              >
                <div class="fr-col-auto fr-mr-2w" :style="field.key === sortBy ? { 'color': '#2559C1'} : ''">
                  <span class="fr-icon-info-line" aria-hidden="true"></span>
                </div>    
                <div class="fr-col" :style="field.key === sortBy ? { 'color': '#2559C1'} : ''">
                  {{ field.label }}
                </div>
                <div 
                  class="fr-col-auto fr-ml-2w"
                  v-if="field.key === sortBy"
                >
                  <span 
                    v-if="sortDesc == true"
                    style="color: #2559C1;"
                    class="fr-icon-arrow-down-line"
                    aria-hidden="true"
                  ></span>
                  <span 
                    v-else
                    style="color: #2559C1;"
                    class="fr-icon-arrow-up-line"
                    aria-hidden="true"
                  ></span>
                </div>
              </div>
          </th>
        </tr>
        <tr>
          <th 
            scope="col"
            v-for="field in fields"
            :key="'filter-'+field.key"
            class="filter"
            :class="getInputFilterClass(field.key)"
          >
          <div class="fr-input-wrap fr-input-wrap--icon-left fr-icon-filter-line" :class="getInputWrapClass(field.key)">
              <input
                @focus="getInfos(field.key)"
                @keyup="filterText($event, field.key)"
                type="text"
                class="fr-input"
                :class="getInputClass(field.key)"
                :value="getInputValue(field.key)"
                placeholder="Filtrer"
              />
            </div>
            <template v-if="columnsInfos.hasOwnProperty(field.key) && activeFilterBox && activeFilterField == field.key">
              <template v-if="columnsInfos[field.key]['type'] == 'Categorical'">
                <div 
                  v-if="categoricalInfos.length > 0"
                  class="relTh"
                >
                  Catégories : 
                  <br />
                  <br />
                  <div 
                    class="catFilter"
                    v-for="cat in categoricalInfos"
                    :key="cat.value"
                  >
                    <span 
                      @click="filterTextCat(cat.value, field.key)"
                      :class="'buttonCat cat' + getColor(field.key, cat.value)"
                    >
                      {{ cat.value+" ("+cat.count+")" }}
                    </span>
                  </div>
                </div >
                <div
                  v-if="topInfos.length > 0"
                  class="relTh"
                >
                  Valeurs les plus fréquentes : 
                  <br />
                  <br />
                  <div 
                    class="catFilter"
                    v-for="top in topInfos"
                    :key="top.value"
                  >
                    <span
                      class="topInfo"
                      @click="filterTextCat(top.value, field.key)"
                    >
                      {{ top.value }} ({{ top.count }})
                    </span>
                  </div>
                </div >
              </template>
              <div 
                v-if="columnsInfos[field.key]['type'] == 'Numeric' && numericPlotInfosBins.length > 0" class="relTh"
              >
                Distribution : 
                <br />
                <br />
                <histogram 
                  :datachart="numericPlotInfosCounts"
                  :labels="numericPlotInfosBins"
                  :title="field.label"
                ></histogram>
              </div >
            </template>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in rows" 
          :key="row[0]"
        >
          <td 
            @mouseleave="manageCellOut"
            @mouseover="manageCell($event, field.key, row[field.key])"
            @click="manageCell($event, field.key, row[field.key])"
            v-for="field in fields"
            :key="'row-'+field.key+'-'+row[field.key]"
          >
            <span :class="'cat'+getColor(field.key, row[field.key])">
              {{ row[field.key] }}
            </span>
            <template v-if="columnsInfos.hasOwnProperty(field.key)">
              <Tooltip
                v-if="columnsInfos[field.key]['format'] == 'siren'"
                explanation="Il semblerait que ce champ soit un numéro d'entreprise (numéro Siren)"
                :content="'Entreprise : ' + messageBox"
                link="En savoir plus sur cette entreprise"
                :linkHref="gotoAE(row[field.key])"
                />
              <Tooltip
                v-else-if="columnsInfos[field.key]['format'] == 'code_departement'"
                explanation="Il semblerait que ce champ soit un code de département"
                :content="'Département : ' + messageBox"
                />
              <Tooltip
                v-else-if="columnsInfos[field.key]['format'] == 'code_region'"
                explanation="Il semblerait que ce champ soit un code de région"
                :content="'Région : ' + messageBox"
                />
              <Tooltip
                v-else-if="columnsInfos[field.key]['format'] == 'code_commune_insee'"
                explanation="Il semblerait que ce champ soit un code commune"
                :content="'Commune : ' + messageBox"
                />
            </template>
          </td>
        </tr> 
      </tbody>
      <tfoot class="fr-p-2w">
        <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
          <div class="fr-col-auto">
            <div class="fr-grid-row fr-grid-row--gutters">
              <p class="fr-col-auto"><strong>Nb. Colonnes</strong> : {{fields.length}}</p>
              <p class="fr-col-auto"><strong>Nb. Lignes</strong> : {{totalRows}}</p>
            </div>
          </div>
          <div class="fr-col-auto">
            <button class="fr-btn fr-btn--sm fr-btn--secondary fr-btn--icon-left fr-icon-download-line">
              Télécharger les données
            </button>
          </div>
        </div>
      </tfoot>
    </table>
  </div>
</template>

<script>
import {filtersEnabled} from '@/config'
import Filters from '@/components/Filters'
import Histogram from '@/components/Histogram.vue'
import Tooltip from '@/components/Tooltip.vue'

export default {
  name: 'Table',
  components: { Filters, Histogram, Tooltip },
  data () {
    return {
      filtersEnabled,
      hoverArrow: false,
      timer: undefined,
      filterTextSearch: undefined,
      filter: {
        field: '',
        value: '',
        comp: ''
      },
      categoricalInfos: [],
      topInfos: [],
      numericPlotInfosBins: [],
      numericPlotInfosCounts: [],
      activeFilterField: undefined,
      activeFilterBox: false,
      colorsCat: {},
      messageBox: '',
      additionalInformations: {
        siren: {},
        code_departement: {},
        code_region: {},
        code_commune_insee: {}
      },
    }
  },
  computed: {
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
    sortDesc () {
      return this.$store.state.sortDesc
    },
    sortBy () {
      return this.$store.state.sortBy
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
  methods: {
    getLocalOrFetch(format, value, url) {
      if(!this.additionalInformations[format][value]) {
        this.additionalInformations[format][value] = fetch(url)
          .then((response) => {
            return response.json()
          })
      }
      return this.additionalInformations[format][value]
    },
    getFilter(field) {
      return this.filters.find(filter => filter.field === field)
    },
    getInputClass(field) {
      const filtered = this.isFieldFiltered(field)
      return { 'fr-input--filled': filtered, 'fr-input--empty': !filtered, ['inputTextFilter-' + field]: true }
    },
    getInputWrapClass(field) {
      return this.isFieldFiltered(field) ? 'fr-input-wrap--filled' : 'fr-input-wrap--empty'
    },
    getInputFilterClass(field) {
      const filtered = this.isFieldFiltered(field)
      return { 'filter--filled': filtered }
    },
    getInputValue(field) {
      const filter = this.getFilter(field)
      return filter ? filter.value : ''
    },
    isFieldFiltered(field) {
      return this.getFilter(field)
    },
    manageCell(e, field, val) {
      this.activeFilterBox = false;
      if(this.columnsInfos.hasOwnProperty(field)) {
        if(this.columnsInfos[field]['format'] == 'siren') {
          this.getLocalOrFetch(
            this.columnsInfos[field]['format'], 
            val,
            'https://recherche-entreprises.api.gouv.fr/search?q=' + val + '&page=1&per_page=1'
          )
          .then((data) => {
            this.messageBox = data['results'][0]['nom_complet']
          })
          .catch((err) => {
            // Do something for an error here
          })
          if(e.currentTarget.getElementsByClassName('relSiren')[0]){
            e.currentTarget.getElementsByClassName('relSiren')[0].style.display = 'block'
          }
        }
        if(this.columnsInfos[field]['format'] == 'code_departement') {
          this.getLocalOrFetch(
            this.columnsInfos[field]['format'], 
            val,
            'https://geo.api.gouv.fr/departements/' + val
          )
          .then((data) => {
            this.messageBox = data['nom']
          })
          .catch((err) => {
            // Do something for an error here
          })
          if(e.currentTarget.getElementsByClassName('relDpt')[0]){
            e.currentTarget.getElementsByClassName('relDpt')[0].style.display = 'block'
          }
        }
        if(this.columnsInfos[field]['format'] == 'code_region') {
          this.getLocalOrFetch(
            this.columnsInfos[field]['format'], 
            val,
            'https://geo.api.gouv.fr/regions/' + val
          )
          .then((data) => {
            this.messageBox = data['nom']
          })
          .catch((err) => {
            // Do something for an error here
          })
          if(e.currentTarget.getElementsByClassName('relReg')[0]){
            e.currentTarget.getElementsByClassName('relReg')[0].style.display = 'block'
          }
        }
        if(this.columnsInfos[field]['format'] == 'code_commune_insee') {
          this.getLocalOrFetch(
            this.columnsInfos[field]['format'], 
            val,
            'https://geo.api.gouv.fr/communes/' + val
          )
          .then((data) => {
            this.messageBox = data['nom']
          })
          .catch((err) => {
            // Do something for an error here
          })
          if(e.currentTarget.getElementsByClassName('relCom')[0]){
            e.currentTarget.getElementsByClassName('relCom')[0].style.display = 'block'
          }
        }
      }
    },  
    manageCellOut(e){
      if(e.currentTarget.getElementsByClassName('relSiren')[0]){
        e.currentTarget.getElementsByClassName('relSiren')[0].style.display = 'none'
      }
      if(e.currentTarget.getElementsByClassName('relDpt')[0]){
        e.currentTarget.getElementsByClassName('relDpt')[0].style.display = 'none'
      }
      if(e.currentTarget.getElementsByClassName('relReg')[0]){
        e.currentTarget.getElementsByClassName('relReg')[0].style.display = 'none'
      }
      if(e.currentTarget.getElementsByClassName('relCom')[0]){
        e.currentTarget.getElementsByClassName('relCom')[0].style.display = 'none'
      }
    },
    sortbyfield (field) {
      let obj = {}
      if (field == this.sortBy) {
        obj.sortBy = field
        if (this.sortDesc == true) {
          obj.sortDesc = false
        } else {
          obj.sortDesc = true
        }
      } else { 
        obj.sortBy = field
        obj.sortDesc = false
      }
      return this.$store.dispatch('sort', obj)
    },
    changePage () {
      return this.$store.dispatch('changePage')
    },
    filterText(e, field) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.filter = {
          field: field,
          value: e.target.value,
          comp: 'contains'
        }
        if(e.target.value != '') {
          this.$store.commit('deleteAllFiltersWithField', this.filter.field)
          this.$store.commit('addFilter', this.filter)
          this.addToQueryString(`${this.filter.field}__${this.filter.comp}`, this.filter.value)
          this.filter = {field: '', value: '', comp: ''}
          this.$store.dispatch('getData')
        } else {
          this.removeFromQueryString(`${this.filter.field}__${this.filter.comp}`)
          this.$store.commit('deleteAllFiltersWithField', this.filter.field)
          this.$store.dispatch('getData')
        }
      }, 1000)
    },
    filterTextCat(value, field) {
      this.filter = {
        field: field,
        value: value,
        comp: 'exact'
      }
      this.$store.commit('deleteAllFiltersWithField', this.filter.field)
      this.$store.commit('addFilter', this.filter)
      this.addToQueryString(`${this.filter.field}__${this.filter.comp}`, this.filter.value)
      this.filter = {field: '', value: '', comp: ''}
      this.activeFilterBox = false
      this.$store.dispatch('getData')
      let obj = document.getElementsByClassName('inputTextFilter-'+field)
      obj[0].value = value
    },
    getSearchParams () {
      return new URLSearchParams(document.location.search)
    },
    setSearchParams (params) {
      window.history.pushState(null, '', `/?${params.toString()}`)
    },
    addToQueryString (key, value) {
      const params = this.getSearchParams()
      params.set(key, value)
      this.setSearchParams(params)
    },
    removeFromQueryString (key) {
      const params = this.getSearchParams()
      params.delete(key)
      this.setSearchParams(params)
    },
    getInfos(field){
      this.activeFilterBox = false
      if ((this.columnsInfos[field]) && (this.columnsInfos[field]['categorical_infos']) && (Array.isArray(this.columnsInfos[field]['categorical_infos']))) {
        this.getCategoricalInfos(field)
      }
      else if ((this.columnsInfos[field]) &&  (this.columnsInfos[field]['top_infos'])) {
        this.getTopInfos(field)
      }
      if((this.columnsInfos[field]) && (this.columnsInfos[field]['numeric_plot_infos'])) {
        this.getNumericPlotInfos(field)
      }
    },
    getCategoricalInfos(field) {
      this.activeFilterBox = true
      if(this.columnsInfos[field]['categorical_infos']) {
        this.activeFilterField = field
        this.categoricalInfos = this.columnsInfos[field]['categorical_infos']
      } else {
        this.activeFilterField = undefined
      }
    },
    getTopInfos(field) {
      this.activeFilterBox = true
      if(this.columnsInfos[field]['top_infos']) {
        this.activeFilterField = field
        this.topInfos = this.columnsInfos[field]['top_infos']
      } else {
        this.activeFilterField = undefined
      }
    },
    getNumericPlotInfos(field) {
      this.activeFilterBox = true
      if(this.columnsInfos[field]['numeric_plot_infos']) {
        this.activeFilterField = field
        this.numericPlotInfosBins = this.columnsInfos[field]['numeric_plot_infos']['bin_edges']
        this.numericPlotInfosCounts = this.columnsInfos[field]['numeric_plot_infos']['counts']
      } else {
        this.activeFilterField = undefined
      }
    },
    manageColumnInfos() {
      let rowsColors = this.rows
      Object.keys(this.columnsInfos).forEach((key) => {
          if(this.columnsInfos[key]['categorical_infos']){
            this.colorsCat[key] = []
            let cpt = 0
            if (Array.isArray(this.columnsInfos[key]['categorical_infos'])){
              this.columnsInfos[key]['categorical_infos'].forEach((item) => {
                if(item.value){
                  cpt = cpt + 1  
                  let obj = {}
                  obj[item.value] = cpt
                  this.colorsCat[key].push(obj)
                }
              });
            }
          }
      });
    },
    getColor(col, value){
      let catnb = 0
      Object.keys(this.colorsCat).forEach((key) => {
        if(key == col){
          this.colorsCat[key].forEach((val) =>{
            Object.keys(val).forEach((cat) => {
              if(cat == value){
                catnb = val[cat]
              }
            }); 
          });
        }
      });
      return catnb.toString()
    },
    gotoAE(siren){
      return 'https://annuaire-entreprises.data.gouv.fr/entreprise/'+siren;
    },
    handleScroll (event) {
      let bottomOfWindow = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) + window.innerHeight + 1 >= document.documentElement.offsetHeight
      if (bottomOfWindow) {
        this.page = this.page + 1
        this.changePage()
      }
    },
  },
  watch: {
    columnsInfos: function () {
      this.manageColumnInfos()
    },
  },
  created () {
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll);
  }
}
</script>

<style scoped>
.fr-table, .fr-table table {
  height: 100%;
}

thead {
  background-color: white;
  background-image: none;
}

tfoot {
  position: fixed;
  bottom: 0;
  background-color: var(--background-flat-grey);
  color: var(--text-inverted-grey);
  width: 100%;
}

tfoot .fr-btn--secondary {
  --border-action-high-blue-france: var(--text-inverted-grey);
  --border-active-blue-france: var(--text-inverted-grey);
  --text-action-high-blue-france: var(--text-inverted-greys);
}

tfoot .fr-grid-row {
  justify-content: space-between;
}

th {
  vertical-align: middle;
}

th, td {
  position: relative;
}

.buttonCat:hover {
  cursor: pointer;
}

.catFilter {
  padding-bottom: 10px;
  font-size: 14px;
}

.topInfo {
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 4px;
  padding-bottom: 4px;
  border-radius: 8px;
  background-color: #ebebeb;
  cursor: pointer;
}

.cat1, .cat2, .cat3, .cat4, .cat5, .cat6, .cat7, .cat8, .cat9, .cat10 {
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 4px;
  padding-bottom: 4px;
  border-radius: 8px;
}

.cat1 {
  background-color: #fddede;
}

.cat2 {
  background-color: #b8fec9;
}
.cat3 {
  background-color: #fceeac;
}
.cat4 {
  background-color: #bafaee;
}
.cat5 {
  background-color: #fee7fc;
}
.cat6 {
  background-color: #fee9e6;
}
.cat7 {
  background-color: #feecc2;
}
.cat8 {
  background-color: #bfccfb;
}
.cat9 {
  background-color: #60e0eb;
}
.cat10 {
  background-color: #ffbeb4;
}

.titleColumn:hover {
  cursor: pointer;
}

.rowClass {
  height: 50px;
}
.fr-table tbody tr:hover {
  background-color: var(--background-alt-blue-cumulus-hover);
}

.fr-table tbody td:hover {
  background-color: var(--background-contrast-blue-cumulus-hover);
}

.header, .filter {
  border-bottom: 2px solid var(--border-plain-grey);
}

.header--sorted, .filter--filled  {
  border-color: var(--border-plain-blue-cumulus);
}

.filter {
  border-width: 1px;
}

.relTh {
  z-index: 5;
  position: absolute;
  top: 64px;
  width: 250px;
  margin: 0;
  background-color: #f5f5fe;
  padding: 20px;
  font-weight: normal;
  font-size: 14px;
  border: 1px solid #cfcccc;
}
</style>
