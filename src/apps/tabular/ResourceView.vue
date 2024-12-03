<template>
<div>
    <div id="resource-view">
        <header-apps
            :formHref="formHref()"
            appName="Explorateur de données"
            appLink="/tableau"
            :displayBanner="true"
        ></header-apps>
        <infos-resources></infos-resources>
        <infos-dgv></infos-dgv>
        <div v-if="!isCsv && isGeojson">
          <div class="umap-banner">Cette carte est disponible grâce à <a href="https://umap.openstreetmap.fr/fr/" target="_blank">Umap</a><span class="hide-mobile"> et propulsé par <a :href="umapUrl" target="_blank">l'instance de l'ANCT</a>. Vous pouvez éditer directement la carte sur cette instance <a :href="umapUrl + 'map/?dataUrl=' + datagouvUrl + '/fr/datasets/r/' + dgvInfos.resource.id + '&popupTemplate=Table'" target="_blank">en cliquant sur ce lien</a></span></div>
          <iframe class="iframe-umap" :src="umapUrl + 'map/?dataUrl=' + datagouvUrl + '/fr/datasets/r/' + dgvInfos.resource.id + '&popupTemplate=Table'"></iframe>
        </div>
        <template class="h-full" v-if="isCsv">
          <menu-resource></menu-resource>
          <Table v-if="tabId === 'data' && dgvInfos && dgvInfos.resource" scrollable="scrollable" display="display"></Table>
          <div v-if="tabId === 'description'" class="infos-tab">
            <strong>Description</strong>
            <br />
            <p v-if="dgvInfos.resource.description">{{ dgvInfos.resource.description }}</p>
            <p v-else>Cette ressource n'a pas de description.</p>
          </div>
          <div v-if="tabId === 'structure'" class="infos-tab">
            <strong>Structure des données</strong>

            <br />
            <div @click="displayDetail(item)" v-for="item in Object.keys(columnsInfos)" >
              <div class="metadata-column">
                <div>
                  <strong>{{ item }}</strong>
                </div>
                <div class="main-metadata">
                  <div class="distinct-metadata" v-if="columnsInfos[item].nb_distinct">
                    Valeurs distinctes : <strong>{{ columnsInfos[item].nb_distinct }}</strong>
                  </div>
                  <!-- <div class="format-metadata" v-if="columnsInfos[item].python_type">
                    Type : <span class="format">{{ columnsInfos[item].python_type }}</span>
                  </div> -->
                  <div class="format-metadata" v-if="columnsInfos[item].format">
                    Format : <span class="format">{{ columnsInfos[item].format }}</span>
                  </div>
                </div>
              </div>
              <div v-if="displayDetailColumn === item" class="detail-column">

                <div class="detail-metadata" v-if="columnsInfos[item].min">
                  <div>Min.</div>
                  <div><strong>{{ columnsInfos[item].min }}</strong></div>
                </div>
                <div class="detail-metadata" v-if="columnsInfos[item].max">
                  <div>Max.</div>
                  <div><strong>{{ columnsInfos[item].max }}</strong></div>
                </div>
                <div class="detail-metadata" v-if="columnsInfos[item].mean">
                  <div>Moyenne</div>
                  <div><strong>{{ columnsInfos[item].mean }}</strong></div>
                </div>
                <div class="detail-metadata" v-if="columnsInfos[item].std">
                  <div>Ecart Type</div>
                  <div><strong>{{ columnsInfos[item].std }}</strong></div>
                </div>
              </div>

              <div v-if="displayDetailColumn === item" class="detail-column">
                <div class="detail-metadata" v-if="columnsInfos[item].format">
                  <div>Valeurs les plus fréquentes</div>
                  <div class="detail-column">
                    <div class="detail-metadata" v-for="index in 5" :key="index">
                      <div  v-for="n in [0, 1]" :key="n">
                        <span v-if="columnsInfos[item].tops.length > ((index-1)*2 + n)">
                          <strong>{{ columnsInfos[item].tops[(index-1)*2 + n].value }}</strong> ({{ columnsInfos[item].tops[(index-1)*2 + n].count }})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div  v-if="tabId === 'metadata'" class="metadata-tab">
            <div  class="metadata-container">
              <div class="metadata-block">
                <h4>URL</h4>
                <span><a :href="dgvInfos.resource.url"><span class="link-urls">{{ dgvInfos.resource.url }}</span></a></span>
              </div>

              <div v-if="dgvInfos.resource.created_at" class="metadata-block">
                <h4>Créé le</h4>
                <p>{{ dgvInfos.resource.created_at.slice(0,10) }}</p>
              </div>

              <div class="metadata-block">
                <h4>Taille</h4>
                <p v-if="dgvInfos.resource.filesize">{{ dgvInfos.resource.filesize }}</p>
              </div>
            </div>
            <div  class="metadata-container">
              <div class="metadata-block">
                <h4>URL Stable</h4>
                <span><a :href="dgvInfos.resource.latest"><span class="link-urls">{{ dgvInfos.resource.latest }}</span></a></span>
              </div>

              <div class="metadata-block">
                <h4>Créé le</h4>
                <p v-if="dgvInfos.resource.harvest">{{ dgvInfos.resource.harvest.modified_at.slice(0,10) }}</p>
                <p v-else-if="dgvInfos.resource.modified_at">{{ dgvInfos.resource.modified_at.slice(0,10) }}</p>
              </div>

              <div class="metadata-block">
                <h4>Type</h4>
                <p v-if="dgvInfos.resource.type === 'main'">Fichier principal</p>
                <p v-if="dgvInfos.resource.type === 'documentation'">Documentation</p>
              </div>
            </div>
            <div  class="metadata-container">
              <div class="metadata-block">
                <h4>Identifiant</h4>
                <span class="format">{{ dgvInfos.resource.id }}</span>
              </div>

              <div class="metadata-block">
              </div>

              <div class="metadata-block">
                <h4>Type MIME</h4>
                <span v-if="dgvInfos.resource.mime" class="format">{{ dgvInfos.resource.mime }}</span>
              </div>
            </div>
            <div  class="metadata-container">
              <div class="metadata-block">
                <h4>SHA-1</h4>
                <span v-if="dgvInfos.resource.extras && dgvInfos.resource.extras['analysis:checksum']" class="format">{{ dgvInfos.resource.extras['analysis:checksum'] }}</span>
              </div>

              <div class="metadata-block">
              </div>

              <div class="metadata-block">
              </div>
            </div>
          </div>

            <div v-if="tabId === 'api'">
              <openapi-explorer :spec-url="'https://tabular-api.data.gouv.fr/api/resources/' + dgvInfos.resource.id + '/swagger/'">
              </openapi-explorer>
            </div>
        </template>
    </div>
  </div>
