<template>
  <div class="fr-table" >
    <table ref="table" @scroll="handleScroll($event)">
      <thead :style="{ left: '-' + scrollTab + 'px' }">
        <tr>
          <th 
            scope="col"
            class="header sticky-bar"
            :class="{'header--sorted': field.key === sortBy }"
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
                <span v-if="columnsInfos && columnsInfos[field.key]" class="fr-icon-info-line" aria-hidden="true"></span>
              </button>
              <div @click="sortbyfield(field.key)" class="fr-col style-header-col" :class="{'text-label-blue-cumulus': field.key === sortBy}">
                {{ field.label }}
              </div>
              <div 
                class="fr-col-auto fr-ml-2w style-header-col"
                v-if="field.key === sortBy"
                @click="sortbyfield(field.key)"
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
      <tbody id="body">
        <tr
          v-for="(row, index) in rows" 
          :key="row[0]"
        >
          <td 
            @mouseleave="hideTooltips"
            @mouseenter="loadTooltip(field.key, index)"
            @click="loadTooltip(field.key, index)"
            v-for="field in fields"
            :key="'row-' + index + '-' + field.key"
          >
            <div class="cell">
              <span 
                v-if="columnsInfos && columnsInfos[field.key] && columnsInfos[field.key]['format'] === 'url'"
                :class="getCellColor(field.key, row[field.key])"
              >
                <a :href="row[field.key]">{{ row[field.key] }}</a>
              </span>
              <span 
                v-else
                :class="getCellColor(field.key, row[field.key])"
              >
                {{ row[field.key] }}
              </span>
            </div>
            <template v-if="columnsInfos[field.key] && isTooltipActive(field.key, index) && displayTooltip && messageBox != ''">
              <Tooltip
                v-if="columnsInfos[field.key]['format'] === 'siren'"
                explanation="Il semblerait que ce champ soit un numéro d'entreprise (numéro Siren)"
                :content="'Entreprise : ' + messageBox"
                link="En savoir plus sur cette entreprise"
                :linkHref="gotoAE('siren', row[field.key])"
                />
              <Tooltip
                v-if="columnsInfos[field.key]['format'] === 'siret'"
                explanation="Il semblerait que ce champ soit un numéro d'entreprise (numéro Siret)"
                :content="'Entreprise : ' + messageBox"
                link="En savoir plus sur cette entreprise"
                :linkHref="gotoAE('siret', row[field.key])"
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
                v-else-if="columnsInfos[field.key]['format'] == 'departement'"
                explanation="Il semblerait que ce champ soit un nom de département"
                :content="'Code Département : ' + messageBox"
                />
              <Tooltip
                v-else-if="columnsInfos[field.key]['format'] === 'region'"
                explanation="Il semblerait que ce champ soit un nom de région"
                :content="'Code Région : ' + messageBox"
                />
              <Tooltip
                v-else-if="columnsInfos[field.key]['format'] === 'code_commune_insee'"
                explanation="Il semblerait que ce champ soit un code commune"
                :content="'Commune : ' + messageBox"
                />
              <Tooltip
                v-else-if="columnsInfos[field.key]['format'] === 'code_postal'"
                explanation="Il semblerait que ce champ soit un code postal"
                :content="'Commune possibles : ' + messageBox"
                />
              <Tooltip
                v-else-if="columnsInfos[field.key]['format'] === 'commune'"
                explanation="Il semblerait que ce champ soit une commune"
                :content="'Code commune : ' + messageBox"
                />
              <Tooltip
                v-else-if="columnsInfos[field.key]['format'] === 'email'"
                explanation="Il semblerait que ce champ soit un email"
                link="Ecrire un mail"
                content=""
                :linkHref="'mailto:' + row[field.key]"
                />
              <Tooltip
                v-else-if="(columnsInfos[field.key]['format'] === 'longitude_wgs') || (columnsInfos[field.key]['format'] === 'longitude_wgs_fr_metropole')"
                explanation="Il semblerait que ce champ soit une coordonnée de longitude. Nous avons également trouvé une coordonnée de latitude dans le fichier."
                link="Voir sur une carte"
                :content="'La localisation semble être à ' + messageBox"
                :linkHref="banurl"
                />
              <Tooltip
                v-else-if="(columnsInfos[field.key]['format'] === 'latitude_wgs') || (columnsInfos[field.key]['format'] === 'latitude_wgs_fr_metropole')"
                explanation="Il semblerait que ce champ soit une coordonnée de latitude. Nous avons également trouvé une coordonnée de longitude dans le fichier."
                link="Voir sur une carte"
                :content="'La localisation semble être à ' + messageBox"
                :linkHref="banurl"
                />
              <Tooltip
                v-else-if="columnsInfos[field.key]['format'] === 'latlon_wgs'"
                explanation="Il semblerait que ce champ contienne des coodonnées géographiques."
                link="Voir sur une carte"
                :content="'La localisation semble être à ' + messageBox"
                :linkHref="banurl"
                />
              <Tooltip
                v-else-if="columnsInfos[field.key]['format'] === 'adresse'"
                explanation="Il semblerait que ce champ soit une adresse."
                link="Voir sur une carte"
                :content="'Adresse consolidée : ' + messageBox"
                :linkHref="banurl"
                />
            </template>
          </td>
        </tr> 
      </tbody>
      <button v-if="rows.length >= 10" class="fr-tag fr-tag--sm" @click="userChangePage()">Charger plus de données</button>
      <div v-if="rows.length === 0 && filters.left > 0"><br /><p>Basé sur les filtres appliqués, l'explorateur ne trouve aucun résultat dans le fichier.</p></div>
      <div v-if="rows.length < 10" class="messageNoResults"></div>
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
              v-if="filters.length > 0"
              download 
              :href="exportData()"
              class="fr-btn fr-btn--sm fr-btn--secondary fr-btn--icon-left fr-icon-download-line"
            >
              Télécharger les données filtrées
            </a>
            &nbsp;&nbsp;
            <a
              download 
              :href="dgvInfos.resource.latest"
              class="fr-btn fr-btn--sm fr-btn--secondary fr-btn--icon-left fr-icon-download-line"
            >
              Télécharger le fichier complet
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
import {csvapiUrl} from '@/config'

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
      displayTooltip: true,
      banurl: '',
      additionalInformations: {
        siren: {},
        siret: {},
        code_departement: {},
        code_region: {},
        code_commune_insee: {},
        code_postal: {},
        commune: {},
        email: {},
        latlonseparate: {},
        adresse: {},
        departement: {},
        region: {},
        url: {}
      },
      scrollTab:0,
      lastBiggerScroll:0
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
      this.messageBox = ''
      this.displayTooltip = false
      const val =  this.rows[index][field]
      if(this.columnsInfos.hasOwnProperty(field)) {
        if(this.columnsInfos[field]['format'] == 'siren' && val != null) {
          this.getLocalOrFetch(
            this.columnsInfos[field]['format'], 
            val,
            'https://recherche-entreprises.api.gouv.fr/search?q=' + val + '&page=1&per_page=1'
          )
          .then((data) => {
            this.messageBox = data['results'][0]['nom_complet']
            this.displayTooltip = true
          })
          .catch((err) => {
            // Do something for an error here
          })
        }
        if(this.columnsInfos[field]['format'] == 'siret' && val != null) {
          this.getLocalOrFetch(
            this.columnsInfos[field]['format'], 
            val.replace(' ', ''),
            'https://recherche-entreprises.api.gouv.fr/search?q=' + val.replace(' ', '') + '&page=1&per_page=1'
          )
          .then((data) => {
            this.messageBox = data['results'][0]['nom_complet']
            this.displayTooltip = true
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
            this.displayTooltip = true
          })
          .catch((err) => {
            // Do something for an error here
          })
        }
        if(this.columnsInfos[field]['format'] == 'departement') {
          this.getLocalOrFetch(
            this.columnsInfos[field]['format'], 
            val,
            'https://geo.api.gouv.fr/departements?nom=' + val
          )
          .then((data) => {
            if (data[0]['_score'] > 0.75) {
              this.messageBox = data[0]['code']
              this.displayTooltip = true
            }
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
            this.displayTooltip = true
          })
          .catch((err) => {
            // Do something for an error here
          })
        }
        if(this.columnsInfos[field]['format'] == 'region') {
          this.getLocalOrFetch(
            this.columnsInfos[field]['format'], 
            val,
            'https://geo.api.gouv.fr/regions?nom=' + val
          )
          .then((data) => {
            if (data[0]['_score'] > 0.75) {
              this.messageBox = data[0]['code']
              this.displayTooltip = true
            }
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
            this.displayTooltip = true
          })
          .catch((err) => {
            // Do something for an error here
          })
        }
        if(this.columnsInfos[field]['format'] == 'code_postal') {
          this.getLocalOrFetch(
            this.columnsInfos[field]['format'], 
            val,
            'https://geo.api.gouv.fr/communes?codePostal=' + val
          )
          .then((data) => {
            let msg = ''
            data.slice(0,5).forEach((d) => {
              msg = msg + d['nom'] + ', '
            })
            msg = msg.slice(0, -2)
            if(data.length > 5){
              msg = msg + '...'
            }
            this.messageBox = msg

            this.displayTooltip = true
          })
          .catch((err) => {
            // Do something for an error here
          })
        }
        if(this.columnsInfos[field]['format'] == 'commune') {
          this.getLocalOrFetch(
            this.columnsInfos[field]['format'], 
            val,
            'https://geo.api.gouv.fr/communes?nom=' + val
          )
          .then((data) => {
            if (data[0]['_score'] > 0.75) {
              this.messageBox = data[0]['code']
              this.displayTooltip = true
            }
          })
          .catch((err) => {
            // Do something for an error here
          })
        }
        if(this.columnsInfos[field]['format'] == 'email') {
          this.messageBox = '<href="mailto:' + val + '"></a>'
          this.displayTooltip = true
        }
        if((this.columnsInfos[field]['format'] == 'longitude_wgs') || (this.columnsInfos[field]['format'] == 'longitude_wgs_fr_metropole')) {
          for (let c in this.columnsInfos) {
            if((this.columnsInfos[c]['format'] == 'latitude_wgs') || (this.columnsInfos[c]['format'] == 'latitude_wgs_fr_metropole')){
              this.getLocalOrFetch(
                'latlonseparate', 
                this.rows[index][c] + ',' + val,
                'https://geo.api.gouv.fr/communes?lon=' + val + '&lat=' + this.rows[index][c]
              )
              .then((data) => {
                this.messageBox = data[0]['nom'] + ' (' + data[0]['code'] + ')'
                this.banurl = 'https://adresse.data.gouv.fr/base-adresse-nationale#15/' + this.rows[index][c] + '/' + val
                this.displayTooltip = true
              })
              .catch((err) => {
                // Do something for an error here
              })
            }
          }
        }
        if((this.columnsInfos[field]['format'] == 'latitude_wgs') || (this.columnsInfos[field]['format'] == 'latitude_wgs_fr_metropole')) {
          for (let c in this.columnsInfos) {
            if((this.columnsInfos[c]['format'] == 'longitude_wgs') || (this.columnsInfos[c]['format'] == 'longitude_wgs_fr_metropole')){
              this.getLocalOrFetch(
                'latlonseparate', 
                val + ',' + this.rows[index][c],
                'https://geo.api.gouv.fr/communes?lon=' + this.rows[index][c] + '&lat=' + val
              )
              .then((data) => {
                this.messageBox = data[0]['nom'] + ' (' + data[0]['code'] + ')'
                this.banurl = 'https://adresse.data.gouv.fr/base-adresse-nationale#15/' + val + '/' + this.rows[index][c]
                this.displayTooltip = true
              })
              .catch((err) => {
                // Do something for an error here
              })
            }
          }
        }
        if (this.columnsInfos[field]['format'] == 'latlon_wgs') {
          if (val && val.split(',').length === 2) {
            let lon = val.split(',')[0].replace('[','').replace(']','')
            let lat = val.split(',')[1].replace('[','').replace(']','')
            this.getLocalOrFetch(
              'latlonseparate', 
              lat + ',' + lon,
              'https://geo.api.gouv.fr/communes?lon=' + lon + '&lat=' + lat
            )
            .then((data) => {
              this.messageBox = data[0]['nom'] + ' (' + data[0]['code'] + ')'
              this.banurl = 'https://adresse.data.gouv.fr/base-adresse-nationale#15/' + lat + '/' + lon
              this.displayTooltip = true
            })
            .catch((err) => {
              // Do something for an error here
            })
          }
        }
        if(this.columnsInfos[field]['format'] == 'adresse') {
          let cci = ''
          for (let c in this.columnsInfos) {
            if(this.columnsInfos[c]['format'] == 'code_commune_insee'){              
              cci = '&citycode=' + this.rows[index][c]
            }
          }
          let adr = val + cci
          cci = ''
          for (let c in this.columnsInfos) {
            if(this.columnsInfos[c]['format'] == 'code_postal'){              
              cci = '&code_postal=' + this.rows[index][c]
            }
          }
          adr = adr + cci
          this.getLocalOrFetch(
            'adresse', 
            adr,
            'https://api-adresse.data.gouv.fr/search/?q=' + adr
          )
          .then((data) => {
            this.messageBox = data['features'][0]['properties']['label']
            this.banurl = 'https://adresse.data.gouv.fr/base-adresse-nationale/' + data['features'][0]['properties']['id']
            this.displayTooltip = true
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
    gotoAE(type, id){
      if (type == 'siren') {
        return 'https://annuaire-entreprises.data.gouv.fr/entreprise/' + id;
      }
      else if (type == 'siret') {
        return 'https://annuaire-entreprises.data.gouv.fr/etablissement/' + id;
      }
    },
    handleScroll (event) {

      var tableTop = event.target.getBoundingClientRect().top + 100

      console.log(tableTop)

      console.log("scroll",event.target.scrollTop+tableTop)
      console.log("height",event.target.offsetHeight)
      console.log("lastScroll",this.lastBiggerScroll)
      
      if(event.target.scrollTop+tableTop>event.target.offsetHeight&&event.target.scrollTop+tableTop>this.lastBiggerScroll){
        this.lastBiggerScroll = event.target.scrollTop+tableTop+event.target.offsetHeight
        this.page = this.page + 1
        this.changePage()
      }
    },
    userChangePage(){
      this.page = this.page + 1
      this.changePage()
    },
    exportData(){
      return this.dataEndpoint + '/export' + document.location.search
    },
  },
  created () {
    
  },
  destroyed () {
    
  }
}
</script>

<style scoped>
html {
    height: 100%;
}

.fr-table {
  overflow: auto;
  height: 100vh;
  padding-bottom: 4rem;
  margin-bottom: 0;
}

.fr-table table {
  height: 100%;
}

.fr-table thead {
  background-color: white;
  background-image: none;

}

.fr-table tbody {
  height: auto;
}

tfoot {
  position: fixed;
  bottom: 0;
  background-color: var(--background-flat-grey);
  color: var(--text-inverted-grey);
  width: 100%;
  z-index: 6;
  overflow: hidden;
}

tfoot .fr-btn--secondary {
  --border-action-high-blue-france: var(--text-inverted-grey);
  --border-active-blue-france: var(--text-inverted-grey);
  --text-action-high-blue-france: var(--text-inverted-grey);
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

.header {
  min-width: 150px;
}

.header.sticky-bar{
  padding: 0.45rem 1rem 0.4rem 1rem;
  font-size: 0.8rem;
}

.filter {
  border-width: 1px;
}

.cell {
  max-height: 7.5rem;
  overflow: auto;
  overflow-x: hidden;
} 

.style-header-col {
  cursor: pointer;
}

.messageNoResults{
  min-height: 400px;
}

@media (min-width: 48em){

  .fr-table td{
    padding:0.75rem;
  }

}

</style>
