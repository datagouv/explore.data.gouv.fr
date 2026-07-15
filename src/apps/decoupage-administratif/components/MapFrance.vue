<template>
  <div class="map-wrapper">
    <div ref="mapContainer" class="map-container"></div>
    <div
      v-if="tooltip.visible"
      class="map-tooltip"
      :style="{ top: tooltip.top, left: tooltip.left }"
      v-html="tooltip.html"
    ></div>
  </div>
</template>

<script>
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { sirenEntrepriseUrl, isSirenField } from '../config';

const CONTOUR_SOURCE = 'contour-source';
const CONTOUR_FILL = 'contour-fill';
const CONTOUR_LINE = 'contour-line';
const NATIONAL_SOURCE = 'national-source';
const NATIONAL_FILL = 'national-fill';
const NATIONAL_LINE = 'national-line';

const FRANCE_CENTER = [2.5, 46.5];
const FRANCE_ZOOM = 5.2;

const PROPERTY_LABELS = {
  libelle: 'Nom',
  reg: 'Code région',
  dep: 'Code département',
  cheflieu: 'Chef-lieu',
  nccenr: 'Nom',
  nom_du_groupement: 'Groupement',
  nom: 'Nom',
  siren: 'SIREN',
  nb_communes: 'Nombre de communes',
  nature_juridique: 'Nature juridique',
  département: 'Département',
  arrondissement_siège: 'Arrondissement siège',
  commune_siège: 'Commune siège',
  nn_siren: 'SIREN',
  population_totale: 'Population',
  nombre_de_membres: 'Nombre de membres',
  nb_membres: 'Nombre de membres',
  nb_communes: 'Nombre de communes',
  nombre_de_compétences_exercées: 'Compétences exercées',
  date_de_création: 'Date de création',
  "date_d'effet": "Date d'effet",
  mode_de_financement: 'Mode de financement',
  civilité_président: 'Civilité président',
  nom_président: 'Nom président',
  prénom_président: 'Prénom président',
};

