<template>
  <div class="choroMap">
    <search-bar></search-bar>
    <filters-box></filters-box>
    <div ref="mapTooltip" class="map_tooltip" v-show="tooltip.visibility=='visible'" :style="{top:tooltip.top,left:tooltip.left}">
      <div class="tooltip_body">
        {{ tooltip.place }}
        <div class="tooltip_place">{{tooltip.value}} €/m²</div>
      </div>
    </div>
    <div class="map_container" ref="mapContainer"></div>
    <div class="leg_container">
      <div class="color_blocks">
        <span class="leg_title">Prix au m²</span>
        <span class="leg_borne min">< {{legMin}} €</span>
        <span class="leg_borne pivot">{{legPivot}} €</span>
        <span class="leg_borne max">> {{legMax}} €</span>
      </div>
    </div>
  </div>
</template>

<script>

import appStore from '@/apps/dvf/store'
import SearchBar from '@/apps/dvf/components/SearchBar'
import FiltersBox from '@/apps/dvf/components/FiltersBox'

import { Map } from 'maplibre-gl';

import { markRaw } from 'vue';
import styleVector from '@/apps/dvf/assets/json/vector-dvf.json'
import CenterDeps from '@/apps/dvf/assets/json/centers_deps.json'

import * as d3 from 'd3-scale'


