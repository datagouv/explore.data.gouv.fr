<template>
  <div class="choroMap">
    <search-bar></search-bar>
    <filters-box></filters-box>
    <div ref="mapTooltip" class="map_tooltip" v-show="tooltip.visibility=='visible'" :style="{top:tooltip.top,left:tooltip.left}">
      <div class="tooltip_body">
        {{ tooltip.place }}
        <div v-if="tooltip.value" class="tooltip_place">{{tooltip.value}} €/m²</div>
      </div>
    </div>
    <div class="map_container" ref="mapContainer"></div>
    <div class="leg_container" v-if="userLocation.level != 'section' && userLocation.level != 'parcelle'">
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
      dataChloropleth: {
        "fra": [],
        "departement": [],
        "commune": [],
      },
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
        place: 'NaN',
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
      },
      changeDep: false,
      changeCom: false,
    }
  },
  computed: {
    saveApiUrl:function(){
      return appStore.state.saveApiUrl
    },
    saveApiResponse:function(){
      return appStore.state.saveApiResponse
    },
    mouseLocation:function(){
      return appStore.state.mouseLocation
    },
    userLocation:function(){
      return appStore.state.userLocation
    },
    lng:function(){
      return appStore.state.mapProperties.lng
    },
    lat:function(){
      return appStore.state.mapProperties.lat
    },
    zoom:function(){
      return appStore.state.mapProperties.zoom
    },
    zoomLevel:function(){
      return appStore.state.mapProperties.zoomLevel
    },
    dep:function(){
      return appStore.state.userLocation.dep
    },
    com:function(){
      return appStore.state.userLocation.com
    },
    section:function(){
      return appStore.state.userLocation.section
    },
    parcelle:function(){
      return appStore.state.userLocation.parcelle
    },
    level:function(){
      return appStore.state.userLocation.level
    },
    activeFilter:function(){
      return appStore.state.activeFilter
    },
    searchBarCoordinates:function(){
      return appStore.state.searchBarCoordinates
    },

  },
  mounted() {


    appStore.commit("changeZoomLevel", 4.8)
    appStore.commit("changeMapLng", 2)
    appStore.commit("changeMapLat", 46.3)
    this.changeLocation("changeUserLocation", "fra", null, null)
    
    console.log("ijijjjnnnnn,,,,,,")
    let obj = {}
    for (const [key, value] of Object.entries(this.$route.query)) {
      if (!key.includes("__")){
        obj[key] = value
      }
    }
    this.$router.push({path: this.$route.path, query: obj})
    // Au load de la page, on récupère les stats au niveau EPCI pour l'affichage carte
    let url = 'http://dvf.dataeng.etalab.studio/epci'
    fetch(url)
    .then((response) => {
        return response.json()
    })
    .then((data) => {
      this.sendApiResultToStore(url, data)
      this.dataChloropleth["fra"] = data["data"]
      this.actualPropertyPrix = this.mappingPropertiesPrix[this.activeFilter]
      console.log("jiniin")
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
          maxzoom: 11,
        }

        // communes fill
        const communesFillLayer2 = {
          'id': `communes_fill2`,
          'type': 'fill',
          'source': 'decoupage-administratif-com',
          'source-layer': 'communes',
          'paint': {
            'fill-opacity': 0,
          },
          minzoom: 11,
          maxzoom:15,
        }
        
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

        const departementsFillLayer = {
          'id': `departements_fill`,
          'type': 'fill',
          'source': 'decoupage-administratif-dep',
          'source-layer': 'departements',
          'paint': {
            'fill-opacity': 0,
          },
        }

        this.map.addLayer(parcellesFillLayer)
        this.map.addLayer(parcellesLineLayer)
        this.map.addLayer(sectionsFillLayer)
        this.map.addLayer(sectionsLineLayer)
        this.map.addLayer(communesFillLayer)
        this.map.addLayer(communesFillLayer2)
        this.map.addLayer(communesLineLayer)
        this.map.addLayer(epcisFillLayer)
        this.map.addLayer(departementsFillLayer)
        this.map.addLayer(epcisLineLayer)

        this.map.on('click', 'parcelles_fill', (e) => {
          let parcelleId = e.features[0]["properties"]["id"]
          this.changeLocation("changeUserLocation", "parcelle", parcelleId, parcelleId)


          let matchExpression = ['match', ['get', 'id']]
          matchExpression.push(parcelleId, 'rgba(255, 0, 0, 0.5)');
          matchExpression.push('rgba(0, 0, 255, 0.2)');
          this.map.setPaintProperty("parcelles_fill", "fill-color", matchExpression)
          

        });


        this.map.on('click', 'communes_fill', (e) => {
          // si on est au niveau departement et que le userDep = mouseDep
          // ou 
          // todo
          if (
            (this.userLocation.level == "departement") && (this.userLocation.dep == this.mouseLocation.dep)
          ) {
            this.map.flyTo({
              center: [e.lngLat.lng, e.lngLat.lat],
              zoom: 12,
            });
          }
        });

        // this.map.on('click', 'communes_fill', (e) => {
        //   let comId = e.features[0]["properties"]["code"]
        //   console.log(comId)
        //   console.log(e.lngLat)
        //   // if (this.map.getZoom() <= 12 && comId) {
        //   //   this.map.flyTo({
        //   //     center: [e.lngLat.lng, e.lngLat.lat],
        //   //     zoom: 12,
        //   //   });
        //   //   console.log("jjj")
        //   // }

        //   fetch('https://geo.api.gouv.fr/communes?code=' + comId + '&fields=centre')
        //   .then((response) => {
        //       return response.json()
        //   })
        //   .then((data) => {
        //     // appStore.commit("changeLocationLevel", "commune")
        //     // appStore.commit("changeLocationLabelCom", data[0]["nom"])
        //     this.map.flyTo({
        //       center: [e.lngLat.lng, e.lngLat.lat],
        //       zoom: 12,
        //     });
        //     //this.displaySections(comId)
        //   });

        //   // if (comId.startsWith("750")) {
        //   //   comId = comId.replace("750", "751")
        //   // }
        //   // if(comId.substring(0,2) == this.userLocation.dep){
        //   //   if (this.map.getZoom() <= 12 && comId) {
        //   //     if (comId.substring(0,2) === "75") {
        //   //       // appStore.commit("changeLocationLevel", "commune")
        //   //       // appStore.commit("changeLocationLabelCom", "Paris")
        //   //       this.map.flyTo({
        //   //         center: [e.lngLat.lng, e.lngLat.lat],
        //   //         zoom: 12,
        //   //       });
        //   //       this.displaySections("75056")
        //   //     } else if ((comId.substring(0,4) === "6938") || (comId == "69123")) {
        //   //       // appStore.commit("changeLocationLevel", "commune")
        //   //       // appStore.commit("changeLocationLabelCom", "Lyon")
        //   //       this.map.flyTo({
        //   //         center: [e.lngLat.lng, e.lngLat.lat],
        //   //         zoom: 12,
        //   //       });
        //   //       this.displaySections("69123")

        //   //     } else if ((comId.substring(0,4) === "1320") || (comId.substring(0,4) === "1321") || (comId == "13055")) {
        //   //       // appStore.commit("changeLocationLevel", "commune")
        //   //       // appStore.commit("changeLocationLabelCom", "Marseille")
        //   //       this.map.flyTo({
        //   //         center: [e.lngLat.lng, e.lngLat.lat],
        //   //         zoom: 12,
        //   //       });
        //   //       this.displaySections("13055")

        //   //     } else {
        //   //       fetch('https://geo.api.gouv.fr/communes?code=' + comId + '&fields=centre')
        //   //         .then((response) => {
        //   //             return response.json()
        //   //         })
        //   //         .then((data) => {
        //   //           // appStore.commit("changeLocationLevel", "commune")
        //   //           // appStore.commit("changeLocationLabelCom", data[0]["nom"])
        //   //           this.map.flyTo({
        //   //             center: data[0].centre.coordinates,
        //   //             zoom: 12,
        //   //           });
        //   //           this.displaySections(comId)
        //   //         });
        //   //     }
        //   //   }
        //   // }
        // });

        this.map.on('click', 'departements_fill', (e) => {
          // si on est au niveau france 
          // ou
          // si on est au niveau département et que le dep userlocation != dep mouselocation
          if(
            (this.userLocation.level == "fra")
            ||
            ((this.userLocation.level == "departement") && (this.userLocation.dep != this.mouseLocation.dep))
          ) {
            this.changeDep = true
            this.map.flyTo({
              center: CenterDeps[e.features[0].properties.code].coordinates,
              zoom: 9,
            });
          }
        });

        // when user move on layer departement
        this.map.on('mousemove', 'departements_fill', (e) => {
          let depId = e.features[0]["properties"]["code"]
          let depName = e.features[0]["properties"]["nom"]
          // if it is not the actual displaying departement or 
          // the actual mouseover departement (if there is a change)
          if(this.userLocation.dep != depId && this.mouseLocation.dep != depId) {
            // if we are on france level, we display the name of the departement
            if (this.userLocation.level == "fra"){
              this.fetchTooltipData("departement",depId)
              //this.tooltip.place = e.features[0]["properties"]["nom"]
            }
            // we display in light grey the background of departement mouseovered
            let matchExpression = 0 
            matchExpression = ['match', ['get', 'code']]
            matchExpression.push(depId, 0.4); 
            matchExpression.push(0);
            this.map.setPaintProperty("departements_fill", "fill-opacity", matchExpression)
            this.displayTooltip(e)
            this.mousePosition.dep.code = depId
            this.mousePosition.dep.nom = e.features[0]["properties"]["nom"]
            this.changeLocation("changeMouseLocation", "departement", depId, depName)
          } 
        });

        this.map.on('mouseleave', 'departements_fill', (e) => {
          this.hideTooltip()
        });

        this.map.on('mousemove', 'communes_fill2', (e) => {
          let comId = e.features[0]["properties"]["code"]
          if (this.userLocation.com != comId) {
            matchExpression = ['match', ['get', 'code']]
            matchExpression.push(comId, 0.4)
            matchExpression.push(0)
            this.map.setPaintProperty("communes_fill2", "fill-opacity", matchExpression)
          }
        });

        this.map.on('click', 'communes_fill2', (e) => {
          let comId = e.features[0]["properties"]["code"]
          if (this.userLocation.com != comId) {
            this.mousePosition.com.code = comId
            this.mousePosition.com.nom = e.features[0]["properties"]["nom"]
            this.changeCom = true
            if (this.map.getZoom() <= 15) {
              this.map.flyTo({
                center: [e.lngLat.lng, e.lngLat.lat],
                zoom: 12,
              });
            }
          }
        });
        
        // when user in commune layer
        this.map.on('mousemove', 'communes_fill', (e) => {
          let comId = e.features[0]["properties"]["code"]
          let comName = e.features[0]["properties"]["nom"]
          // if we are on level departement, we display
          // tooltips commune
          if (this.userLocation.level == "departement"){         
            this.fetchTooltipData("commune",comId)
          }
          // if mouseover is on other commune than the actual one
          if(comId != this.userLocation.com){
            // if we are on level departement, we display commune on tooltip
            if (comId.substring(0,2) == this.userLocation.dep) {
              if (this.level == "departement"){
                //this.tooltip.place = e.features[0]["properties"]["nom"]
              }    
              this.mousePosition.com.code = comId
              this.mousePosition.com.nom = e.features[0]["properties"]["nom"]
              this.displayTooltip(e)
              this.changeLocation("changeMouseLocation", "commune", comId, comName)
              // we are on the actual displaying departement, so no need to light grey dep
              this.map.setPaintProperty("departements_fill", "fill-opacity", 0)
            } else {
              this.tooltip.value = null
              this.tooltip.place = "Changer de département"
            }
          }
        });


        // when user in commune layer
        this.map.on('mousemove', 'sections_fill', (e) => {
          let sectionId = e.features[0]["properties"]["id"]
          if (this.userLocation.level == "commune"){         
            this.fetchTooltipData("section",sectionId)
            this.displayTooltip(e)
          }
          if (sectionId.substring(0,5) != this.userLocation.com) {
              this.tooltip.value = null
              this.tooltip.place = "Changer de commune"
          }
          this.changeLocation("changeMouseLocation", "section", sectionId, sectionId)
        });
      });

      this.map.on('zoom', (m) => {
        appStore.commit("changeZoomLevel",this.map.getZoom())
      });

      this.map.on('mousemove', (e) => {
        appStore.commit("changeMapLat", e.lngLat.wrap().lat)
        appStore.commit("changeMapLng", e.lngLat.wrap().lng)
      });

      this.map.on('click', 'sections_fill', (e) => {
        let sectionId = e.features[0]["properties"]["id"]
        // appStore.commit("changeLocationSection", sectionId)
        // appStore.commit("changeLocationLevel", "section")
        if (
          (this.userLocation.level == "commune") && (this.userLocation.com == this.mouseLocation.com)
        ) {
          this.mousePosition.section.code = sectionId
          this.mousePosition.section.nom = sectionId

          if (this.map.getZoom() <= 15) {
            this.map.flyTo({
              center: [e.lngLat.lng, e.lngLat.lat],
              zoom: 17,
            });           
            //this.changeLocation("changeUserLocation", "section", sectionId)
          }
        }
      });

      this.map.on('load', (e) => {
        

        if(this.$route.query.level && this.$route.query.code){
          setTimeout((e) => {
            // console.log("loaded")
            // console.log(this.$route.query.code)
            // console.log(CenterDeps["29"])
            // this.userLocation.dep = this.$route.query.code
            // //this.userLocation.depName = CenterDeps[this.$route.query.code]["nom"]
            // this.changeLocation("changeUserLocation", "departement", this.userLocation.dep, this.userLocation.depName)    
            // this.map.flyTo({
            //   center: CenterDeps[this.$route.query.code]["coordinates"],
            //   zoom: 8,
            // });
            if (this.$route.query.level == "departement") {
              this.mousePosition.dep.code = this.$route.query.code
              this.mousePosition.dep.nom = CenterDeps[this.$route.query.code]["nom"]
              this.changeDep = true
              this.map.flyTo({
                center: CenterDeps[this.$route.query.code]["coordinates"],
                zoom: 9,
              });
            } else {
              console.log("toto")
              fetch('https://geo.api.gouv.fr/communes?code=' + this.$route.query.code.substring(0,5) + '&fields=centre')
              .then((response) => {
                  return response.json()
              })
              .then((data) => {
                this.mousePosition.com.code = this.$route.query.code.substring(0,5)
                this.mousePosition.com.nom = data[0]["nom"]
                this.map.flyTo({
                  center: data[0]["centre"]["coordinates"],
                  zoom: 12,
                });
              });
                    }
          }, 500);
        }
      })

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
    changeLocation(commitFunction, level, code, name){
      let obj = {}
      if (level == "fra") {
        obj.level = "fra"
        obj.dep = null
        obj.depName = null
        obj.com = null
        obj.comName = null
        obj.section = null
        obj.sectionName = null
        obj.parcelle = null
        obj.parcelleName = null
      }
      if (level == "departement") {
        obj.level = "departement"
        obj.dep = code
        obj.depName = name
        obj.com = null
        obj.comName = null
        obj.section = null
        obj.sectionName = null
        obj.parcelle = null
        obj.parcelleName = null
      }
      if (level == "commune") {
        obj.level = "commune"
        obj.dep = code.substring(0,2)
        obj.depName = CenterDeps[code.substring(0,2)]["nom"]
        obj.com = code
        obj.comName = name
        obj.section = null
        obj.sectionName = null
        obj.parcelle = null
        obj.parcelleName = null
      }
      if (level == "section") {
        obj.level = "section"
        obj.dep = code.substring(0,2)
        obj.depName = CenterDeps[code.substring(0,2)]["nom"]
        obj.com = code.substring(0,5)
        obj.comName = this.userLocation.comName
        obj.section = code
        obj.sectionName = name.slice(5)
        while(obj.sectionName.charAt(0) === '0')
        {
          obj.sectionName = obj.sectionName.substring(1);
        }
        obj.parcelle = null
        obj.parcelleName = null
      }
      if (level == "parcelle") {
        obj.level = "parcelle"
        obj.dep = code.substring(0,2)
        obj.depName = CenterDeps[code.substring(0,2)]["nom"]
        obj.com = code.substring(0,5)
        obj.comName = this.userLocation.comName
        obj.section = code.substring(0,10)
        obj.sectionName = code.substring(5,10)
        while(obj.sectionName.charAt(0) === '0')
        {
          obj.sectionName = obj.sectionName.substring(1);
        }
        obj.parcelle = code
        obj.parcelleName = name.slice(10)
        while(obj.parcelleName.charAt(0) === '0')
        {
          obj.parcelleName = obj.parcelleName.substring(1);
        }
      }
      appStore.commit(commitFunction, obj)
    },
    sendApiResultToStore(url, data){
      let obj = {}
      obj.url = url
      obj.data = data
      appStore.commit("addApiResult", obj)
    },
    changeChloroplethColors(property_code_geo, property_value, property_tile_code_geo){    
      console.log(property_code_geo, property_value, property_tile_code_geo)
      console.log(this.userLocation) 
      let list_obj = []
      let dataObj = []
      this.dataChloropleth[this.userLocation.level].forEach((d) =>{
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
        this.dataChloropleth["departement"] = data["data"]
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
        this.dataChloropleth["commune"] = data["data"]
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
      if (
        (this.userLocation.level == "section") ||
        (this.userLocation.com == "parcelle")
      ){
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
      let url = null
      if (!this.fetching) {
        this.fetching = true
        if (this.userLocation.level == "fra") {
          url = "http://dvf.dataeng.etalab.studio/departement"
        } else if (this.userLocation.level == "departement") {
          url = "http://dvf.dataeng.etalab.studio/departement/" + code.substring(0,2) + "/communes"
        } else if (this.userLocation.level == "commune") {
          url = "http://dvf.dataeng.etalab.studio/commune/" + code.substring(0,5) + "/sections"
        }
        let data = null
        if (this.saveApiUrl.includes(url)){
          data = this.saveApiResponse[url] 
          this.manageTooltipData(level, code, data)
          this.fetching = false
        } else {
          fetch(url)
          .then((response) => {
              return response.json()
          })
          .then((res) => {
            data = res
            this.sendApiResultToStore(url, data)
            this.manageTooltipData(level, code, data)
            this.fetching = false
          })
        }
      }

    },
    manageTooltipData(level, code, data){
      var result = data["data"].find(obj => {
        return obj.code_geo === code
      })
      if (level == "section") {
        this.tooltip.place = "Section " + result.libelle_geo
      } else {
        this.tooltip.place = result.libelle_geo
      }
      this.tooltip.value = Math.round(result[this.actualPropertyPrix]).toLocaleString()
    },
    manageChloroplethColors(){
      if(this.dataChloropleth[this.userLocation.level]){
        let property_tile_code_geo = "code"
        if (this.level === "commune"){
          property_tile_code_geo = "id"
        }
        this.actualPropertyPrix = this.mappingPropertiesPrix[this.activeFilter]
        let matchExpression = this.changeChloroplethColors('code_geo', this.actualPropertyPrix, property_tile_code_geo)
        let exp = null
        if (matchExpression.length == 3) {
          exp = matchExpression[2]
        } else {
          exp = matchExpression
        }
        console.log(this.actualPropertyPrix)
        this.map.setPaintProperty(this.mappingPropertiesFillLayer[this.userLocation.level], "fill-color", exp)
      }
    },
  },
  watch: {
    activeFilter(){
      this.manageChloroplethColors()
    },
    searchBarCoordinates(){
      appStore.commit("changeZoomLevel",17)
      this.map.flyTo({
        center: this.searchBarCoordinates,
        zoom: 17,
      });
    },
    zoomLevel(){
      if (this.zoomLevel < 8) {
        if (this.level != "fra") {
          this.map.setLayoutProperty("epcis_fill", "visibility", "visible")
          this.map.setLayoutProperty("departements_fill", "visibility", "visible")
          this.changeLocation("changeUserLocation", "fra", null, "France")    
          this.changeLocation("changeMouseLocation", "fra", null, "France") 
          this.manageChloroplethColors()
        }
      } 
      if (this.zoomLevel >= 8 && this.zoomLevel < 11) {
        if (this.level != "departement" || this.changeDep) {
          console.log("toto")
          console.log("youhou")
          this.map.setLayoutProperty("epcis_fill", "visibility", "none")
          this.map.setLayoutProperty("communes_fill", "visibility", "visible")
          console.log(this.mousePosition.dep)
          this.changeLocation("changeUserLocation", "departement", this.mousePosition.dep.code, this.mousePosition.dep.nom)
          this.displayCommunes(this.mousePosition.dep.code)
          this.changeDep = false
          this.manageChloroplethColors()
        }
      } 
      if (this.zoomLevel >= 11 && this.zoomLevel < 15) {
        if (this.level != "commune" || this.changeCom) {
          this.map.setLayoutProperty("departements_fill", "visibility", "visible")
          this.map.setPaintProperty("departements_fill", "fill-opacity", 0)
          this.map.setLayoutProperty("epcis_fill", "visibility", "none")
          this.map.setLayoutProperty("sections_fill", "visibility", "visible")
          this.displaySections(this.mousePosition.com.code)
          this.changeLocation("changeUserLocation", "commune", this.mousePosition.com.code, this.mousePosition.com.nom)
          this.manageChloroplethColors()
          this.changeCom = false
        }
      } 
      if (this.zoomLevel >= 15) {
        if (this.level != "section") {          
          this.map.setLayoutProperty("departements_fill", "visibility", "none")
          this.map.setLayoutProperty("epcis_fill", "visibility", "none")
          this.changeLocation("changeUserLocation", "section", this.mousePosition.section.code, this.mousePosition.section.nom)
        }
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