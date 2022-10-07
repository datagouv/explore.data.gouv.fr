<template>
  <!-- url field if no url provided -->
  <div class="fr-mt-4w fr-container" v-if="csvUrl">
    <h2>Visualisation de données</h2>
    <h6 v-if="dgv_infos && dgv_infos.resource">{{ dgv_infos.resource.title }}</h6>
    <div class="fr-form-group">
        <fieldset class="fr-fieldset fr-fieldset--inline">
            <legend class="fr-fieldset__legend fr-text--regular" id='radio-needfilter-legend'>
                Avant de commencer, avez-vous besoin de filtrer vos données ?
            </legend>
            <div class="fr-fieldset__content">
                <div @click="resetConfig()" class="fr-radio-group">
                    <input type="radio" id="radio-needfilter-1" name="radio-needfilter" :value="true" v-model="needFilter">
                    <label class="fr-label" for="radio-needfilter-1">Oui
                    </label>
                </div>
                <div @click="resetConfig()" class="fr-radio-group">
                    <input type="radio" id="radio-needfilter-2" name="radio-needfilter" :value="false" v-model="needFilter">
                    <label class="fr-label" for="radio-needfilter-2">Non
                    </label>
                </div>
            </div>
        </fieldset>
    </div>
    <div class="fr-select-group" v-if="needFilter">
      <h3>Filtres</h3>
        <label class="fr-label" for="select-hint">Ajouter des filtres :
            <span class="fr-hint-text">Vous devez sélectionner une colonne de votre fichier en lui appliquant une opération.</span>
        </label>
        <div class="select-filter">
          <div class="select-column-filter">
            <select class="fr-select" id="select-hint" name="select-hint" v-model="currentFilter.column">
                <option value="" selected disabled hidden>Selectionnez une colonne</option>
                <option v-for="column in columns" :key="column" :value="column">{{ column }}</option>
            </select>
          </div>
          <div class="select-column-filter">
            <select class="fr-select" id="select-hint" name="select-hint" v-model="currentFilter.operation">
                <option value="" selected disabled hidden>Selectionnez une opération</option>
                <option value="exact">égal à</option>
                <option value="contains">contient</option>
                <option value="different">est différent de</option>
                <option value="less">inférieur ou égal à</option>
                <option value="greater">supérieur ou égal à</option>
                <option value="before">avant</option>
                <option value="after">après</option>
            </select>
          </div>
          
          <div class="select-column-filter">
            <input class="fr-input" type="text" id="text-input-text" name="text-input-text" v-model="currentFilter.value">
          </div>
          <button @click="addFilter()" class="fr-btn">
              Valider
          </button>
        </div>
        <div class="fr-table" v-if="filters.length > 0">
          <table>
              <thead>
                  <tr>
                      <th class="th-filter">Colonne</th>
                      <th class="th-filter">Opération</th>
                      <th class="th-filter">Valeur</th>
                      <th>Supprimer</th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="filter in filters" :key="`${filter.column}-${filter.operation}-${filter.value}`">
                      <td>{{ filter.column }}</td>
                      <td>{{ dictionary[filter.operation] }}</td>
                      <td>{{ filter.value }}</td>
                      <td>
                        <button 
                          @click="deleteFilter(filter)" 
                          class="fr-btn fr-icon-delete-fill"
                        ></button>
                      </td>
                  </tr>
              </tbody>
          </table>
        </div>
    </div>
    <div v-if="needFilter != null && ((filters.length > 0 && needFilter) || !needFilter)">
      <h3>Paramétrer la visualisation</h3>
      <div class="fr-form-group">
        <fieldset class="fr-fieldset fr-fieldset--inline">
            <legend class="fr-fieldset__legend fr-text--regular" id='radio-typeviz-legend'>
                Quel type de visualisation souhaitez-vous ?
            </legend>
            <div class="fr-fieldset__content">
                <div @click="resetConfig()" class="fr-radio-group">
                    <input type="radio" id="radio-typeviz-2" name="radio-typeviz" value="graph" v-model="viz_type">
                    <label class="fr-label" for="radio-typeviz-2">Graphique
                    </label>
                </div>
                <div @click="resetConfig()" class="fr-radio-group">
                    <input type="radio" id="radio-typeviz-1" name="radio-typeviz" value="map" v-model="viz_type">
                    <label class="fr-label" for="radio-typeviz-1">Carte
                    </label>
                </div>
            </div>
        </fieldset>
      </div>
      <div v-if="viz_type === 'map' && columnsGeo.length === 0" class="fr-col-12 fr-col-md-12 fr-col-xl-12 preventMessage">
        Attention, nous ne détectons pas de champs géographiques (limités aux codes communes et code départements).
        <br />Nous ne pouvons par conséquent pas proposer ce type de visualisation.
      </div>
      <!-- <div class="fr-form-group" v-if="typeViz && typeViz == 'graph'">
        <fieldset class="fr-fieldset fr-fieldset--inline">
            <legend class="fr-fieldset__legend fr-text--regular" id='radio-typegraph-legend'>
                Choisissez le type de graphique :
            </legend>
            <div class="fr-fieldset__content">
                <div class="fr-radio-group">
                    <input type="radio" id="radio-typegraph-1" name="radio-typegraph" value="histo" v-model="typeGraph">
                    <label class="fr-label" for="radio-typegraph-1">Histogramme
                    </label>
                </div>
                <div class="fr-radio-group">
                    <input type="radio" id="radio-typegraph-2" name="radio-typegraph" value="curve" v-model="typeGraph">
                    <label class="fr-label" for="radio-typegraph-2">Courbe
                    </label>
                </div>
                <div class="fr-radio-group">
                    <input type="radio" id="radio-typegraph-3" name="radio-typegraph" value="camembert" v-model="typeGraph">
                    <label class="fr-label" for="radio-typegraph-3">Camembert
                    </label>
                </div>
            </div>
        </fieldset>
      </div>
      <div class="fr-form-group" v-if="typeViz && typeViz == 'map'">
        <fieldset class="fr-fieldset fr-fieldset--inline">
            <legend class="fr-fieldset__legend fr-text--regular" id='radio-typemap-legend'>
                Choisissez le type de carte :
            </legend>
            <div class="fr-fieldset__content">
                <div class="fr-radio-group">
                    <input type="radio" id="radio-typemap-1" name="radio-typemap" value="chloropleth" v-model="typeMap">
                    <label class="fr-label" for="radio-typemap-1">Chloropleth
                    </label>
                </div>
                <div class="fr-radio-group">
                    <input type="radio" id="radio-typemap-2" name="radio-typemap" value="points" v-model="typeMap">
                    <label class="fr-label" for="radio-typemap-2">Points
                    </label>
                </div>
            </div>
        </fieldset>
      </div> -->
      <div v-if="(viz_type == 'map' && columnsGeo.length > 0) || (viz_type == 'graph')">
        <div class="select-filter">
          <div class="input-filter">
            <label class="fr-label" for="text-input-text-title-chart">Titre</label>
            <input class="fr-input" type="text" id="text-input-text-title-chart" name="text-input-text-title-chart" v-model="titleChart">
          </div>
          <div class="input-filter">
            <label class="fr-label" for="text-input-text-title-chart">Unité</label>
            <input class="fr-input" type="text" id="text-input-text-title-chart" name="text-input-text-title-chart" v-model="unitChart">
          </div>
        </div>
        <br />
        <div class="select-filter" v-if="viz_type == 'graph'">
          <div class="select-column-filter">
            <label class="fr-label" for="select-hint">Axe des abscisses :
                <span class="fr-hint-text">Choisissez une colonne de votre fichier</span>
            </label>
            <div class="select-filter">
              <div class="select-column-filter">
                <select class="fr-select" id="select-hint" name="select-hint" v-model="viz_x">
                    <option value="" selected disabled hidden>Selectionnez une colonne</option>
                    <option v-for="column in columns" :key="column" :value="column">{{ column }}</option>
                </select>
              </div>
            </div>
          </div>
          <div v-if="columnsInfos && columnsInfos[viz_x] && columnsInfos[viz_x]['format'] === 'date'" class="select-column-filter">
            <label class="fr-label" for="select-hint">Grouper les dates
                <span class="fr-hint-text">mois ou années</span>
            </label>
            <div class="select-filter">
              <div class="select-column-filter">
                <select class="fr-select" id="select-hint" name="select-hint" v-model="viz_x_gb">
                    <option value="" selected disabled hidden>Selectionnez une agrégation</option>
                    <option value="10">jours</option>
                    <option value="7">mois</option>
                    <option value="4">années</option>
                </select>
              </div>
            </div>
          </div>
          <div v-if="filterNbX" class="select-column-filter">
            <label class="fr-label" for="select-hint">Nombre d'éléments :
                <span class="fr-hint-text">Trop de valeurs différentes</span>
            </label>
            <div class="select-filter">
              <div class="select-column-filter">
                <select class="fr-select" id="select-hint" name="select-hint" v-model="viz_x_nb">
                    <option value="" selected disabled hidden>Selectionnez une colonne</option>
                    <option value="3">3</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="select-filter" v-if="viz_type == 'map' && columnsGeo.length > 0">
            <div class="select-column-filter">
              <label class="fr-label" for="select-hint">Axe des abscisses :
                  <span class="fr-hint-text">Choisissez une colonne de votre fichier</span>
              </label>
              <div class="select-filter">
                <div class="select-column-filter">
                  <select class="fr-select" id="select-hint" name="select-hint" v-model="viz_x">
                      <option value="" selected disabled hidden>Selectionnez une colonne</option>
                      <option v-for="column in columnsGeo" :key="column" :value="column">{{ column }}</option>
                  </select>
                </div>
              </div>
            </div>
            <div v-if="columnsInfos && columnsInfos[viz_x] && columnsInfos[viz_x]['format'] === 'code_commune_insee'" class="select-column-filter">
              <label class="fr-label" for="select-hint"><br />
                <span class="fr-icon-info-line" aria-hidden="true"></span>
                Nous allons grouper les communes par département
              </label>
            </div>
        </div>
        <br />
        <div v-if="(viz_type == 'map' && columnsGeo.length > 0) || (viz_type == 'graph')" class="select-filter">
          <div class="select-column-filter">
            <label class="fr-label" for="select-hint">Indicateur :
                <span class="fr-hint-text">Opération sur l'axe des ordonnées.</span>
            </label>
            <div class="select-filter">
              <div class="select-column-filter">
                <select class="fr-select" id="select-hint" name="select-hint" v-model="viz_op">
                    <option value="" selected disabled hidden>Selectionnez une colonne</option>
                    <option value="count">Compter le nombre de lignes</option>
                    <option v-if="columnsY.length > 0" value="sum">Somme de</option>
                    <option v-if="columnsY.length > 0" value="avg">Moyenne de</option>
                    <option v-if="columnsY.length > 0" value="min">Minimum de</option>
                    <option v-if="columnsY.length > 0" value="max">Maximum de</option>
                </select>
              </div>
            </div>
          </div>
          <div class="select-column-filter" v-if="viz_op != '' && viz_op != 'count'">
            <label class="fr-label" for="select-hint">Axe des ordonnées :
                <span class="fr-hint-text">Choisissez une colonne de votre fichier.</span>
            </label>
            <div class="select-filter">
              <div class="select-column-filter">
                <select class="fr-select" id="select-hint" name="select-hint" v-model="viz_y">
                    <option value="" selected disabled hidden>Selectionnez une colonne</option>
                    <option v-for="column in columnsY" :key="column" :value="column">{{ column }}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <br />
      </div>
      <br />
      <div v-if="valuesy.length > 0 && displayChart && viz_type === 'graph'">
        <span>
          <bar-chart indicateur="toto" color="#3558a2" :titleChart="titleChart" :unitChart="unitChart" :typeChart="typeChart"></bar-chart>
        </span>
      </div>    
      <div v-if="displayChart && viz_type === 'map'" class="mapChart">
        <div class="mapChart-center" id="mapViz">
          <map-chart indicateur="taux_incidence" :titleChart="titleChart" :unitChart="unitChart"></map-chart>
        </div>
      </div>
      <div v-if="displayChart && viz_type === 'graph'" class="fr-form-group">
        <fieldset class="fr-fieldset fr-fieldset--inline">
            <legend class="fr-fieldset__legend fr-text--regular" id='radio-needfilter-legend'>
                Type de graphique :
            </legend>
            <div class="fr-fieldset__content">
                <div class="fr-radio-group">
                    <input type="radio" id="radio-typechart-2" name="radio-typechart" value="bar" v-model="typeChart">
                    <label class="fr-label" for="radio-typechart-2">Histogramme
                    </label>
                </div>
                <div class="fr-radio-group">
                    <input type="radio" id="radio-typechart-1" name="radio-typechart" value="line" v-model="typeChart">
                    <label class="fr-label" for="radio-typechart-1">Courbe
                    </label>
                </div>
            </div>
        </fieldset>
      </div>
    </div>
  </div>
