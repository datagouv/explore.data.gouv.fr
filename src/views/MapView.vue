<template>
  <div>
    <div class="tooltip" :style="{top:tooltip.top,left:tooltip.left, display:tooltip.display}">
        <div class="tooltip-title">{{ tooltip.titre }}</div>
        <div class="tooltip-value">{{ tooltip.valeur }} {{ tooltip.legend }}</div>
    </div>
    <div class="map-wrap">
      <div class="menu">
        <p>Choisissez le carburant</p>
        <div class="fr-fieldset__content">
            <div @click="changeMap('Gazole')" class="fr-radio-group">
                <input type="radio" id="radio-needfilter-1" name="radio-needfilter" checked>
                <label class="fr-label" for="radio-needfilter-1">Gazole
                </label>
            </div>
            <div @click="changeMap('SP95')" class="fr-radio-group">
                <input type="radio" id="radio-needfilter-2" name="radio-needfilter">
                <label class="fr-label" for="radio-needfilter-2">SP95
                </label>
            </div>
            <div @click="changeMap('SP98')" class="fr-radio-group">
                <input type="radio" id="radio-needfilter-3" name="radio-needfilter">
                <label class="fr-label" for="radio-needfilter-3">SP98
                </label>
            </div>
        </div>
        <br />
        <div class="input-adresse">
            <label class="fr-label" for="text-input-text">Rechercher via une adresse</label>
            <input class="fr-input fr-mb-2w" type="text" v-model="searchAdress" id="text-input-text" name="text-input-text" />
            <div class="fr-grid-row fr-grid-row--center">
                <button class="fr-btn" @click="getAdresses()">
                Rechercher
                </button>
            </div>
        </div>
      </div>
      <div id="map" class="map" ref="mapContainer"></div>
    </div>
  </div>
</template>

<script>
import { Map } from 'maplibre-gl';
import { markRaw } from 'vue';
import styleVector from '../static/json/vector2.json'
import ruptureImage from '../static/images/forbidden.png';
import prixImage from '../static/images/green.png';
import SyntheseGazole from '../static/json/Gazole_ruptures_synthese_dep.json'
import SynthesePrixGazole from '../static/json/Gazole_prix_mediane_dep.json'
import RuptureGazole from '../static/json/Gazole_ruptures.json'
import PrixGazole from '../static/json/Gazole_prix.json'

import SyntheseSP95 from '../static/json/SP95_ruptures_synthese_dep.json'
import SynthesePrixSP95 from '../static/json/SP95_prix_mediane_dep.json'
import RuptureSP95 from '../static/json/SP95_ruptures.json'
import PrixSP95 from '../static/json/SP95_prix.json'

import SyntheseSP98 from '../static/json/SP98_ruptures_synthese_dep.json'
import SynthesePrixSP98 from '../static/json/SP98_prix_mediane_dep.json'
import RuptureSP98 from '../static/json/SP98_ruptures.json'
import PrixSP98 from '../static/json/SP98_prix.json'

import CenterDeps from '../static/json/centers_deps.json'
import * as d3 from 'd3-scale'

