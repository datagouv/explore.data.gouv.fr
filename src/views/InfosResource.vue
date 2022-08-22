<template>
  <div v-if="dgvInfos.resource" class="fr-container--fluid fr-p-2w sticky-bar">
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12 fr-col-md-6 fr-col-xl-8">
        <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
          <div class="fr-col-12 fr-col-sm-9 fr-col-xl-4">
            <select class="fr-select" v-model="selectedResource" @change="redirectToResource">
              <option :key="dgvInfos.resource.id" :value="dgvInfos.resource.id">
                {{ dgvInfos.resource.title || 'Ressource sans nom' }}
              </option>
              <option
                v-for="option in dgvInfos.other_resources"
                :key="option.resource_id"
                :value="option.resource_id"
                :disabled="!option.preview_url"
              >
                {{ option.resource_title || 'Ressource sans nom' }}
              </option>
            </select>
          </div>
          <div class="fr-col-12 fr-col-xl-8 fr-text--sm fr-m-0 text-mention-grey">
            <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
              <div class="fr-col-auto">Mis à jour le date {{ toFrDate(dgvInfos.resource.last_modified) }}</div>
              <div class="fr-col-auto">
                <template v-if="dgvInfos.resource.format">{{ dgvInfos.resource.format }} </template>
                <template v-if="dgvInfos.resource.filesize">({{ bytesToSize(dgvInfos.resource.filesize) }})</template>
              </div>
              <div class="fr-col-auto">{{ dgvInfos.resource.metrics.views ? dgvInfos.resource.metrics.views : 0 }} téléchargements</div>
            </div>
          </div>
        </div>
      </div>
      <div class="fr-col-12 fr-col-md-6 fr-col-xl-4">
        <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
          <div class="fr-col-auto">
            <button
              :disabled="doesntHaveFilter"
              class="fr-btn fr-btn--sm fr-btn--secondary fr-btn--icon-left fr-icon-filter-line"
              data-fr-opened="false"
              aria-controls="fr-modal-filters"
            >
              Configurer les filtres <span v-if="hasActivefilters" class="fr-ml-1w fr-badge fr-badge--blue-cumulus">{{countActiveFilters}}</span>
            </button>
          </div>
          <div class="fr-col-12 fr-col-sm">
            <div class="fr-input-wrap fr-input-wrap--icon-left fr-icon-search-line" :class="globalSearchWrapClass">
              <input class="fr-input" type="search" :class="globalSearchClass" v-model="globalSearch" placeholder="Rechercher" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <dialog aria-labelledby="fr-modal-title-modal-filters" role="dialog" id="fr-modal-filters" class="fr-modal">
      <div class="fr-container fr-container--fluid fr-container-md">
          <div class="fr-grid-row fr-grid-row--center">
              <div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
                  <div class="fr-modal__body">
                      <div class="fr-modal__header">
                          <button class="fr-link--close fr-link" title="Fermer la fenêtre modale" aria-controls="fr-modal-filters">Fermer</button>
                      </div>
                      <div class="fr-modal__content">
                          <h1 id="fr-modal-title-modal-filters" class="fr-modal__title"><span class="fr-fi-arrow-right-line fr-fi--lg"></span>Configurer les filtres</h1>
                          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas varius tortor nibh, sit amet tempor nibh finibus et. Aenean eu enim justo. Vestibulum aliquam hendrerit molestie. Mauris malesuada nisi sit amet augue accumsan tincidunt. Maecenas tincidunt, velit ac porttitor pulvinar, tortor eros facilisis libero, vitae commodo nunc quam et ligula. Ut nec ipsum sapien. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer id nisi nec nulla luctus lacinia non eu turpis. Etiam in ex imperdiet justo tincidunt egestas. Ut porttitor urna ac augue cursus tincidunt sit amet sed orci.</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </dialog>
  </div>
</template>


<script>
import {getResourceUrl} from '../config'
export default {
  name: 'DgvInfos',
  components: {},
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
    redirectToResource() {
      const url = new URL(window.location.toString())
      url.searchParams.set('url', getResourceUrl(this.selectedResource))
      window.open(url)
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
.sticky-bar {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  border-bottom: 1px solid var(--border-default-grey);
}
</style>