export default {
  name: 'ChoroMap',
  components: {Map, markRaw, SearchBar, FiltersBox},
  data() {
    return {
      map: Object,
      dataChloropleth: null,
      dataEpci: null,
      legMin:0,
      legMax:0,
      legPivot:0,
      tooltip: {
        top: '0px',
        left: '0px',
        display: 'block',
        visibility: '',
        value: 0,
        date: '',
        place: 'tttt'
      },
      lastCodeHovered:'',
      fetching:false,
      fetchedCommunes:[],
      mappingPropertiesPrix: {
        "tous": "moy_prix_m2_appart_maison_5ans",
        "maison": "moy_prix_m2_maison_5ans",
        "appartement": "moy_prix_m2_appart_5ans",
        "local": "moy_prix_m2_local_5ans",
      },
      mappingPropertiesFillLayer: {
        "fra": "epcis_fill",
        "departement": "communes_fill",
        "commune": "sections_fill"
      },
      actualPropertyPrix: "moy_prix_m2_appart_maison_5ans",
      mousePosition: {
        dep: {
          code: null,
          nom: null,
        },
        com: {
          code: null,
          nom: null,
        },
        section: {
          code: null,
          nom: null,
        },
        parcelle: {
          code: null,
          nom: null,
        },
      }
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
    dep:function(){
      return appStore.state.location.dep
    },
    com:function(){
      return appStore.state.location.com
    },
    section:function(){
      return appStore.state.location.section
    },
    parcelle:function(){
      return appStore.state.location.parcelle
    },
    level:function(){
      return appStore.state.location.level
    },
    activeFilter:function(){
      return appStore.state.activeFilter
    },
    searchBarCoordinates:function(){
      return appStore.state.searchBarCoordinates
    },

  },
  mounted() {
    // Au load de la page, on récupère les stats au niveau EPCI pour l'affichage carte
    fetch('http://dvf.dataeng.etalab.studio/epci')
    .then((response) => {
        return response.json()
    })
    .then((data) => {
      this.dataChloropleth = data["data"]
      this.actualPropertyPrix = this.mappingPropertiesPrix[this.activeFilter]
      let matchExpression = this.changeChloroplethColors('code_geo', this.actualPropertyPrix, 'code')
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


        // sections fill
        const sectionsFillLayer = {
          'id': `sections_fill`,
          'type': 'fill',
          'source': 'cadastre',
          'source-layer': 'sections',
          'paint': {
            'fill-color': "rgba(0,0,0,0)",
            'fill-opacity': 0.8,
          },
          minzoom: 11,
          maxzoom:15,
        }
        this.map.addLayer(sectionsFillLayer)

        const sectionsLineLayer = {
          'id': `sections_line`,
          'type': 'line',
          'source': 'cadastre',
          'source-layer': 'sections',
          'layout': {
            'line-cap': 'round',
            'line-join': 'round'
          },
          'paint': {
            'line-opacity': 0.3,
            'line-color': 'rgb(0,0,0)',
            'line-width': 0.1
          },
        }
        this.map.addLayer(sectionsLineLayer)


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
          maxzoom: 12,
        }
        this.map.addLayer(communesFillLayer)
        

        // communes fill
        const communesFillLayer2 = {
          'id': `communes_fill2`,
          'type': 'fill',
          'source': 'decoupage-administratif-com',
          'source-layer': 'communes',
          'paint': {
            'fill-opacity': 0,
          },
          minzoom: 12,
          maxzoom:15,
        }
        this.map.addLayer(communesFillLayer2)
        
        const communesLineLayer = {
          'id': `communes_line`,
          'type': 'line',
          'source': 'decoupage-administratif-com',
          'source-layer': 'communes',
          'layout': {
            'line-cap': 'round',
            'line-join': 'round'
          },
          'paint': {
            'line-opacity': 0.3,
            'line-color': 'rgb(0,0,0)',
            'line-width': 0.1
          },
        }
        this.map.addLayer(communesLineLayer)

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
        }
        const epcisLineLayer = {
          'id': `epcis_line`,
          'type': 'line',
          'source': 'decoupage-administratif',
          'source-layer': 'epcis',
          'layout': {
            'line-cap': 'round',
            'line-join': 'round'
          },
          'paint': {
            'line-opacity': 0.5,
            'line-color': 'rgb(0,0,0)',
            'line-width': 0.5
          },
        }

        // const departementsLineLayer = {
        //   'id': `departements_line`,
        //   'type': 'line',
        //   'source': 'decoupage-administratif-dep',
        //   'source-layer': 'departements',
        //   'layout': {
        //     'line-cap': 'round',
        //     'line-join': 'round'
        //   },
        //   'paint': {
        //     'line-opacity': 0.3,
        //     'line-color': 'rgb(0,0,0)',
        //     'line-width': 0.3
        //   }
        // }

        const departementsFillLayer = {
          'id': `departements_fill`,
          'type': 'fill',
          'source': 'decoupage-administratif-dep',
          'source-layer': 'departements',
          'paint': {
            'fill-opacity': 0,
          },
        }

        this.map.addLayer(epcisFillLayer);
        this.map.addLayer(departementsFillLayer);
        this.map.addLayer(epcisLineLayer);

        this.map.on('click', 'parcelles_fill', (e) => {
          let parcelleId = e.features[0]["properties"]["id"]
          appStore.commit("changeLocationParcelle", parcelleId)
          appStore.commit("changeLocationLevel", "parcelle")
        });

        this.map.on('click', 'sections_fill', (e) => {
          let sectionId = e.features[0]["properties"]["id"]
          appStore.commit("changeLocationSection", sectionId)
          appStore.commit("changeLocationLevel", "section")
          if (this.map.getZoom() <= 12) {
            this.map.flyTo({
              center: [e.lngLat.lng, e.lngLat.lat],
              zoom: 15,
            });
            this.getDvfCurrentSection(e.features[0]["properties"]["id"])
          }
        });

        this.map.on('click', 'communes_fill', (e) => {
          let comId = e.features[0]["properties"]["code"]
          // if (comId.startsWith("750")) {
          //   comId = comId.replace("750", "751")
          // }
          if(comId.substring(0,2) == this.dep){
            if (this.map.getZoom() <= 12 && comId) {
              if (comId.substring(0,2) === "75") {
                appStore.commit("changeLocationLevel", "commune")
                appStore.commit("changeLocationLabelCom", "Paris")
                this.map.flyTo({
                  center: [e.lngLat.lng, e.lngLat.lat],
                  zoom: 12,
                });
                this.displaySections("75056")
              } else if ((comId.substring(0,4) === "6938") || (comId == "69123")) {
                appStore.commit("changeLocationLevel", "commune")
                appStore.commit("changeLocationLabelCom", "Lyon")
                this.map.flyTo({
                  center: [e.lngLat.lng, e.lngLat.lat],
                  zoom: 12,
                });
                this.displaySections("69123")

              } else if ((comId.substring(0,4) === "1320") || (comId.substring(0,4) === "1321") || (comId == "13055")) {
                appStore.commit("changeLocationLevel", "commune")
                appStore.commit("changeLocationLabelCom", "Marseille")
                this.map.flyTo({
                  center: [e.lngLat.lng, e.lngLat.lat],
                  zoom: 12,
                });
                this.displaySections("13055")

              } else {
                fetch('https://geo.api.gouv.fr/communes?code=' + comId + '&fields=centre')
                  .then((response) => {
                      return response.json()
                  })
                  .then((data) => {
                    appStore.commit("changeLocationLevel", "commune")
                    appStore.commit("changeLocationLabelCom", data[0]["nom"])
                    this.map.flyTo({
                      center: data[0].centre.coordinates,
                      zoom: 12,
                    });
                    this.displaySections(comId)
                  });
              }
            }
          }
        });

        this.map.on('click', 'departements_fill', (e) => {
          let depId = e.features[0]["properties"]["code"]
          if (this.dep != depId) {
            if ((this.map.getZoom() <= 9) | (this.level === "departement")) {
              this.map.flyTo({
                center: CenterDeps[e.features[0].properties.code].coordinates,
                zoom: 9,
              });
              appStore.commit("changeLocationDep",e.features[0].properties.code)
              appStore.commit("changeLocationLabelDep",e.features[0].properties.nom)
              appStore.commit("changeLocationLevel", "departement")
              this.displayCommunes(this.dep)
            }
          }
        });

        this.map.on('mousemove', 'departements_fill', (e) => {
          let depId = e.features[0]["properties"]["code"]
          let matchExpression = 0
          if(this.dep != depId) { 
            if (this.level == "fra"){
              this.fetchTooltipData("departement",depId)
              this.tooltip.place = e.features[0]["properties"]["nom"]
            }
            matchExpression = ['match', ['get', 'code']]
            matchExpression.push(depId, 0.4); 
            matchExpression.push(0);
          }
          this.map.setPaintProperty("departements_fill", "fill-opacity", matchExpression)
          this.displayTooltip(e)
          this.mousePosition.dep.code = depId
          this.mousePosition.dep.nom = e.features[0]["properties"]["nom"]
        });

        this.map.on('mouseleave', 'departements_fill', (e) => {
          this.hideTooltip()
        });

        this.map.on('mousemove', 'communes_fill2', (e) => {
          let comId = e.features[0]["properties"]["code"]
          let matchExpression = 0
          this.fetchTooltipData("commune",comId)
          if(this.com != comId) { 
            matchExpression = ['match', ['get', 'code']]
            matchExpression.push(comId, 0.4); 
            matchExpression.push(0);
          }
          this.map.setPaintProperty("communes_fill2", "fill-opacity", matchExpression)
        });

        this.map.on('click', 'communes_fill2', (e) => {
          let comId = e.features[0]["properties"]["code"]
          if (this.com != comId) {
            if (this.map.getZoom() <= 12) {
              appStore.commit("changeLocationCom", comId)
              fetch('https://geo.api.gouv.fr/communes?code=' + comId + '&fields=centre')
              .then((response) => {
                  return response.json()
              })
              .then((data) => {
                appStore.commit("changeLocationLevel", "commune")
                this.map.flyTo({
                  center: data[0].centre.coordinates,
                  zoom: 12,
                });
                this.displaySections(comId)
              });
            }
          }
        });

        this.map.on('mousemove', 'communes_fill', (e) => {
          let comId = e.features[0]["properties"]["code"] 
          if (this.level == "departement"){         
            this.fetchTooltipData("commune",comId)
          }
          if(comId != this.com && comId.substring(0,2) == this.dep){
            if (this.level == "departement"){
              this.tooltip.place = e.features[0]["properties"]["nom"]
            }    
            appStore.commit("changeLocationCom", comId)
            this.mousePosition.com.code = comId
            this.mousePosition.com.nom = e.features[0]["properties"]["nom"]
          }
        });
      });

      this.map.on('zoom', (m) => {
        appStore.commit("changeZoomLevel",this.map.getZoom())
      });

      // this.map.on('click', (e) => {
      //   // Set `bbox` as 5px reactangle area around clicked point.
      //   const bbox = [
      //   [e.point.x - 5, e.point.y - 5],
      //   [e.point.x + 5, e.point.y + 5]
      //   ];
      //   console.log(bbox)
      //   console.log(this.map.queryRenderedFeatures(bbox))
      //   // Find features intersecting the bounding box.
      //   const selectedFeatures = this.map.queryRenderedFeatures(bbox, {
      //     layers: ['departements_fill']
      //   });
      //   console.log(selectedFeatures)
      //   const fips = selectedFeatures.map(
      //     (feature) => feature.properties.FIPS
      //   );
      //   console.log(fips)
      // });

    })
  },
  methods: {
    getDvfCurrentSection(id){
      console.log(id)
      // call api mutations
    },
    changeChloroplethColors(property_code_geo, property_value, property_tile_code_geo){      
      let list_obj = []
      let dataObj = []
      this.dataChloropleth.forEach((d) =>{
        if(!list_obj.includes(d[property_code_geo])){
          list_obj.push(d[property_code_geo])
          dataObj.push(d)
        }
      });

      let { x, scaleMin, scaleMax } = this.calculateColor(dataObj, property_value)
      let matchExpression = this.getMatchExpressionStart(dataObj, x, property_value, property_code_geo, property_tile_code_geo)
      return matchExpression
    },
    getMatchExpressionLine(data, propertyCodeData, propertyTile){
      let matchExpressionOpacity = ['match', ['get', propertyTile]]
      let matchExpressionColor = ['match', ['get', propertyTile]]
      let matchExpressionLineWidth = ['match', ['get', propertyTile]]
      data.forEach((d) => {
        matchExpressionOpacity.push(d[propertyCodeData], 1);
        matchExpressionColor.push(d[propertyCodeData], 'rgb(255,255,255)');
        matchExpressionLineWidth.push(d[propertyCodeData], 2);
      })
      matchExpressionOpacity.push(0.3);
      matchExpressionColor.push('rgb(0,0,0)');
      matchExpressionLineWidth.push(0.1);
      return { matchExpressionOpacity, matchExpressionColor, matchExpressionLineWidth }

    },
    getMatchExpressionStart(data, x, propertyValueData, propertyCodeData, propertyTile){
      let matchExpression = ['match', ['get', propertyTile]]
      data.forEach((d) => {
        if (d[propertyValueData] != null) {
          let color = x(parseFloat(d[propertyValueData]))
          matchExpression.push(d[propertyCodeData], color);
        } else {
          matchExpression.push(d[propertyCodeData], 'rgba(100, 100, 100, 0.6)');
        }
      })
      matchExpression.push('rgba(100, 100, 100, 0.1)');
      return matchExpression
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
          matchExpression.push(d[propertyData], 'rgba(255, 255, 255, 1)');
        }
      })
      matchExpression.push('rgba(255, 255, 255, 1)');
      return matchExpression
    },
    median(arr){
      const mid = Math.floor(arr.length / 2),
      nums = [...arr].sort((a, b) => a - b);
      return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
    },
    calculateColor(data, valProperty){
      const valStat = []
      data.forEach((d) => {
        if (d[valProperty] != null) {
          valStat.push(parseFloat(d[valProperty]))
        }
      })
      let scaleMin = Math.min.apply(null, valStat)
      let scaleMax = Math.max.apply(null, valStat)
      let pivot = this.median(valStat)

      this.legMin = Math.floor(scaleMin/100)*100
      this.legMax = Math.ceil(scaleMax/1000)*1000
      this.legPivot = Math.ceil(pivot/100)*100


      let x = d3.scaleLinear().domain([scaleMin, pivot, scaleMax]).range(['#028758', '#FFF64E', '#CC000A'])

      return { x, scaleMin, scaleMax }
    },
    displayCommunes(code){
      fetch('http://dvf.dataeng.etalab.studio/departement/' + code + '/communes')
      .then((response) => {
          return response.json()
      })
      .then((data) => {
        this.dataChloropleth = data["data"]
        let { x, scaleMin, scaleMax } = this.calculateColor(data["data"], this.actualPropertyPrix)
        let matchExpression = this.getMatchExpressionStart(data["data"], x, this.actualPropertyPrix, 'code_geo', 'code')
        this.map.setPaintProperty("departements_fill", "fill-opacity", 0)
        this.map.setPaintProperty("communes_fill", "fill-color", matchExpression)
        let { matchExpressionOpacity, matchExpressionColor, matchExpressionLineWidth } = this.getMatchExpressionLine(data["data"], 'code_geo', 'code')
        this.map.setPaintProperty("communes_line", "line-opacity", matchExpressionOpacity)
        this.map.setPaintProperty("communes_line", "line-color", matchExpressionColor)
        this.map.setPaintProperty("communes_line", "line-width", matchExpressionLineWidth)
      });
    },
    displaySections(code){
      fetch('http://dvf.dataeng.etalab.studio/commune/' + code + '/sections')
      .then((response) => {
          return response.json()
      })
      .then((data) => {
        this.dataChloropleth = data["data"]
        let { x, scaleMin, scaleMax } = this.calculateColor(data["data"], this.actualPropertyPrix)
        let matchExpression = this.getMatchExpressionStart(data["data"], x, this.actualPropertyPrix, 'code_geo', 'id')
        this.map.setPaintProperty("communes_fill2", "fill-opacity", 0)
        this.map.setPaintProperty("sections_fill", "fill-color", matchExpression)
        let { matchExpressionOpacity, matchExpressionColor, matchExpressionLineWidth } = this.getMatchExpressionLine(data["data"], 'code_geo', 'id')
        this.map.setPaintProperty("sections_line", "line-opacity", matchExpressionOpacity)
        this.map.setPaintProperty("sections_line", "line-color", matchExpressionColor)
        this.map.setPaintProperty("sections_line", "line-width", matchExpressionLineWidth)
      });
    },
    displayTooltip (e) {
      if ((this.level == "commune") || (this.level == "section") || (this.commune == "parcelle")){
        this.tooltip.visibility = 'none'
      } else {
        this.tooltip.visibility = 'visible'
      }
      //const containerRect = e.target.getBoundingClientRect()
      let tooltipX = e.point.x + 350
      let tooltipY = e.point.y + 150
      this.tooltip.top = tooltipY + 'px'
      this.tooltip.left = tooltipX + 'px'
    },
    hideTooltip () {
      this.tooltip.visibility = 'none'
    },
    fetchTooltipData(level,code){
      var self = this
      if(level == "commune" && typeof self.fetchedCommunes[code.substring(0,2)] != 'undefined'){
        var result = self.fetchedCommunes[code.substring(0,2)].find(obj => {
          return obj.code_geo === code
        })
        self.tooltip.value = Math.round(result[this.actualPropertyPrix]).toLocaleString()
      }else if(code != self.lastCodeHovered){
        this.lastCodeHovered = code
        if(this.fetching === false){
          this.fetching = true
          var url
          if(level=="commune"){
            url = "http://dvf.dataeng.etalab.studio/departement/"+code.substring(0,2)+"/communes"
          }else if(level=="section"){
            console.log("tooltip section") // Ne passe jamais
          }else{
            url = "http://dvf.dataeng.etalab.studio/" + level
          }
          fetch(url)
          .then((response) => {
              return response.json()
          })
          .then((data) => {
            if(level=="commune"){
              self.fetchedCommunes[code.substring(0,2)]=data["data"]
            }
            var result = data["data"].find(obj => {
              return obj.code_geo === code
            })
            self.tooltip.value = Math.round(result[this.actualPropertyPrix]).toLocaleString()
            self.fetching = false
          });
        }
      }
    }
  },
  watch: {
    activeFilter(){
      if(this.dataChloropleth){
        let property_tile_code_geo = "code"
        if (this.level === "commune"){
          property_tile_code_geo = "id"
        }
        this.actualPropertyPrix = this.mappingPropertiesPrix[this.activeFilter]
        let matchExpression = this.changeChloroplethColors('code_geo', this.actualPropertyPrix, property_tile_code_geo)
        this.map.setPaintProperty(this.mappingPropertiesFillLayer[this.level], "fill-color", matchExpression)
      }
    },
    searchBarCoordinates(){
      appStore.commit("changeZoomLevel",17)
      appStore.commit("changeLocationLevel", "parcelle")
      this.map.flyTo({
        center: this.searchBarCoordinates,
        zoom: 17,
      });
    },
    zoomLevel(){
      if (this.zoomLevel < 8) {
        // check if actual level is fra. 
        // If not : changelocationlevel to fra + fill epcis
        if (this.level != "fra") {
          appStore.commit("changeLocationLevel", "fra")
          this.map.setLayoutProperty("epcis_fill", "visibility", "visible")
        }
      } 
      if (this.zoomLevel >= 8 && this.zoomLevel < 11) {
        if (this.level != "departement") {
          appStore.commit("changeLocationLevel", "departement")
          this.map.setLayoutProperty("epcis_fill", "visibility", "none")
          this.map.setLayoutProperty("communes_fill", "visibility", "visible")

          appStore.commit("changeLocationDep", this.mousePosition.dep.code)
          appStore.commit("changeLocationLabelDep", this.mousePosition.dep.nom)
          appStore.commit("changeLocationLevel", "departement")
          this.displayCommunes(this.mousePosition.dep.code)
        }
        // check if actual level is departement.
        // if not : changelocationlevel to departement + fill commune
      } 
      if (this.zoomLevel >= 11 && this.zoomLevel < 15) {
        if (this.level != "commune") {
          appStore.commit("changeLocationLevel", "commune")
          this.map.setPaintProperty("departements_fill", "fill-opacity", 0)
          this.map.setLayoutProperty("epcis_fill", "visibility", "none")
          this.map.setLayoutProperty("communes_fill", "visibility", "none")
          this.map.setLayoutProperty("sections_fill", "visibility", "visible")
          appStore.commit("changeLocationCom", this.mousePosition.com.code)
          appStore.commit("changeLocationLabelCom", this.mousePosition.com.nom)
          appStore.commit("changeLocationLevel", "commune")
          this.displaySections(this.mousePosition.com.code)
        }
        // check if actual level is commune.
        // if not : changelocationlevel to commune + fill section
      } 
      if (this.zoomLevel >= 15) {
        if (this.level != "section") {
          appStore.commit("changeLocationLevel", "section")
          this.map.setLayoutProperty("departements_fill", "visibility", "none")
          this.map.setPaintProperty("departements_fill", "fill-opacity", 0)
          this.map.setLayoutProperty("epcis_fill", "visibility", "none")
          this.map.setLayoutProperty("communes_fill", "visibility", "none")
          this.map.setLayoutProperty("sections_fill", "visibility", "none")
          appStore.commit("changeLocationLevel", "section")
        }
        // check if actual level is parcelle.
        // if not : changelocationlevel to parcelle
      }
    }
  }
}

