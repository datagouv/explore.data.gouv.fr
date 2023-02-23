<template>
    <div class="choroMap" ref="mapContainer">ChoroMap</div>
</template>

<script>

import appStore from '@/apps/dvf/store'

import { Map } from 'maplibre-gl';

import { markRaw } from 'vue';
import styleVector from '@/apps/dvf/assets/json/vector-dvf.json'
import testDataset from '@/apps/dvf/assets/json/epcis.json'
import testDataset2 from '@/apps/dvf/assets/json/communes44.json'
import testDataset3 from '@/apps/dvf/assets/json/sections44109.json'
import CenterDeps from '@/apps/dvf/assets/json/centers_deps.json'

import * as d3 from 'd3-scale'


export default {
  name: 'ChoroMap',
  components: {Map, markRaw},
  data() {
    return {
      map: Object,
      dataEpci: null,
      actualDep: null,
      actualEpci: null,
      actualSection: null,
    }
  },
  computed: {
    lng:function(){
      return appStore.state.map.lng
    },
    lat:function(){
      return appStore.state.map.lat
    },
    zoom:function(){
      return appStore.state.map.zoom
    },
    zoomLevel:function(){
      return appStore.state.map.zoomLevel
    },
  },
  mounted() {
      
    this.dataEpci = testDataset
    this.dataCommunes = testDataset2
    this.dataSections = testDataset3
    
    let { x, scaleMin, scaleMax } = this.calculateColor(this.dataEpci, 'valeur')
    let matchExpression = this.getMatchExpression(this.dataEpci, x, 'code', 'code')

    // Create map
    this.map = markRaw(new Map({
      container: this.$refs.mapContainer,
      style: styleVector,
      center: [this.lng, this.lat],
      zoom: this.zoomLevel
    }));

    // On map load, add its layers
    this.map.on('load', (m) => {
      
      //parcelle fill
      const parcellesFillLayer = {
        id: `parcelles_fill`,
        type: "fill",
        source: "cadastre",
        filter: ["has", "dvf"],
        "source-layer": "parcelles",
        minzoom: 14,
        maxzoom: 24,
        paint: {
          "fill-color": "rgba(0, 0, 255, 0.2)",
        },
      };
      //parcelle line
      const parcellesLineLayer = {
        id: `parcelles_line`,
        type: "line",
        source: "cadastre",
        filter: ["has", "dvf"],
        "source-layer": "parcelles",
        minzoom: 14,
        maxzoom: 24,
        layout: {
          "line-cap": "butt",
        },
        paint: {
          "line-opacity": 0.6,
          "line-color": "rgb(180,180,180)",
          "line-width": 0.1,
        },
      };
      this.map.addLayer(parcellesFillLayer);
      this.map.addLayer(parcellesLineLayer);  

      // communes fill
      const sectionsFillLayer = {
        'id': `sections_fill`,
        'type': 'fill',
        'source': 'cadastre',
        'source-layer': 'sections',
        'paint': {
          'fill-color': "rgba(0,0,255,1)",
          'fill-opacity': 0.8,
        },
        minzoom: 12,
        maxzoom:15,
      }

      // communes fill
      const communesFillLayer = {
        'id': `communes_fill`,
        'type': 'fill',
        'source': 'decoupage-administratif-com',
        'source-layer': 'communes',
        'paint': {
          'fill-color': "rgba(0,0,0,0)",
          'fill-opacity': 0.8,
        },
        minzoom: 10,
        maxzoom:12,
      }

      // epci fill
      const epcisFillLayer = {
        'id': `epcis_fill`,
        'type': 'fill',
        'source': 'decoupage-administratif',
        'source-layer': 'epcis',
        'paint': {
          'fill-color': matchExpression,
          'fill-opacity': 0.8,
        },
        maxzoom:11,
      }

      const departementsLineLayer = {
        'id': `departements_line`,
        'type': 'line',
        'source': 'decoupage-administratif-dep',
        'source-layer': 'departements',
        'layout': {
          'line-cap': 'round',
          'line-join': 'round'
        },
        'paint': {
          'line-opacity': 0.3,
          'line-color': 'rgb(0,0,0)',
          'line-width': 0.1
        }
      }

      const departementsFillLayer = {
        'id': `departements_fill`,
        'type': 'fill',
        'source': 'decoupage-administratif-dep',
        'source-layer': 'departements',
        'paint': {
          'fill-opacity': 0,
        },
        maxzoom: 9,
      }
      this.map.addLayer(epcisFillLayer);
      this.map.addLayer(communesFillLayer);
      this.map.addLayer(sectionsFillLayer);
      this.map.addLayer(departementsLineLayer);
      this.map.addLayer(departementsFillLayer);

      this.map.on('click', 'departements_fill', (e) => {
        let depId = e.features[0]["properties"]["code"]
        if (this.actualDep != depId) {
          if (this.map.getZoom() <= 8) {
            this.actualDep = e.features[0].properties.code;
            this.map.flyTo({
              center: CenterDeps[e.features[0].properties.code].coordinates,
              zoom: 8,
            });
            this.manageEpci()
          }
        } else {
          this.zoomEpci(e.lngLat)
        }
      });


      this.map.on('click', 'epcis_fill', (e) => {
        let epciId = e.features[0]["properties"]["code"]
        if (this.actualEpci != epciId) {
          if (this.map.getZoom() <= 10 && this.map.getZoom() > 8) {
            this.actualEpci = e.features[0].properties.code;
            // Go to EPCI center (request geo api)
            // this.map.flyTo({
            //   center: [2,34],
            //   zoom: 10,
            // });
            this.manageEpci()
          }
        } else {
          this.zoomSection(e.lngLat)
        }
      });


      this.map.on('click', 'sections_fill', (e) => {
        let sectionId = e.features[0]["properties"]["id"]
        if (this.actualSection != sectionId) {
          if (this.map.getZoom() <= 12 && this.map.getZoom() > 10) {
            
            this.actualSection = e.features[0].properties.id;
            
            this.map.flyTo({
              center: [e.lngLat.lng, e.lngLat.lat],
              zoom: 15.1,
            });
          }
        } else {
        }
      });

      
      this.map.on('mousemove', 'departements_fill', (e) => {
        let depId = e.features[0]["properties"]["code"]
        let matchExpression = 0
        if(this.actualDep != depId) { 
          matchExpression = ['match', ['get', 'code']]
          matchExpression.push(depId, 0.4); 
          matchExpression.push(0);
        }
        this.map.setPaintProperty("departements_fill", "fill-opacity", matchExpression)
      });

      this.map.on('mouseleave', 'departements_fill', (e) => {
        this.map.setPaintProperty("departements_fill", "fill-opacity", 0)
      });

    });
  },
  methods: {
    zoomSection(lnglat){
      this.map.flyTo({
        center: [lnglat.lng, lnglat.lat],
        zoom: 12,
      });
      this.manageSections()
    },
    zoomEpci(lnglat){
      fetch('https://geo.api.gouv.fr/communes?lon=' + parseFloat(lnglat.lng) + '&lat=' + parseFloat(lnglat.lat))
      .then((response) => {
          return response.json()
      })
      .then((data) => {
        if (data.length > 0) {
          this.actualEpci = data[0]["codeEpci"]
          fetch('https://geo.api.gouv.fr/epcis?code=' + data[0]["codeEpci"] + '&fields=centre')
          .then((response2) => {
            return response2.json()
          })
          .then((data2) => {
            this.map.flyTo({
              center: data2[0]["centre"]["coordinates"],
              zoom: 10,
            });
            this.manageCommunes()
          });
        }
      });
    },
    getMatchExpression(data, x, propertyData, propertyTile){
      let matchExpression = ['match', ['get', propertyTile]]
      const values = {}
      data.forEach((d) => {
        if (d.valeur != null) {
          let color = x(parseFloat(d.valeur))
          matchExpression.push(d[propertyData], color);
          values[d["code"]] = d.valeur
        } else {
          matchExpression.push(d[propertyData], 'rgba(0, 0, 0, 0)');
        }
      })
      matchExpression.push('rgba(0, 0, 0, 0)');
      return matchExpression
    },
    calculateColor(data, valProperty){
      data = testDataset
      
      const valStat = []
      data.forEach((d) => {
        if (d[valProperty] != null) {
          valStat.push(parseFloat(d[valProperty]))
        }
      })
      let scaleMin = Math.min.apply(null, valStat)
      let scaleMax = Math.max.apply(null, valStat)
      scaleMin = 0
      let pivot = 50
      scaleMax = 100

      let x = d3.scaleLinear().domain([scaleMin, pivot, scaleMax]).range(['#CC000A', '#FFF64E', '#028758'])

      return { x, scaleMin, scaleMax }
    },
    manageEpci(){
      let data = this.dataEpci.filter(d => d.parent == this.actualDep)
      let { x, scaleMin, scaleMax } = this.calculateColor(data, 'valeur')
      let matchExpression = this.getMatchExpression(data, x, 'code', 'code')

      this.map.setPaintProperty("departements_fill", "fill-opacity", 0)
      this.map.setPaintProperty("epcis_fill", "fill-color", matchExpression)
    },
    manageCommunes(){
      let data = this.dataCommunes.filter(d => d.parent == this.actualEpci)
      let { x, scaleMin, scaleMax } = this.calculateColor(data, 'valeur')
      let matchExpression = this.getMatchExpression(data, x, 'code', 'code')

      this.map.setPaintProperty("epcis_fill", "fill-opacity", 0)
      this.map.setPaintProperty("communes_fill", "fill-color", matchExpression)
    },
    manageSections(){
      let data = this.dataSections
      let { x, scaleMin, scaleMax } = this.calculateColor(data, 'valeur')
      let matchExpression = this.getMatchExpression(data, x, 'code', 'id')
      this.map.setPaintProperty("communes_fill", "fill-opacity", 0)
      this.map.setPaintProperty("sections_fill", "fill-color", matchExpression)

    }
  },
  watch: {
  }
}

</script>

<style scoped>

  @import '~maplibre-gl/dist/maplibre-gl.css';

  .choroMap{
    width: 75%;
    display: inline-block;
    min-height: 100%;
  }

</style>