</template>

<script>
import HeaderApps from '@/views/HeaderApps.vue'
import InfosDgv from '@/apps/tabular/views/InfosDgv.vue'
import InfosResources from '@/apps/tabular/views/InfosResources.vue'
import Table from '@/apps/tabular/views/Table.vue'
import MenuResource from '@/apps/tabular/views/menuResource.vue'
import storeTabular from './store/storeTabular'
import 'openapi-explorer';

export default {
    name: 'DatasetView',
    components: {HeaderApps, InfosDgv, InfosResources, Table, MenuResource},
    store: storeTabular,
    data() {
        return {
          displayDetailColumn: "",
          isCsv: true,
          isGeojson: false,
          umapUrl: process.env.VUE_APP_UMAP_INSTANCE,
          datagouvUrl: process.env.VUE_APP_DATAGOUV_URL
        }
    },
    props:{
    },
    computed: {
      dgvInfos() {
        return this.$store.state.dgv_infos
      },
      tabId(){
          return this.$store.state.tabId;
      },
      columnsInfos(){
          return this.$store.state.columnsInfos;
      }
    },
    methods: {
        formHref() {
            return "https://tally.so/r/nr5BML";
        },
        displayDetail(item){
          this.displayDetailColumn = item
        }
    },
    mounted () {
      if (this.dgvInfos.resource.extras && this.dgvInfos.resource.extras['analysis:parsing:finished_at']){
        this.isCsv = true
      } else {
        this.isCsv = false
      }
      if ((this.dgvInfos.resource.format === 'geojson') || (this.dgvInfos.resource.url.split(".")[this.dgvInfos.resource.url.split(".").length-1] === 'geojson') || (this.dgvInfos.resource.title.split(".")[this.dgvInfos.resource.title.split(".").length-1] === 'geojson')) {
        this.isGeojson = true
      } else {
        this.isGeojson = false
      }
    },
    watch: {
    }
}
</script>

