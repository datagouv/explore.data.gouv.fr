<template>
  <div class="fr-container--fluid fr-p-2w">
    <div v-if="dgvInfos.resource" class="fr-grid-row fr-grid-row--gutters infosRes">
      <div class="fr-col-12 fr-col-md-6 fr-col-xl-8">
        <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
          <div class="fr-col-12 fr-col-sm-9 fr-col-xl-4">
            <select class="fr-select" v-model="dgvInfos.resource.id">
              <option v-bind:key="dgvInfos.resource.id" v-bind:value="dgvInfos.resource.id">
                {{ dgvInfos.resource.title || 'Ressource sans nom' }}
              </option>
              <option v-for="option in dgvInfos.other_resources" v-bind:key="option.resource_id"
                v-bind:value="option.resource_id">
                {{ option.resource_title || 'Ressource sans nom' }}
              </option>
            </select>
          </div>
          <div class="fr-col-12 fr-col-xl-8 fr-text--sm fr-m-0 compInfos">
            &nbsp;Mis à jour le date {{ toFrDate(dgvInfos.resource.last_modified) }}
            &nbsp;&nbsp;{{ dgvInfos.resource.format }} ({{ bytesToSize(dgvInfos.resource.filesize) }})
            &nbsp;&nbsp;{{ dgvInfos.resource.metrics.views }} téléchargements
          </div>
        </div>
      </div>
      <div class="fr-col-12 fr-col-md-6 fr-col-xl-4">
        <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
          <div class="fr-col-auto">
            <button :disabled="doesntHaveFilter" class="fr-btn fr-btn--sm fr-btn--secondary fr-btn--icon-left fr-icon-filter-line">
              Configurer les filtres <span v-if="hasActivefilters" class="fr-ml-1w fr-badge fr-badge--blue-cumulus">{{countActiveFilters}}</span>
            </button>
          </div>
          <div class="fr-col-12 fr-col-sm">
            <input class="fr-input" v-model="globalSearch" placeholder="Rechercher">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>

export default {
  name: 'DgvInfos',
  components: {},
  data() {
    return {
      globalSearch: ''
    }
  },
  mounted() {
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
    }
  },
  created() {
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
    }
  },
  watch: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.infosRes {
  border-bottom: 1px solid #ebebeb;
  font-size: 15px;
}

.selectResource {
  line-height: 100%;
  background-color: #F3F3F3;
  padding: 10px;
  font-size: 13px;
  border: none;
  border-bottom: 2px solid black;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  font-family: Marianne-Bold;
}

.compInfos {
  color: var(--text-mention-grey);
}
</style>
