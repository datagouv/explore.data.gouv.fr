<template>
<div>
  <div class="menu-resource">    
    <div class="menu-infos-actions">
        <div class="menu-counts">
            <div class="menu-count">
                <strong>Nb. Colonnes</strong> : {{ fields.length }}
            </div>
            <div class="menu-count">
                <strong>Nb. Lignes</strong> : {{ totalRows }}
            </div>
        </div>
        <div class="menu-buttons">
            <div class="menu-button">
                <div v-if="dgvInfos.resource">
                    <div class="fr-col-auto" style="width: 100%">
                        <button
                        :disabled="doesntHaveFilter"
                        class="fr-btn fr-btn--sm fr-btn--secondary fr-btn--icon-left fr-icon-filter-line"
                        data-fr-opened="false"
                        aria-controls="fr-modal-filters"
                        :style="filters.length > 0 ? '' : 'padding-right: 2px;'"
                        >
                            <span v-if="hasActivefilters" class="fr-badge fr-badge--blue-cumulus">{{countActiveFilters}}</span>
                        </button>
                    </div>
                    </div>
                </div>

            </div>
            <div v-if="filters.length > 0" class="menu-button">
                <div class="fr-col-auto">
                    <a
                    v-if="filters.length > 0"
                    download
                    :href="exportData()"
                    target="_blank"
                    class="fr-btn fr-btn--sm fr-btn--secondary fr-btn--icon-left fr-icon-download-line"
                    >
                    Données filtrées
                    </a>
                </div>
            </div>
            <div class="menu-button">
                <div>
                    <span v-if="dgvInfos.resource">
                    <a
                        download
                        :href="dgvInfos.resource.latest"
                        class="fr-btn fr-btn--sm fr-btn--secondary fr-btn--icon-left fr-icon-download-line"
                        style="padding-right: 2px;"
                    ></a>
                    </span>
                </div>
            </div>
    </div>
    <div class="menu-tabs ">
        <div class="menu-tab" :class="tabId === 'data' ? 'menu-tab-selected' : ''" @click="changeTab('data')">
            Données
        </div>
        <div class="menu-tab" :class="tabId === 'description' ? 'menu-tab-selected' : ''" @click="changeTab('description')">
            Description
        </div>
        <div class="menu-tab" :class="tabId === 'structure' ? 'menu-tab-selected' : ''" @click="changeTab('structure')">
            Structure&nbsp;de&nbsp;données
        </div>
        <div class="menu-tab" :class="tabId === 'metadata' ? 'menu-tab-selected' : ''" @click="changeTab('metadata')">
            Métadonnées
        </div>
        <div class="menu-tab" :class="tabId === 'api' ? 'menu-tab-selected' : ''" @click="changeTab('api')">
            API
        </div>
    </div>
  </div></div>
</template>


<script>
import storeTabular from '@/apps/tabular/store/storeTabular'
import yaml from 'js-yaml';

export default {
  name: 'MenuResource',
  components: { },
  store: storeTabular,
  data() {
    return {
    }
  },
  computed: {
    tabId(){
        return this.$store.state.tabId;
    },
    doesntHaveFilter() {
      return !this.hasActivefilters;
    },
    fields() {
      return this.$store.getters.fields;
    },
    totalRows() {
      return this.$store.state.totalRows;
    },
    dgvInfos() {
      return this.$store.state.dgv_infos
    },
    hasActivefilters() {
      return this.countActiveFilters > 0
    },
    countActiveFilters() {
      return this.filters.length
    },
    filters() {
      return this.$store.state.filters
    },
    dataEndpoint() {
      return this.$store.state.dataEndpoint;
    },
  },
  methods: {
    exportData() {
      return this.dataEndpoint + "csv/" + document.location.search;
    },
    changeTab(tabId){
        // if (tabId == 'api'){
        //     const response = await fetch('https://tabular-api.data.gouv.fr/api/resources/27d469ff-9908-4b7e-a2e0-9439bb38a395/swagger/');
        //     if (!response.ok) {
        //     throw new Error('Network response was not ok');
        //     }
        //     const yamlText = await response.text();
        //     const doc = yaml.load(yamlText);
        //     this.$store.commit("setSwaggerJSON.stringify(doc, null, 2)); // Converts the object to a string for display
        // }
        this.$store.commit('updateTabId', tabId)
    },
  },
  watch: {
  }
}
</script>
<style scoped>
.menu-resource {
    display: flex;
    flex-direction: column;
    padding-top: 5px;
    padding-bottom: 5px;
    border-bottom: 1px solid #EEEEEE;
}

@media (min-width: 70em) {
    .menu-resource {
        flex-direction: row;
        justify-content: space-between;
    }
    .menu-infos-actions {
        order: 2;
        display: flex;
        align-items: center;
    }
    .menu-tabs {
        order: 1;
        display: flex;
        align-items: center;
        border: 1px solid #DDDDDD;
        border-radius: 3px;
    }
}

@media (max-width: 70em) {
    .menu-resource {
        align-items: flex-start;
    }
    .menu-infos-actions {
        order: 1;
        width: 100%;
        display: flex;
        justify-content: flex-end;
        padding-bottom: 10px;
    }
    .menu-tabs {
        order: 2;
        border: 1px solid #DDDDDD;
        border-radius: 3px;
        align-self: flex-start; /* Aligns to the left */
        display: flex;
    }
}

@media (max-width: 35em) {
    .menu-counts {
        display: none;
    }
}

@media (min-width: 35em) {
    .menu-counts {
        display: flex;
        align-items: center;
    }
}

.menu-tab {
    padding: 5px 1rem;
    font-size: 14px;
    font-weight: bold;
}

.menu-tab-selected {
    border: 1px solid #465F9D;
    border-radius: 3px;
    color: #465F9D;
}

.menu-tab:hover, .menu-tab-hover:hover {
    cursor: pointer;
    border: 1px solid #465F9D;
    background-color: #E9EDFE;
    color: #465F9D;
    border-radius: 3px;
}

.menu-count {
    margin-right: 1rem;
    font-size: 12px;
}

.menu-button {
    margin-right: 10px;
}
</style>