<style scoped>
#resource-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  /* Use dvh on newer devices, useful for mobile users */
  height: 100dvh;
  overflow: hidden;
}

.subheader {
  background-color:#3558A2;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}

.subheader.excel {
  display: block;
}

.inforessource {
  flex-grow: 99;
}

.h-full {
  height: 100%;
}

.sticky-bar {
  z-index: 1;
  padding-top: 0.5rem!important;
  padding-bottom: 0.5rem!important;
}

.fr-text--sm, .fr-btn--sm {
  font-size: 0.8rem!important;
}

.dgvSelector {
  line-height: 0.9rem;
  max-width: 320px;
  font-size: 0.8rem;
  font-weight: 700;
}

.preventExcel {
  margin:1px 0 0 0!important;
}

.preventExcel div {
  background-color: #FBCB04;
  padding-left: 30px;
  color: #1353B5;
}

@media (max-width: 48em) {
  .fr-col-auto {
    padding: 0.2rem 0.5rem 0.2rem 0.5rem!important;
  }

  .hide-mobile {
    display: none;
  }

}

.umap-banner {
  width: 100%; 
  height: 50px; 
  background-color: #fbe769; 
  line-height: 50px; 
  margin: auto; 
  padding-left: 20px; 
  font-weight: bold; 
  font-style: italic; 
  font-size: 13px;
}

.iframe-umap {
  display: block;
  height: 80vh;
  width: 100vw;
  border: none;
}

.infos-tab {
  padding: 1rem;
}

.metadata-column {
  display: flex;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #DDDDDD;
}
.main-metadata {
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.metadata-column:hover {
  cursor: pointer;
  background-color: #EEEEEE;
}

.distinct-metadata {
  padding-right: 0.7rem;
}

.format {
  padding-top: 3px;
  padding-bottom: 3px;
  padding-left: 5px;
  padding-right: 5px;
  background-color: #EEEEEE;
  color: #666666;
  border-radius: 3px;
}

.detail-column {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.detail-metadata {
  min-width: 14rem;
  line-height: 50px;
  padding-top: 20px;
  padding-bottom: 20px;
}
.format-metadata {
  padding-right: 10px;
}

.metadata-container {
  display: grid;
  grid-template-columns: 3fr 1fr 1fr; /* Adjust the number of columns as needed */
  padding: 10px;
  justify-content: space-between;
}

.metadata-block {
  border-radius: 5px;
  box-sizing: border-box;
}

.metadata-block h4 {
  margin: 0;
  padding-bottom: 10px;
  font-size: 14px;
  color: #333; /* Dark grey text */
}

.metadata-block p, .metadata-block a {
  margin: 0;
  font-size: 14px;
  color: #666; /* Lighter grey text */
}

.metadata-block a {
  text-decoration: none;
  color: #0000EE; /* Standard link color */
}

/* Responsive adjustments for smaller screens */
@media screen and (max-width: 50em) {
  .metadata-container {
    grid-template-columns: 1fr; /* Stack the blocks on smaller screens */
    justify-content: normal;
  }
}

.metadata-tab{
  padding: 15px;
}
/* 
openapi-explorer::part(section-navbar) {
  background: #3558A2;
} */


.link-urls {
  color: #1353B5;
  font-size: 15px;
}
</style>
