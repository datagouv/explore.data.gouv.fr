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
          <Input
            :columnsInfos="columnsInfos"
            :field="field"
            :getColor="getColor"
          />
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
            <span :class="getCellColor(field.key, row[field.key])">
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
import Input from './Input.vue'

export default {
  name: 'Table',
  components: { Filters, Histogram, Tooltip, Input },
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
    getInputFilterClass(field) {
      const filtered = !!this.getFilter(field)
      return { 'filter--filled': filtered }
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
    getColor(col, value) {
      let catnb = 0
      Object.keys(this.colorsCat).forEach((key) => {
        if(key == col) {
          this.colorsCat[key].forEach((val) =>{
            Object.keys(val).forEach((cat) => {
              if(cat == value){
                catnb = val[cat]
              }
            }); 
          });
        }
      });
      return catnb
    },
    getCellColor(col, value) {
      const color = this.getColor(col, value)
      let classes = 'cat'+ color
      if(color > 0) {
        classes += " fr-badge"
      }
      return classes
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

.titleColumn:hover {
  cursor: pointer;
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
</style>