</template>

<script>
import BarChart from '@/components/BarChart'
import MapChart from '@/components/MapChart'

export default {
  name: 'GenerateVizView',
  components: {BarChart, MapChart},
  data() {
    return {
      csvUrl: '',
      needFilter: null,
      typeViz: null,
      typeChart: 'bar',
      typeGraph: null,
      typeMap: null,
      filters: [],
      columns: [],
      columnsY: [],
      columnsGeo: [],
      currentFilter: {
        column: '',
        operation: '',
        value: ''
      },
      filterNbX: false,
      titleChart: '',
      unitChart: '',
      viz_x: '',
      viz_x_nb: '',
      viz_x_gb: '',
      viz_y: '',
      viz_op: '',
      viz_type: '',
      dictionary: {
        'contains': 'contient',
        'exact': 'égal à',
        'different': 'est différent de',
        'less': 'inférieur ou égal à',
        'greater': 'supérieur ou égal à',
        'before': 'avant',
        'after': 'après'
      }
    }
  },
  computed: {
    columnsInfos () {
      return this.$store.state.columnsInfos
    },
    displayChart () {
      return this.$store.state.displayChart
    },
    dgv_infos(){
      return this.$store.state.dgv_infos
    },
    valuesx () {
      return this.$store.state.valuesx
    },
    valuesy () {
      return this.$store.state.valuesy
    },
  },
  created() {
    const params = new URLSearchParams(document.location.search)
    // set filters from query string (before setting url and fetching data)
    const url = params.get('url')
    if (url) {
      this.csvUrl = url
    }
  },
  methods: {
    addFilter(){
      if (this.currentFilter.column != '' && this.currentFilter.operation != '' && this.currentFilter.value != '') {
        this.filters.push(this.currentFilter)
        let currentFilter = {
          column: '',
          operation: '',
          value: ''
        }
        this.currentFilter = currentFilter
      }
    },
    deleteFilter(filter){
      this.filters = this.filters.filter(f => f != filter)
    },
    generateChart(){
      if ((this.viz_y != '' && this.viz_op != '' && this.viz_x != '') || (this.viz_op == 'count' && this.viz_x != '')) {
        if(!this.filterNbX || (this.viz_x_nb)) {
          let viz = {
            x: this.viz_x,
            op: this.viz_op,
            y: this.viz_y,
            xtop: this.viz_x_nb,
            xgb: this.viz_x_gb,
            filters: this.filters
          }
          this.$store.dispatch('graphdata', viz).finally(() => {})
        }
      }
    },
    resetConfig(){
      this.viz_x = ''
      this.viz_y = ''
      this.viz_x_nb = ''
      this.viz_x_gb = ''
      this.viz_op = ''
      this.titleChart = ''
      this.unitChart = ''
    }
  },
  watch: {
    columnsInfos(){
      this.columns = Object.keys(this.columnsInfos)
      this.columnsY = Object.keys(this.columnsInfos).filter(key => (['int', 'float', 'longitude_wgs', 'latitude_wgs', 'longitude_l93', 'latitude_l93'].includes(this.columnsInfos[key]['format'])))
      this.columnsGeo = Object.keys(this.columnsInfos).filter(key => (['code_commune_insee', 'code_departement'].includes(this.columnsInfos[key]['format'])))
    },
    csvUrl (value) {
      if (!value) return
      this.$store.dispatch('apify', this.csvUrl).finally(() => {})
    },
    needFilter(){
      let currentFilter = {
        column: '',
        operation: '',
        value: ''
      }
      this.currentFilter = currentFilter
      this.filters = []
    },
    viz_op(){
      if(this.viz_op == '' || this.viz_op == 'count') {
        this.viz_y = ''
      }
      this.$store.dispatch('deleteChart')
      this.generateChart()
    },
    viz_x(){
      this.$store.dispatch('deleteChart')
      this.viz_x_nb = ''
      this.filterNbX = false
      if(this.columnsInfos[this.viz_x] && !['code_commune_insee', 'code_departement', 'date'].includes(this.columnsInfos[this.viz_x]['format']) && this.columnsInfos[this.viz_x]['nb_distinct'] > 30) {
        this.filterNbX = true
      }
      if(this.columnsInfos[this.viz_x] && this.columnsInfos[this.viz_x]['format'] === 'code_commune_insee' && this.viz_type == 'map') {
        this.viz_x_gb = '2'
      }
      this.generateChart()
    },
    viz_y(){
      this.$store.dispatch('deleteChart')
      this.generateChart()
    },
    viz_x_nb(){
      this.$store.dispatch('deleteChart')
      this.generateChart()
    },
    viz_x_gb(){
      this.$store.dispatch('deleteChart')
      this.generateChart()
    },
    typeChart(){
      this.$store.dispatch('deleteChart')
      this.generateChart()
    }
  }
}
</script>

<style scoped>
.fr-radio-group input[type=radio i]+label{
  display: inline;
}
.select-column-filter{
  max-width: 280px;
  margin-right: 20px;
}
.input-filter{
  width: 280px;
  margin-right: 20px;
}
.select-filter{
  display: flex;
}
.csvapi .fr-btn{
  border-radius: 0px;
}
.th-filter{
  min-width: 280px;
}
.fr-container{
  margin-bottom: 200px;
}
.mapChart{
  max-width: 600px;
  padding: 10px;
  border: 1px solid #E5E5E5;
}
.mapChart-center{
  margin: auto;
}

.preventMessage{
  background-color: #FBCB04;
  padding-left: 30px;
  padding-top: 10px;
  padding-bottom: 10px;
  color: #1353B5;
  border-radius: 4px;
}
</style>
