<template>
  <div class="subheader">
    <div class="inforessource">
      <div v-if="dgvInfos.resource" class="fr-container--fluid fr-p-2w sticky-bar">
        <div class="fr-grid-row fr-grid-row--gutters">
          <div class="fr-col-12 fr-col-md-9 fr-col-xl-9">
            <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
              <div class="fr-col-auto">
                <span v-if="!dgvInfos.resource">Sélectionner une ressource du jeu de données : </span>
                <select
                    class="fr-select dgvSelector"
                    v-model="selectedResource"
                    @change="redirectToResource"
                  >
                    <option
                      v-for="item in dgvInfos.other_resources"
                      :key="item.resource_id"
                      :value="item.resource_id"
                      :selected="item.resource_id === dgvInfos.resource.id"
                    >
                      {{ item.resource_title || "Ressource sans nom" }}
                    </option>
                </select>
              </div>
            </div>
            <div class="complements-resource">
              <div class="fr-col-auto fr-text--sm fr-m-0 text-mention-grey">
                <div v-if="dgvInfos.resource" class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle complements-resource-texts">
                  <div class="fr-col-auto">Mis à jour le {{ toFrDate(dgvInfos.resource.last_modified) }}</div>
                  <div class="fr-col-auto">
                    <template v-if="dgvInfos.resource.format">{{ dgvInfos.resource.format }} </template>
                    <template v-if="dgvInfos.resource.filesize">({{ bytesToSize(dgvInfos.resource.filesize) }})</template>
                  </div>
                  <!-- <div class="fr-col-auto">{{ dgvInfos.resource.metrics.views ? dgvInfos.resource.metrics.views : 0 }} téléchargement<template v-if="dgvInfos.resource.metrics.views > 1">s</template></div> -->
                </div>
              </div>
            </div>
          </div>
          <!-- <div v-if="dgvInfos.resource" class="fr-col-12 fr-col-md-3 fr-col-xl-3" style="width: 100%">
            <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle" style="width: 100%">
              <div class="fr-col-auto" style="width: 100%">
                <button
                  :disabled="doesntHaveFilter"
                  class="fr-btn fr-btn--sm fr-btn--secondary fr-btn--icon-left fr-icon-filter-line"
                  data-fr-opened="false"
                  aria-controls="fr-modal-filters"
                  style="float: right;white-space: nowrap;min-width: 180px;"
                >
                  Configurer les filtres <span v-if="hasActivefilters" class="fr-ml-1w fr-badge fr-badge--blue-cumulus">{{countActiveFilters}}</span>
                </button>
              </div>
            </div>
          </div> -->
        </div>
        <dialog aria-labelledby="fr-modal-title-modal-filters" role="dialog" id="fr-modal-filters" class="fr-modal fr-modal--popover">
          <div class="fr-container--fluid">
              <div class="fr-grid-row fr-grid-row--center">
                  <div class="fr-col-12 fr-col-sm-7 fr-col-md-6">
                      <div class="fr-modal__body">
                          <div class="fr-modal__header">
                              Configurer les filtres
                              <button class="fr-link--close fr-link" title="Fermer la fenêtre modale" aria-controls="fr-modal-filters"></button>
                          </div>
                          <div class="fr-modal__content">
                              <div 
                                v-for="filter in filters"
                                :key="filter.field+filter.comp"
                              >
                                <div
                                  v-if="filterNotDuplucate(filter)"
                                  class="fr-py-2w relative"
                                >
                                  <Input
                                    :field="getField(filter.field)"
                                    showLabel
                                  />
                                </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        </dialog>
      </div>
    </div>
  </div>
</template>


<script>
import Input from '@/apps/tabular/views/Input.vue'
import InfosDgv from '@/apps/tabular/views/InfosDgv'
import storeTabular from '@/apps/tabular/store/storeTabular'

export default {
  name: 'DgvInfos',
  components: { Input, InfosDgv },
  store: storeTabular,
  data() {
    return {
      globalSearch: '',
      selectedResource: null,
    }
  },
  computed: {
    countActiveFilters() {
      return this.filters.length
    },
    dgvInfos() {
      return this.$store.state.dgv_infos
    },
    generalInfos() {
      return this.$store.state.generalInfos
    },
    fields() {
      return this.$store.getters.fields
    },
    filters() {
      return this.$store.state.filters
    },
    hasActivefilters() {
      return this.countActiveFilters > 0
    },
    doesntHaveFilter() {
      return !this.hasActivefilters;
    },
    globalSearchClass() {
      return this.globalSearch ? 'fr-input--filled' : 'fr-input--empty'
    },
    globalSearchWrapClass() {
      return this.globalSearch ? 'fr-input-wrap--filled' : 'fr-input-wrap--empty'
    }
  },
  methods: {
    toFrDate(date) {
      return date.substr(8, 2) + "/" + date.substr(5, 2) + "/" + date.substr(0, 4)
    },
    bytesToSize(bytes) {
      var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      if (bytes == 0) return '0 Byte';
      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    },
    getField(key) {
      return this.fields.find(field => field.key === key)
    },
    redirectToResource() {
      window.open(window.location.origin + '/' + this.$route.params.lang + '/datasets/' + this.dgvInfos.dataset_id + '/#/resources/' + this.selectedResource)
    },
    filterNotDuplucate(filter){
      let filt = this.filters.filter(f => f.field === filter.field)
      if((filt.length > 1) & (filter.comp === 'less')){
        return false
      } else {
        return true
      }
    }
  },
  watch: {
    dgvInfos: {
      deep: true,
      immediate: true,
      handler(value) {
        if(value && value.resource) {
          this.selectedResource = value.resource.id
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.subheader{
  background-color:#3558A2;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}




.subheader.excel{
  display: block;
}

.inforessource{
  flex-grow: 99;
}

.complements-resource{
  padding-top: 0px;
  padding-bottom: 0px;
}

.complements-resource-texts{
  color: white;
  padding-left: 0px;
  line-height: 14px;
}

.sticky-bar {
  z-index: 1;
  padding-top: 0.5rem!important;
  padding-bottom: 0.5rem!important;
}

.fr-text--sm, .fr-btn--sm{
  font-size: 0.8rem!important;
}

.dgvSelector{
  line-height: 1.2rem;
  max-width: 600px;
  font-size: 0.8rem;
  font-weight: 700;
  background-color: #7F9AD4;
  color: white;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  box-shadow: inset 0 -2px 0 0 white;
  --data-uri-svg: url(
  "data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' viewBox='0 0 24 24' ><path fill='%23FFFFFF' d='M12,13.1l5-4.9l1.4,1.4L12,15.9L5.6,9.5l1.4-1.4L12,13.1z'/></svg>");
  background-image: var(--data-uri-svg)
}

.preventExcel{
  margin:1px 0 0 0!important;
}

.preventExcel div{
  background-color: #FBCB04;
  padding-left: 30px;
  color: #1353B5;
}


.fr-modal__header{
  border-bottom: 1px solid #DDDDDD;
  padding-bottom: 0px;
  padding-top: 0px;
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: bold;
}

.fr-link--close{
  border-left: 1px solid #DDDDDD;
  min-height: 0rem;
  padding-left: 0rem;
  padding-right: 0rem;
}

.fr-modal__title{
  font-size: 16px;
}

</style>
