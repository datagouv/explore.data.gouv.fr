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
              <button
                class="fr-col-auto fr-mr-2w"
                :class="{'text-label-blue-cumulus': field.key === sortBy}"
                data-fr-opened="false"
                :aria-controls="'fr-modal-' + field.key"
              >
                <span class="fr-icon-info-line" aria-hidden="true"></span>
              </button>
              <div class="fr-col" :class="{'text-label-blue-cumulus': field.key === sortBy}">
                {{ field.label }}
              </div>
              <div 
                class="fr-col-auto fr-ml-2w"
                v-if="field.key === sortBy"
              >
                <span 
                  class="fr-icon-arrow-down-line text-label-blue-cumulus"
                  :class="{'fr-icon-arrow-down-line': sortDesc, 'fr-icon-arrow-up-line': !sortDesc }"
                  aria-hidden="true"
                ></span>
              </div>
            </div>
            <FieldModal :id="'fr-modal-' + field.key" :field="field" />
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
            <Input :field="field" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in rows" 
          :key="row[0]"
        >
          <td 
            @mouseleave="hideTooltips"
            @mouseover="loadTooltip(field.key, index)"
            @click="loadTooltip(field.key, index)"
            v-for="field in fields"
            :key="'row-' + index + '-' + field.key"
          >
            <div class="cell">
              <span :class="getCellColor(field.key, row[field.key])">{{ row[field.key] }}</span>
            </div>
            <template v-if="columnsInfos[field.key] && isTooltipActive(field.key, index)">
              <Tooltip
                v-if="columnsInfos[field.key]['format'] === 'siren'"
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
                v-else-if="columnsInfos[field.key]['format'] === 'code_region'"
                explanation="Il semblerait que ce champ soit un code de région"
                :content="'Région : ' + messageBox"
                />
              <Tooltip
                v-else-if="columnsInfos[field.key]['format'] === 'code_commune_insee'"
                explanation="Il semblerait que ce champ soit un code commune"
                :content="'Commune : ' + messageBox"
                />
            </template>
          </td>
        </tr> 
      </tbody>
      <button v-if="rows.length != 0" class="fr-tag fr-tag--sm" @click="userChangePage()">Charger plus de données</button>
      <tfoot class="fr-p-2w">
        <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
          <div class="fr-col-auto">
            <div class="fr-grid-row fr-grid-row--gutters">
              <p class="fr-col-auto"><strong>Nb. Colonnes</strong> : {{fields.length}}</p>
              <p class="fr-col-auto"><strong>Nb. Lignes</strong> : {{totalRows}}</p>
            </div>
          </div>
          <div class="fr-col-auto" v-if="dgvInfos.resource">
            <a
              download 
              :href="dgvInfos.resource.latest"
              class="fr-btn fr-btn--sm fr-btn--secondary fr-btn--icon-left fr-icon-download-line"
            >
              Télécharger les données
            </a>
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
import FieldModal from './FieldModal.vue'

export default {
  name: 'Table',
  components: { Filters, Histogram, Tooltip, Input, FieldModal },
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
      activeTooltips: {},
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
    isTooltipActive(field, index) {
      return this.activeTooltips[index] ? this.activeTooltips[index][field] : false
    },
    loadTooltip(field, index) {
      const val =  this.rows[index][field]
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
        }
        this.hideTooltips()
        if(!this.activeTooltips[index]) {
          this.$set(this.activeTooltips, index, {})
        }
        this.$set(this.activeTooltips[index], field, true)
        this.$set(this.activeTooltips, index, this.activeTooltips[index])
      }
    },  
    hideTooltips() {
      for(let index in this.activeTooltips) {
        for(let key in this.activeTooltips[index]) {
          this.$set(this.activeTooltips[index], key, false)
          this.$set(this.activeTooltips, index, this.activeTooltips[index])
        }
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
    getCellColor(col, value) {
      const color = this.$store.getters.color(col, value)
      let classes = 'cat'+ color
      if(color > 0) {
        classes += " fr-badge"
      }
      return classes
    },
    gotoAE(siren){
      return 'https://annuaire-entreprises.data.gouv.fr/entreprise/'+siren;
    },
    handleScroll () {
      let bottomOfWindow = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) + window.innerHeight + 1 >= document.documentElement.offsetHeight
      if (bottomOfWindow) {
        this.page = this.page + 1
        this.changePage()
      }
    },
    userChangePage(){
      this.page = this.page + 1
      this.changePage()
    }
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
html {
    height: 100%;
}

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
  --hover-tint: var(--grey-425-625);
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

.cell {
  max-height: 7.5rem;
  overflow: auto;
  overflow-x: hidden;
} 



</style>
