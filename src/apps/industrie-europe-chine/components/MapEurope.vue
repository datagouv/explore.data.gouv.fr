<template>
  <div class="map-wrapper">
    <div class="map-header" v-if="mapTitle || mapNote">
      <h3 class="map-title">{{ mapTitle }}</h3>
      <p v-if="mapNote" class="map-note" v-html="mapNote"></p>
    </div>
    <div ref="mapContainer" class="map-container"></div>
    <div class="legend">
      <div class="legend-title">{{ legendConfig.title }}</div>
      <div 
        v-for="(item, index) in legendConfig.items" 
        :key="index"
        class="legend-item"
      >
        <span class="legend-color" :style="{ backgroundColor: item.color }"></span>
        <span class="legend-label">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default {
  name: 'MapEurope',
  props: {
    apiUrl: {
      type: String,
      required: true
    },
    dataField: {
      type: String,
      required: true
    },
    mapTitle: {
      type: String,
      required: true
    },
    mapNote: {
      type: String,
      default: ''
    },
    legendConfig: {
      type: Object,
      required: true
    },
    colorScale: {
      type: Object,
      required: true
    },
    popupConfig: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      map: null,
      europeGeoJSON: null,
      tabularData: null,
      dataByISO3: {},
    };
  },
  async mounted() {
    await Promise.all([
      this.loadEuropeGeoJSON(),
      this.loadTabularData()
    ]);
    this.mergeDataWithGeoJSON();
    this.initMap();
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove();
    }
  },
  methods: {
    async loadEuropeGeoJSON() {
      try {
        const response = await fetch('https://raw.githubusercontent.com/leakyMirror/map-of-europe/refs/heads/master/GeoJSON/europe.geojson');
        this.europeGeoJSON = await response.json();
      } catch (error) {
        console.error('Erreur lors du chargement du GeoJSON:', error);
      }
    },
    async loadTabularData() {
      try {
        const response = await fetch(this.apiUrl);
        const result = await response.json();
        this.tabularData = result.data;
        
        this.dataByISO3 = {};
        this.tabularData.forEach(item => {
          this.dataByISO3[item.iso3] = item;
        });
      } catch (error) {
        console.error('Erreur lors du chargement des données tabular:', error);
      }
    },
    mergeDataWithGeoJSON() {
      if (!this.europeGeoJSON || !this.dataByISO3) return;
      
      this.europeGeoJSON.features = this.europeGeoJSON.features.filter(feature => {
        const iso3 = feature.properties.ISO3;
        if (iso3 && this.dataByISO3[iso3]) {
          const data = this.dataByISO3[iso3];
          Object.keys(data).forEach(key => {
            feature.properties[key] = data[key];
          });
          if (!feature.properties.country_name) {
            feature.properties.country_name = data.HOME || data.Importateur || feature.properties.NAME;
          }
          return true;
        }
        return false;
      });
    },
    initMap() {
      if (!this.europeGeoJSON) {
        console.error('GeoJSON non chargé');
        return;
      }

      this.map = new maplibregl.Map({
        container: this.$refs.mapContainer,
        style: {
          version: 8,
          sources: {
            'osm-tiles': {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }
          },
          layers: [
            {
              id: 'osm-tiles-layer',
              type: 'raster',
              source: 'osm-tiles',
              minzoom: 0,
              maxzoom: 19
            }
          ]
        },
        center: [15.0, 54.0],
        zoom: 2.8,
        attributionControl: true
      });

      this.map.on('load', () => {
        this.map.addSource('europe-countries', {
          type: 'geojson',
          data: this.europeGeoJSON
        });

        this.map.addLayer({
          id: 'europe-fill',
          type: 'fill',
          source: 'europe-countries',
          paint: {
            'fill-color': this.buildColorExpression(),
            'fill-opacity': 0.7
          }
        });

        this.map.addLayer({
          id: 'europe-outline',
          type: 'line',
          source: 'europe-countries',
          paint: {
            'line-color': '#000000',
            'line-width': 1
          }
        });

        this.map.addLayer({
          id: 'country-labels',
          type: 'symbol',
          source: 'europe-countries',
          layout: {
            'text-field': ['get', 'NAME'],
            'text-font': ['Open Sans Regular'],
            'text-size': 12,
            'text-anchor': 'center'
          },
          paint: {
            'text-color': '#161616',
            'text-halo-color': '#ffffff',
            'text-halo-width': 1
          }
        });

        this.map.on('mouseenter', 'europe-fill', () => {
          this.map.getCanvas().style.cursor = 'pointer';
        });

        this.map.on('mouseleave', 'europe-fill', () => {
          this.map.getCanvas().style.cursor = '';
        });

        this.map.on('click', 'europe-fill', (e) => {
          const feature = e.features[0];
          const content = this.buildPopupContent(feature.properties);
          
          new maplibregl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(content)
            .addTo(this.map);
        });
      });

      this.map.addControl(new maplibregl.NavigationControl(), 'top-right');
      this.map.addControl(new maplibregl.FullscreenControl(), 'top-right');
    },
    buildColorExpression() {
      const { type, field, stops } = this.colorScale;
      
      if (type === 'interpolate') {
        const expression = ['interpolate', ['linear'], ['get', field]];
        stops.forEach(stop => {
          expression.push(stop.value, stop.color);
        });
        return expression;
      } else if (type === 'categorical') {
        const expression = ['match', ['get', field]];
        stops.forEach(stop => {
          expression.push(stop.value, stop.color);
        });
        expression.push('#e5e5e5');
        return expression;
      }
      
      return '#3558a2';
    },
    buildPopupContent(properties) {
      const countryName = properties.country_name || properties.HOME || properties.Importateur || properties.NAME;
      
      let content = `
        <div style="padding: 12px; min-width: 280px;">
          <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 700; color: #000091;">
            ${countryName}
          </h3>
      `;
      
      this.popupConfig.fields.forEach((fieldConfig, index) => {
        const value = properties[fieldConfig.key];
        let displayValue = value;
        
        if (fieldConfig.format === 'percentage') {
          displayValue = `${(value * 100).toFixed(1)}%`;
        } else if (fieldConfig.format === 'number') {
          displayValue = value.toLocaleString('fr-FR', { maximumFractionDigits: 0 });
        } else if (fieldConfig.format === 'euro') {
          displayValue = `${value.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €`;
        } else if (fieldConfig.format === 'text') {
          displayValue = value;
        }
        
        const marginBottom = index === this.popupConfig.fields.length - 1 ? '0' : '8px';
        const isHighlight = fieldConfig.highlight;
        
        content += `
          <div style="margin-bottom: ${marginBottom};">
            <strong style="color: #161616;">${fieldConfig.label}:</strong>
            <div style="color: ${isHighlight ? this.getColorForValue(value, this.colorScale) : '#3a3a3a'}; font-size: ${isHighlight ? '16px' : '14px'}; font-weight: ${isHighlight ? '700' : '400'};">
              ${displayValue}
            </div>
          </div>
        `;
      });
      
      content += `</div>`;
      return content;
    },
    getColorForValue(value, colorScale) {
      if (colorScale.type === 'interpolate') {
        const stops = colorScale.stops;
        for (let i = 0; i < stops.length - 1; i++) {
          if (value >= stops[i].value && value < stops[i + 1].value) {
            return stops[i].color;
          }
        }
        return stops[stops.length - 1].color;
      } else if (colorScale.type === 'categorical') {
        const stop = colorScale.stops.find(s => s.value === value);
        return stop ? stop.color : '#666666';
      }
      return '#3a3a3a';
    }
  }
};
</script>

<style scoped>
.map-wrapper {
  width: 100%;
  height: 100%;
  min-height: 700px;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}

.map-header {
  background-color: #f6f6f6;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e5e5;
}

.map-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 700;
  color: #000091;
}

.map-note {
  margin: 0;
  font-size: 13px;
  color: #666666;
  font-style: italic;
}

.map-container {
  width: 100%;
  flex: 1;
  min-height: 600px;
}

.legend {
  position: absolute;
  bottom: 30px;
  left: 10px;
  background-color: white;
  padding: 12px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  font-size: 13px;
  z-index: 1;
  min-width: 180px;
}

.legend-title {
  font-weight: 700;
  margin-bottom: 8px;
  color: #000091;
  font-size: 14px;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}

.legend-item:last-child {
  margin-bottom: 0;
}

.legend-color {
  width: 24px;
  height: 18px;
  border-radius: 2px;
  margin-right: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.legend-label {
  color: #3a3a3a;
  font-size: 12px;
}
</style>