export default {
  name: 'MapView',
  components: {Map, markRaw},
  data() {
    return {
      map: Object,
      tooltip: {
        top: '100px',
        left: '300px',
        display: 'none',
        valeur: '',
        titre: '',
        legend: '',
      },
      dataChloropleth: null,
      rupturePoints: null,
      prixPoints: null,
      matchExpression: null,
      searchAdress: null,
      results: null
    }
  },
  computed: {
  },
  mounted() {
    this.dataChloropleth = SyntheseGazole
    this.matchExpression = ['match', ['get', 'code']]
    const initialState = { lng: 2, lat: 46.3, zoom: 4.8 };
    this.map = markRaw(new Map({
      container: this.$refs["mapContainer"],
      style: styleVector,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom
    }));

    this.changeMap("Gazole")

    


  },
  created() {
  },
  methods: {
    getAdresses(){
        console.log('https://api-adresse.data.gouv.fr/search/?q=' + this.searchAdress)
        fetch('https://api-adresse.data.gouv.fr/search/?q=' + this.searchAdress.replace(' ', '%20'))
        .then((response) => {
            return response.json()
        })
        .then((data) => {
          this.moveTo(data.features[0].geometry.coordinates)
        })
    },
    moveTo(coordinates){
      this.map.flyTo({
        center: coordinates,
        zoom: 13,
      });
    },
    changeMap(fuel){

      if (fuel == "Gazole") {
        this.dataChloropleth = SyntheseGazole
        this.rupturePoints = RuptureGazole
        this.prixPoints = PrixGazole
        this.tooltip.legend = '% stations en ruptures de Gazole'
      }
      if (fuel == "SP95") {
        this.dataChloropleth = SyntheseSP95
        this.rupturePoints = RuptureSP95
        this.prixPoints = PrixSP95
        this.tooltip.legend = '% stations en ruptures de SP95'
      }
      if (fuel == "SP98") {
        this.dataChloropleth = SyntheseSP98
        this.rupturePoints = RuptureSP98
        this.prixPoints = PrixSP98
        this.tooltip.legend = '% stations en ruptures de SP98'
      }

      this.matchExpression = ['match', ['get', 'code']]
      const initialState = { lng: 2, lat: 46.3, zoom: 4.8 };
      this.map = markRaw(new Map({
        container: this.$refs["mapContainer"],
        style: styleVector,
        center: [initialState.lng, initialState.lat],
        zoom: initialState.zoom
      }));
      const valStat = []
      this.dataChloropleth.forEach((d) => {
        if (d.valeur != null) {
          valStat.push(parseFloat(d.valeur))
        }
      })

      let scaleMin = Math.min.apply(null, valStat)
      let scaleMax = Math.max.apply(null, valStat)

      scaleMin = 0
      scaleMax = 100
      
      let source_layer = 'departements'
      let name_source = 'decoupage-administratif'
      console.log(scaleMin, scaleMax)
      let x = d3.scaleLinear().domain([scaleMin, scaleMax]).range(['#ffc700', '#715845'])

      function toHex(int) {
          var hex = int.toString(16);
          return hex.length == 1 ? "0" + hex : hex;
      }

      function parseColor(color) {
          var arr=[]; color.replace(/[\d+\.]+/g, function(v) { arr.push(parseFloat(v)); });
          return {
              hex: "#" + arr.slice(0, 3).map(toHex).join(""),
              opacity: arr.length == 4 ? arr[3] : 1
          };
      }

      const values = {}

      this.dataChloropleth.forEach((d) => {
        if (d.valeur != null) {
          let color = x(parseFloat(d.valeur))
          this.matchExpression.push(d['dep'], color);
          values[d["dep"]] = d.valeur
        } else {
          this.matchExpression.push(d['dep'], 'rgba(0, 0, 0, 0)');
        }
      })


      this.matchExpression.push('rgba(0, 0, 0, 0)');
      this.map.on('load', (m) => {
          let self = this
          let config_layer = {
            'id': `${source_layer}_category_poly`,
            'type': 'fill',
            'source': name_source,
            'source-layer': source_layer,
            'paint': {
              'fill-color': self.matchExpression,
              'fill-opacity': 0.8,
            },
            maxzoom:7,

          }
          let config_layer_line = {
            'id': `${source_layer}_category_line`,
            'type': 'line',
            'source': name_source,
            'source-layer': source_layer,
            'layout': {
              'line-cap': 'round',
              'line-join': 'round'
            },
            'paint': {
              'line-opacity': 0.6,
              'line-color': 'rgb(100,100,100)',
              'line-width': 0.1
            }
          }
          self.map.addLayer(config_layer);
          self.map.addLayer(config_layer_line);


          self.map.on('mousemove', function (e) {
            var features = self.map.queryRenderedFeatures(e.point, {
              layers: [ `${source_layer}_category_poly`]
            });
            if (features.length > 0) {
              self.tooltip.top = (document.getElementById('map').getBoundingClientRect().y + e.point.y + 10).toString() + 'px'
              self.tooltip.left = (document.getElementById('map').getBoundingClientRect().x + e.point.x + 10).toString() + 'px'
              self.tooltip.display = 'block'
              self.tooltip.valeur = values[features[0].properties.code]
              console.log(features[0].properties.nom)
              self.tooltip.titre = features[0].properties.nom
            } else {
              self.tooltip.display = 'none'
            }
          });

          self.map.on('click', `${source_layer}_category_poly`, (e) => {
            self.map.flyTo({
              center: CenterDeps[e.features[0].properties.code].coordinates,
              zoom: 8,
            });
            self.tooltip.display = 'none'
          });
      });

      this.map.on('load', (m) => {
          let self = this
          self.map.loadImage(prixImage, function (error, image) {
              if (error) throw error;
              self.map.addImage('prix_icon', image);

              self.map.addSource('prix_points', {
                  type: 'geojson',
                  data: self.prixPoints
              });

              self.map.addLayer({
                  id: 'Prix_Gazole',
                  type: 'symbol',
                  source: 'prix_points',
                  layout: {
                      'icon-image': 'prix_icon',
                      'icon-size': 0.02
                  },
                  minzoom:7,
              });
          });
      });

      this.map.on('load', (m) => {
          let self = this
          self.map.loadImage(ruptureImage, function (error, image) {
              if (error) throw error;
              self.map.addImage('rupture_icon', image);

              self.map.addSource('rupture_points', {
                  type: 'geojson',
                  data: self.rupturePoints
              });

              self.map.addLayer({
                  id: 'Rupture_Gazole',
                  type: 'symbol',
                  source: 'rupture_points',
                  layout: {
                      'icon-image': 'rupture_icon',
                      'icon-size': 0.02
                  },
                  minzoom:7,
              });
          });
      });
    }
  },
  watch: {
  }
}
</script>

<style scoped>
@import '~maplibre-gl/dist/maplibre-gl.css';

.input-adresse{
    width: 350px;
}

.map-wrap {
  width: 100%;
  height: calc(100vh - 77px); /* calculate height of the screen minus the heading */
  display: flex;
}

.menu{
  min-width: 400px;
  height: 100%;
  padding-left: 20px;
  padding-top: 20px;
}

.map {
  width: 100%;
  height: 100%;
}

.watermark {
  position: absolute;
  left: 10px;
  bottom: 10px;
  z-index: 999;
}

.tooltip{
  position: fixed;
  max-width: 150px;
  height: 100px;
  background-color: white;
  z-index: 999;
  border-radius: 5px;
}

.tooltip-title{
  border-radius: 5px;
  background-color: #f7f6f3;
  color: #9a9a9a;
  padding: 5px;
  font-size: 14px;
}

.tooltip-value{
  font-size: 12px;
  padding: 5px;
}


</style>