export default {
  name: 'MapFrance',
  data() {
    return {
      map: null,
      mapLoaded: false,
      nationalHandlersBound: false,
      hoveredFeatureId: null,
      tooltip: {
        visible: false,
        top: '0px',
        left: '0px',
        html: '',
      },
    };
  },
  mounted() {
    this.map = new maplibregl.Map({
      container: this.$refs.mapContainer,
      style: {
        version: 8,
        sources: {
          'ign-tiles': {
            type: 'raster',
            tiles: [
              'https://data.geopf.fr/wmts?layer=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&style=normal&tilematrixset=PM&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix={z}&TileCol={x}&TileRow={y}',
            ],
            tileSize: 256,
            attribution: '© IGN',
          },
        },
        layers: [
          {
            id: 'ign-layer',
            type: 'raster',
            source: 'ign-tiles',
            minzoom: 0,
            maxzoom: 18,
          },
        ],
      },
      center: FRANCE_CENTER,
      zoom: FRANCE_ZOOM,
      attributionControl: true,
    });

    this.map.addControl(new maplibregl.NavigationControl(), 'top-right');
    this.map.addControl(new maplibregl.FullscreenControl(), 'top-right');

    this.map.on('load', () => {
      this.initSourcesAndLayers();
      this.mapLoaded = true;
      this.$emit('ready');
    });
  },
  beforeDestroy() {
    if (this.map) {
      this.map.remove();
    }
  },
  methods: {
    initSourcesAndLayers() {
      this.map.addSource(NATIONAL_SOURCE, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
        generateId: true,
      });

      this.map.addSource(CONTOUR_SOURCE, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });

      this.map.addLayer({
        id: NATIONAL_FILL,
        type: 'fill',
        source: NATIONAL_SOURCE,
        paint: {
          'fill-color': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            '#7c8ff5',
            '#6a6af4',
          ],
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.45,
            0.25,
          ],
        },
      });

      this.map.addLayer({
        id: NATIONAL_LINE,
        type: 'line',
        source: NATIONAL_SOURCE,
        paint: {
          'line-color': '#000091',
          'line-width': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            2,
            0.6,
          ],
        },
      });

      this.map.addLayer({
        id: CONTOUR_FILL,
        type: 'fill',
        source: CONTOUR_SOURCE,
        paint: {
          'fill-color': '#e1000f',
          'fill-opacity': 0.2,
        },
      });

      this.map.addLayer({
        id: CONTOUR_LINE,
        type: 'line',
        source: CONTOUR_SOURCE,
        paint: {
          'line-color': '#e1000f',
          'line-width': 2,
        },
      });
    },
    bindNationalHandlers() {
      if (this.nationalHandlersBound || !this.map) return;
      this.nationalHandlersBound = true;

      this.map.on('mousemove', NATIONAL_FILL, (e) => {
        if (!e.features?.length) return;
        this.map.getCanvas().style.cursor = 'pointer';

        const feature = e.features[0];
        if (this.hoveredFeatureId !== null && this.hoveredFeatureId !== feature.id) {
          this.map.setFeatureState(
            { source: NATIONAL_SOURCE, id: this.hoveredFeatureId },
            { hover: false }
          );
        }
        this.hoveredFeatureId = feature.id;
        this.map.setFeatureState(
          { source: NATIONAL_SOURCE, id: feature.id },
          { hover: true }
        );

        this.tooltip.html = this.buildTooltipHtml(feature.properties);
        this.tooltip.top = `${e.point.y + 12}px`;
        this.tooltip.left = `${e.point.x + 12}px`;
        this.tooltip.visible = true;
      });

      this.map.on('mouseleave', NATIONAL_FILL, () => {
        this.map.getCanvas().style.cursor = '';
        this.clearHoverState();
        this.tooltip.visible = false;
      });
    },
    clearHoverState() {
      if (this.hoveredFeatureId !== null && this.map?.getSource(NATIONAL_SOURCE)) {
        this.map.setFeatureState(
          { source: NATIONAL_SOURCE, id: this.hoveredFeatureId },
          { hover: false }
        );
      }
      this.hoveredFeatureId = null;
    },
    buildTooltipHtml(properties) {
      const entries = Object.entries(properties || {})
        .filter(([, value]) => value != null && String(value).trim() !== '')
        .map(([key, value]) => {
          const label = PROPERTY_LABELS[key] || this.formatPropertyKey(key);
          return `<div class="tooltip-row"><span class="tooltip-key">${label}</span> ${this.formatPropertyValue(key, value)}</div>`;
        });

      return entries.length
        ? entries.join('')
        : '<div class="tooltip-row">Aucune information</div>';
    },
    formatPropertyValue(key, value) {
      const str = String(value).trim();
      if (isSirenField(key) && /^\d{9}$/.test(str)) {
        const url = sirenEntrepriseUrl(str);
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="tooltip-siren-link">${this.escapeHtml(str)}</a>`;
      }
      return this.escapeHtml(str);
    },
    formatPropertyKey(key) {
      return key.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
    },
    escapeHtml(value) {
      return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    },
    showContour(entity) {
      if (!this.map || !entity?.contour) return;
      this.clearNationalLayer(false);

      const feature = {
        type: 'Feature',
        properties: { code: entity.code, nom: entity.nom },
        geometry: entity.contour,
      };

      const apply = () => {
        this.map.getSource(CONTOUR_SOURCE).setData({
          type: 'FeatureCollection',
          features: [feature],
        });

        const bounds = new maplibregl.LngLatBounds();
        this.extendBounds(bounds, entity.contour);
        this.map.fitBounds(bounds, { padding: 60, maxZoom: 13, duration: 800 });
      };

      if (this.mapLoaded) {
        apply();
      } else {
        this.map.once('load', apply);
      }
    },
    async loadNationalLayer(url) {
      if (!this.map) return;

      this.clearContour(false);
      this.clearHoverState();
      this.tooltip.visible = false;
      this.$emit('national-loading', true);

      try {
        const response = await fetch(url);
        const geojson = await response.json();

        const apply = () => {
          this.map.getSource(NATIONAL_SOURCE).setData(geojson);
          this.bindNationalHandlers();
          this.resetView();
        };

        if (this.mapLoaded) {
          apply();
        } else {
          this.map.once('load', apply);
        }
      } catch (error) {
        console.error('Erreur chargement couche nationale:', error);
        throw error;
      } finally {
        this.$emit('national-loading', false);
      }
    },
    clearContour(resetView = true) {
      if (!this.map || !this.mapLoaded) return;
      const source = this.map.getSource(CONTOUR_SOURCE);
      if (source) {
        source.setData({ type: 'FeatureCollection', features: [] });
      }
      if (resetView) {
        this.resetView();
      }
    },
    clearNationalLayer(resetView = true) {
      if (!this.map || !this.mapLoaded) return;
      this.clearHoverState();
      this.tooltip.visible = false;
      const source = this.map.getSource(NATIONAL_SOURCE);
      if (source) {
        source.setData({ type: 'FeatureCollection', features: [] });
      }
      if (resetView) {
        this.resetView();
      }
    },
    clearAll() {
      this.clearContour(false);
      this.clearNationalLayer(false);
      this.resetView();
    },
    resetView() {
      if (!this.map) return;
      this.map.flyTo({ center: FRANCE_CENTER, zoom: FRANCE_ZOOM, duration: 800 });
    },
    extendBounds(bounds, geometry) {
      if (!geometry) return;

      if (geometry.type === 'Polygon') {
        geometry.coordinates[0].forEach((coord) => bounds.extend(coord));
      } else if (geometry.type === 'MultiPolygon') {
        geometry.coordinates.forEach((polygon) => {
          polygon[0].forEach((coord) => bounds.extend(coord));
        });
      }
    },
  },
};
</script>

<style scoped>
.map-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.map-container {
  width: 100%;
  height: 100%;
}

.map-tooltip {
  position: absolute;
  z-index: 5;
  max-width: 320px;
  padding: 10px 12px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  pointer-events: none;
  font-size: 0.8125rem;
  line-height: 1.4;
}

.map-tooltip :deep(.tooltip-row) {
  margin-bottom: 4px;
}

.map-tooltip :deep(.tooltip-row:last-child) {
  margin-bottom: 0;
}

.map-tooltip :deep(.tooltip-key) {
  font-weight: 700;
}

.map-tooltip :deep(.tooltip-siren-link) {
  color: #000091;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.map-tooltip :deep(.tooltip-siren-link:hover) {
  color: #1212ff;
}
</style>