</script>

<style scoped lang="scss">

  @import '~maplibre-gl/dist/maplibre-gl.css';

  .choroMap{
    width: 75%;
    display: inline-block;
    min-height: 100%;
    position: relative;
  }

  .map_container{
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .leg_container{
    position: absolute;
    width: 388px;
    height: 69px;
    left:16px;
    background-color: #ffffff;
    bottom: 20px;
  }

  .leg_title{
    font-weight: 600;
    font-size: 14px;
    line-height: 19px;
    position: absolute;
    top:-25px;
  }

  .color_blocks{
    width: 360px;
    height: 8px;
    background: linear-gradient(90deg, rgba(0,114,71,1) 0%, rgba(0,173,52,1) 9%, rgba(34,215,65,1) 18%, rgba(133,220,68,1) 27%, rgba(200,253,79,1) 36%, rgba(255,244,86,1) 45%, rgba(255,223,81,1) 54%, rgba(255,199,66,1) 63%, rgba(255,142,58,1) 72%, rgba(255,97,47,1) 81%, rgba(255,0,31,1) 89%, rgba(205,0,25,1) 98%);
    margin:35px auto 0;
    position: relative;
  }

  .leg_borne{
    font-weight: 400;
    font-size: 10px;
    position: absolute;
    bottom: -25px;
  }

  .leg_borne.min{
    left:0;
  }

  .leg_borne.pivot{
    left:50%;
    transform:translate(-50%,0);
  }

  .leg_borne.max{
    right:0;
  }


.map_tooltip{
  width: 165px;
  height: auto;
  background-color: white;
  position: fixed;
  z-index: 999;
  border-radius: 4px;
  box-shadow: 0 8px 16px 0 rgba(22, 22, 22, 0.12), 0 8px 16px -16px rgba(22, 22, 22, 0.32);
  text-align: left;
  pointer-events: none;
  font-size: 0.75rem;
  .tooltip_body{
    padding-left: 0.75rem;
    padding-top:0.25rem;
    padding-right: 0.75rem;
    line-height: 1.67;
    .tooltip_place{
      color:#242424;
    }
  }
}
</style>