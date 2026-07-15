<template>
  <div class="fr-container--fluid decoupage-app">
    <header-apps
      :formHref="formHref"
      appName="Découpage administratif"
      appLink="/decoupage-administratif"
      :betaApp="true"
      :displayBanner="true"
    />

    <div class="panel_container">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        class="panel"
        :class="activeTab === tab.id ? 'active' : ''"
        @click="setActiveTab(tab.id)"
      >
        <span>{{ tab.label }}</span>
      </div>
    </div>

    <div class="map-layout">
      <commune-panel
        v-if="activeTab === 'communes' && selectedCommune"
        :commune="selectedCommune"
        @close="closePanel"
      />

      <groupement-panel
        v-if="activeTab === 'groupements' && selectedGroupement"
        :groupement="selectedGroupement"
        @close="closePanel"
      />

      <aom-panel
        v-if="activeTab === 'aom' && selectedAom"
        :aom="selectedAom"
        @close="closePanel"
      />

      <national-layer-panel
        v-if="activeTab === 'national'"
        :active-layer-id="activeNationalLayerId"
        :loading-layer-id="loadingNationalLayerId"
        @select="onNationalLayerSelect"
      />

      <map-france
        ref="map"
        @ready="onMapReady"
        @national-loading="onNationalLoading"
      />

      <div v-if="activeTab !== 'national'" class="search-overlay">
        <commune-search
          v-if="activeTab === 'communes'"
          @select="onCommuneSelect"
        />
        <groupement-search
          v-else-if="activeTab === 'groupements'"
          @select="onGroupementSelect"
        />
        <aom-search
          v-else-if="activeTab === 'aom'"
          @select="onAomSelect"
        />
      </div>
    </div>
  </div>
</template>

<script>
import HeaderApps from '@/views/HeaderApps';
import MapFrance from './components/MapFrance.vue';
import CommuneSearch from './components/CommuneSearch.vue';
import GroupementSearch from './components/GroupementSearch.vue';
import AomSearch from './components/AomSearch.vue';
import CommunePanel from './components/CommunePanel.vue';
import GroupementPanel from './components/GroupementPanel.vue';
import AomPanel from './components/AomPanel.vue';
import NationalLayerPanel from './components/NationalLayerPanel.vue';
import { API_BASE, COMMUNE_FIELDS, GROUPEMENT_FIELDS, AOM_FIELDS, COMMUNE_LIST_FIELDS, GEOJSON_BASE } from './config';

export default {
  name: 'AppDecoupageAdministratif',
  components: {
    HeaderApps,
    MapFrance,
    CommuneSearch,
    GroupementSearch,
    AomSearch,
    CommunePanel,
    GroupementPanel,
    AomPanel,
    NationalLayerPanel,
  },
  data() {
    return {
      formHref: 'https://tally.so/r/m6L5jo',
      tabs: [
        { id: 'national', label: 'Visualisation nationale' },
        { id: 'communes', label: 'Vue communes' },
        { id: 'groupements', label: "Groupement d'intercommunalités" },
        { id: 'aom', label: 'AOM' },
      ],
      activeTab: 'national',
      selectedCommune: null,
      selectedGroupement: null,
      selectedAom: null,
      pendingContour: null,
      activeNationalLayerId: null,
      loadingNationalLayerId: null,
      mapReady: false,
    };
  },
  methods: {
    setActiveTab(tab) {
      if (this.activeTab === tab) return;
      this.activeTab = tab;
      this.closePanel();
      this.activeNationalLayerId = null;
      this.loadingNationalLayerId = null;
      if (this.$refs.map) {
        this.$refs.map.clearAll();
      }
    },
    onMapReady() {
      this.mapReady = true;
      if (this.pendingContour) {
        this.$refs.map.showContour(this.pendingContour);
        this.pendingContour = null;
      }
    },
    onNationalLoading(loading) {
      if (!loading) {
        this.loadingNationalLayerId = null;
      }
    },
    showOnMap(entity) {
      if (!entity?.contour) return;
      if (this.mapReady) {
        this.$refs.map.showContour(entity);
      } else {
        this.pendingContour = entity;
      }
    },
    async onCommuneSelect(result) {
      try {
        const response = await fetch(
          `${API_BASE}/communes/${result.code}?fields=${COMMUNE_FIELDS}`
        );
        const commune = await response.json();
        this.selectedCommune = commune;
        this.showOnMap(commune);
      } catch (error) {
        console.error('Erreur chargement commune:', error);
      }
    },
    async onGroupementSelect(result) {
      try {
        const [detailResponse, communesResponse] = await Promise.all([
          fetch(
            `${API_BASE}/groupement_collectivites_territoriales/${result.code}?fields=${GROUPEMENT_FIELDS}`
          ),
          fetch(
            `${API_BASE}/groupement_collectivites_territoriales/${result.code}/communes?fields=${COMMUNE_LIST_FIELDS}`
          ),
        ]);

        const detail = await detailResponse.json();
        const communes = await communesResponse.json();

        this.selectedGroupement = { ...detail, communes };
        this.showOnMap(detail);
      } catch (error) {
        console.error('Erreur chargement groupement:', error);
      }
    },
    async onAomSelect(result) {
      try {
        const [detailResponse, communesResponse] = await Promise.all([
          fetch(`${API_BASE}/aom/${result.code}?fields=${AOM_FIELDS}`),
          fetch(`${API_BASE}/aom/${result.code}/communes?fields=${COMMUNE_LIST_FIELDS}`),
        ]);

        const detail = await detailResponse.json();
        const communes = await communesResponse.json();

        this.selectedAom = { ...detail, communes };
        this.showOnMap(detail);
      } catch (error) {
        console.error('Erreur chargement AOM:', error);
      }
    },
    async onNationalLayerSelect(layer) {
      this.loadingNationalLayerId = layer.id;
      this.activeNationalLayerId = layer.id;

      try {
        await this.$refs.map.loadNationalLayer(`${GEOJSON_BASE}/${layer.file}`);
      } catch (error) {
        this.activeNationalLayerId = null;
        console.error('Erreur affichage couche:', error);
      }
    },
    closePanel() {
      this.selectedCommune = null;
      this.selectedGroupement = null;
      this.selectedAom = null;
      this.pendingContour = null;
      if (this.$refs.map) {
        this.$refs.map.clearContour();
      }
    },
  },
};
</script>

<style scoped lang="scss">
.decoupage-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.panel_container {
  display: flex;
  padding: 0 16px;
  border-bottom: 1px solid #e5e5e5;
  flex-shrink: 0;
}

.panel {
  flex: 1;
  height: 40px;
  background-color: #e6eefe;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  margin: 8px 4px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 2px solid transparent;
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;
  border-bottom: 1px solid #e5e5e5;
  cursor: pointer;
  transform: translateY(1px);
  padding: 0 6px;
}

.panel.active {
  background-color: white;
  border-top: 2px solid #000091;
  border-left: 1px solid #e5e5e5;
  border-right: 1px solid #e5e5e5;
  border-bottom: 1px solid white;
}

.map-layout {
  position: relative;
  flex: 1;
  min-height: 0;
}

.search-overlay {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 3;
  background: #fff;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.search-overlay :deep(.fr-label) {
  background: #fff;
}

.search-overlay :deep(.fr-input) {
  background-color: #fff;
}
</style>
