<template>
  <div class="fr-container--fluid">
    <header-apps
      :formHref="formHref"
      appName="Carburants"
      appLink="/prix-carburants"
    ></header-apps>
    <div>
      <div v-if="tooltip.properties" class="tooltip" :style="{top:tooltip.top,left:tooltip.left, display:tooltip.display}">
          <div v-if="tooltip.properties.adr" class="tooltip-title">{{ tooltip.properties.adr }}</div>
          <div v-if="tooltip.properties.cpl_adr" class="tooltip-title">{{ tooltip.properties.cpl_adr }}</div>
          <div class="tootlip-content" style="display: flex;">
            <div>
            <span v-for="item in ['SP95', 'E10', 'SP98']" :key="item">
              <span v-if="(tooltip.properties[item] != 'R') & (tooltip.properties[item] != 'N')">
                <div v-if="tooltip.properties[item]" class="tooltip-value">
                  <span v-if="tooltip.properties[item + '_color'] === '1'">
                    <img src="/assets/images/dispo-green.png" width="12" alt="" />
                  </span>
                  <span v-if="tooltip.properties[item + '_color'] === '2'">
                    <img src="/assets/images/dispo-orange.png" width="12" alt="" />
                  </span>
                  <span v-if="tooltip.properties[item + '_color'] === '3'">
                    <img src="/assets/images/dispo-red.png" width="12" alt="" />
                  </span>
                  <b>{{ fuelFr[item] }} : {{ tooltip.properties[item] }} €</b><br />MAJ le {{ isoToDateFr(tooltip.properties[item + '_m'], 'short') }}
                </div>
              </span>
              <span v-else-if="tooltip.properties[item] == 'R'">
                <div v-if="tooltip.properties[item]" class="tooltip-value tooltip-value-grey">
                  <span>
                    <img src="/assets/images/cross-sign.png" width="12" alt="" />
                    {{ fuelFr[item] }} : En rupture<br />depuis le {{ isoToDateFr(tooltip.properties[item + '_s'], 'short') }}
                  </span>
                </div>
              </span>
              <span v-else>
                <div class="tooltip-value tooltip-value-grey">
                  <span>
                    <img src="/assets/images/caution-sign.png" width="12" alt="" />
                    {{ fuelFr[item] }} : Non proposé<br/>dans la station
                  </span>
                </div>
              </span>
            </span>
            </div>
            <div style="border-left: 1px solid #ebebeb; padding-left: 10px; margin-left: 10px; margin-right: 10px;">
            <span v-for="item in ['Gazole', 'GPLc', 'E85']" :key="item">
              <span v-if="(tooltip.properties[item] != 'R') & (tooltip.properties[item] != 'N')">
                <div v-if="tooltip.properties[item]" class="tooltip-value">
                  <span v-if="tooltip.properties[item + '_color'] === '1'">
                    <img src="/assets/images/dispo-green.png" width="12" alt="" />
                  </span>
                  <span v-if="tooltip.properties[item + '_color'] === '2'">
                    <img src="/assets/images/dispo-orange.png" width="12" alt="" />
                  </span>
                  <span v-if="tooltip.properties[item + '_color'] === '3'">
                    <img src="/assets/images/dispo-red.png" width="12" alt="" />
                  </span>
                  <b>{{ fuelFr[item] }} : {{ tooltip.properties[item] }} €</b><br />MAJ le {{ isoToDateFr(tooltip.properties[item + '_m'], 'short') }}
                </div>
              </span>
              <span v-else-if="tooltip.properties[item] == 'R'">
                <div v-if="tooltip.properties[item]" class="tooltip-value tooltip-value-grey">
                  <span>
                    <img src="/assets/images/cross-sign.png" width="12" alt="" />
                    {{ fuelFr[item] }} : En rupture<br />depuis le {{ isoToDateFr(tooltip.properties[item + '_s'], 'short') }}
                  </span>
                </div>
              </span>
              <span v-else>
                <div class="tooltip-value tooltip-value-grey">
                  <span>
                    <img src="/assets/images/caution-sign.png" width="12" alt="" />
                    {{ fuelFr[item] }} : Non proposé<br/>dans la station
                  </span>
                </div>
              </span>
            </span>
            </div>
          </div>
      </div>
      <div class="fr-grid-row map-wrap">
        <div class="fr-col-12 fr-col-md-4 fr-col-xl-3">
          <nav class="fr-sidemenu fr-sidemenu--sticky fr-p-0" aria-label="Menu latéral">
            <div class="fr-sidemenu__inner">
                <button class="fr-sidemenu__btn" hidden aria-controls="fr-sidemenu-wrapper" aria-expanded="false">Prix des carburants — {{this.fuelFr[this.currentFuel]}}</button>
                <div class="fr-collapse" id="fr-sidemenu-wrapper">
                    <div class="fr-sidemenu__title fr-h6">Carte des prix des carburants</div>
                    <div style="border-bottom: 1px solid #EEEEEE;" class="titleMenu fr-pb-1w fr-mr-2w fr-hidden fr-unhidden-md">
                      
                      <span v-if="dateMaj">
                        <div style="display: flex;" class="fr-header__service-tagline">
                          <!-- <div style="width: 40px;">
                            <button @click="updateDate(getDayBeforeOrAfter(-1))"><</button>
                          </div> -->
                          <div style="margin: auto;">
                            {{ formatDateMaJ() }}
                          </div>
                          <!-- <div style="width: 40px;">
                            <button @click="updateDate(getDayBeforeOrAfter(+1))">></button>
                          </div> -->
                        </div>
                      </span>
                    </div>
                    <div style="border-bottom: 1px solid #EEEEEE;" class="fr-mt-2w">
                      <label for="select-fuel" class="fr-label fr-text--bold fr-mb-1w">Sélectionnez un carburant</label>
                      <select id="select-fuel" class="fr-select" v-model="currentFuel" @change="changeMap()">
                        <option 
                          key="E10"
                          value="E10">
                          Sans Plomb 95 (E10)
                        </option>
                        <option 
                          key="SP95"
                          value="SP95">
                          Sans Plomb 95
                        </option>
                        <option 
                          key="SP98"
                          value="SP98">
                          Sans Plomb 98
                        </option>
                        <option 
                          key="Gazole"
                          value="Gazole">
                          Gazole
                        </option>
                        <option 
                          key="GPLc"
                          value="GPLc">
                          GPL-c
                        </option>
                        <option 
                          key="E85"
                          value="E85">
                          Superéthanol E85
                        </option>
                      </select>
                      <div class="fr-toggle fr-my-1v">
                          <input 
                            v-if="zoomLevel <= 10"
                            v-model="showRupture" 
                            type="checkbox" 
                            class="fr-toggle__input" 
                            aria-describedby="toggle-698-hint-text" 
                            id="checkbox"
                            @change="displayRupture"
                          >
                          <label 
                            v-if="zoomLevel <= 10"
                            class="fr-toggle__label label-rupture"
                            for="checkbox"
                            data-fr-checked-label="Activé"
                            data-fr-unchecked-label="Désactivé"
                          >
                            Stations en rupture de {{ this.fuelFr[this.currentFuel] }}
                          </label>
                          <input 
                            v-if="zoomLevel > 10"
                            v-model="showRupture" 
                            type="checkbox" 
                            class="fr-toggle__input" 
                            aria-describedby="toggle-699-hint-text" 
                            id="checkbox2"
                            checked
                            disabled
                          >
                          <label 
                            v-if="zoomLevel > 10"
                            class="fr-toggle__label label-rupture"
                            for="checkbox2"
                            data-fr-checked-label="Activé"
                            data-fr-unchecked-label="Désactivé"
                          >
                            Stations en rupture de {{ this.fuelFr[this.currentFuel] }}
                          </label>
                      </div>
                      <div v-if="this.legend.meanPrix" class="fr-grid-row fr-grid-row--gutters">
                        <div class="fr-col">
                          <div class="fr-text--bold fr-mb-1v">Prix moyen :</div>
                          {{ this.legend.meanPrix }} €
                        </div>
                        <div class="fr-col">
                          <div class="fr-text--bold fr-mb-1v">Prix médian :</div>
                          {{ this.legend.medianPrix }} €
                        </div>
                      </div>
                      <br />
                      <div v-if="valuesx && valuesy">
                        <bar-or-graph indicateur="toto" color="#3558a2" :titleChart="titleChart" unitChart="€" typeChart="line" :valuesx="valuesx" :valuesy="valuesy"></bar-or-graph>
                      </div>
                      <br />
                      <div class="nb-legend">
                        <i><u><a href="https://www.data.gouv.fr/fr/posts/exploration-de-donnees-zoom-sur-de-nouvelles-briques-disponibles-sur-data-gouv-fr-avec-lexemple-du-prix-des-carburants/">En savoir plus sur ce tableau de bord</a></u> et la méthodologie permettant son développement.</i>
                        <br />
                        <i>Les sources de données utilisées pour réaliser cette application <a href="https://www.data.gouv.fr/fr/datasets/prix-des-carburants-en-france-flux-instantane/"><u>sont disponibles sur data.gouv.fr</u></a> et <a href="https://explore.data.gouv.fr/tableau?url=https://www.data.gouv.fr/fr/datasets/r/64e02cff-9e53-4cb2-adfd-5fcc88b2dc09"><u>sont explorables ici.</u></a></i>
                        <i> Celles-ci sont mises à disposition par le Ministère de l'Économie, des Finances et de la Souveraineté industrielle et numérique.
                        Pour plus d'informations <a href="https://www.prix-carburants.gouv.fr/"><u>rendez-vous sur le site officiel.</u></a></i>
                        <br />
                        <i>Cette visualisation a été créée par le département Etalab de <a href="https://www.numerique.gouv.fr/"><u>la Direction Interministérielle du Numérique (DINUM)</u></a> et son <a href="https://github.com/etalab/csvapi-front/blob/exploration-table/src/views/AppCarburant.vue"><u>code source est libre.</u></a></i>
                      </div>
                      <br />
                    </div>
                </div>
            </div>
          </nav>
        </div>
        <div id="map" class="map fr-col-12 fr-col-md-8 fr-col-xl-9" ref="mapContainer">
          
            <div class="fr-container fr-container-lg--fluid" id="searchMap">
                <div class="autocomplete-container">
                  <div class="fr-search-bar" id="search-540" role="search">
                    <label class="fr-label" for="search-540-input">
                        Rechercher
                    </label>
                    <input 
                      v-model="searchAdress"
                      class="fr-input"
                      placeholder="Rechercher une station près de chez vous"
                      type="search"
                      id="search-540-input"
                      name="search-540-input"
                      v-on:keyup.enter="goToFirstResult()"
                      @input="autoComplete()"
                    >
                    <button class="fr-btn" title="Rechercher" @click="getAdresses()">
                        Rechercher
                    </button>
                  </div>
                  <div v-if="resultsAdresses" class="autocomplete">
                    <div 
                      @click="moveTo(item.geometry.coordinates, 13)" 
                      v-for="item in resultsAdresses.features"
                      :key="item.properties.label"
                    >
                      <div 
                        :class="firstResult.properties.label === item.properties.label ? 'autocomplete-item autocomplete-item-select' : 'autocomplete-item'"
                        @mouseover="firstResult = item"
                      >
                        {{ item.properties.label }}
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          
          <div id="legendMap">
            <div class="legendMap-title">Prix des carburants</div>
            <div class="legendMap-colors">
              <div class="legendMap-color">
                <div class="legendMap-color-green">&nbsp;</div>
                {{ legend.minPrix }} €
              </div>
              <div class="legendMap-color">
                <div class="legendMap-color-orange">&nbsp;</div>
                {{ legend.tertilePrix1 }} €
              </div>
              <div class="legendMap-color">
                <div class="legendMap-color legendMap-color-red">&nbsp;</div>
                {{ legend.tertilePrix2 }} €
              </div>
            </div>
            <div class="nb-legend">
              <i>NB : Le prix des carburants est réparti en trois groupes équivalents.</i>
            </div>
          </div>
          <div id="titleMap" class="fr-px-1w fr-py-3v fr-text--sm fr-text--bold fr-m-0">
            <span v-if="!showRupture">
              {{ titleFr[currentFuel] }}
            </span>
            <span v-if="showRupture">
              {{ titleFrRupture[currentFuel] }}
            </span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>

import store from './store'

import HeaderApps from '@/views/HeaderApps'

import { Map, GeolocateControl } from 'maplibre-gl';
import BarOrGraph from '@/components/BarOrGraph.vue'
import { ungzip } from 'pako';

import { markRaw } from 'vue';
import styleVector from './assets/json/vector.json'
import CenterDeps from './assets/json/centers_deps.json'
import * as d3 from 'd3-scale'

export default {
  name: 'AppCarburant',
  components: {Map, markRaw, BarOrGraph, HeaderApps},
  metaInfo: {
    title: "Explorateur de données des prix des carburants",
    meta: [
      {
        name: "description",
        content: "Carte des prix des carburants, trouvez les prix de la station la plus proche d'une adresse.",
      },
      // Ajoutez d'autres balises meta si nécessaire
    ],
  },
  data() {
    return {
      formHref:"https://tally.so/r/3jZbA9",
      map: Object,
      fuelFr: {
        SP95: 'SP 95',
        SP98: 'SP 98',
        Gazole: 'Gazole',
        E10: 'SP 95-E10',
        GPLc: 'GPLc',
        E85: 'E85'
      },
      titleFr: {
        SP95: 'Stations disposant du Sans Plomb 95 et prix associés',
        SP98: 'Stations disposant du Sans Plomb 98 et prix associés',
        Gazole: 'Stations disposant du Gazole et prix associés',
        E10: 'Stations disposant du Sans Plomb 95 (E10) et prix associés',
        GPLc: 'Stations disposant de GPL-c et prix associés',
        E85: 'Stations disposant de Superéthanol E85 et prix associés'
      },
      titleFrRupture: {
        SP95: 'Stations disposant du Sans Plomb 95 et ruptures',
        SP98: 'Stations disposant du Sans Plomb 98 et ruptures',
        Gazole: 'Stations disposant de Gazole et ruptures',
        E10: 'Stations disposant du Sans Plomb 95 (E10) et ruptures',
        GPLc: 'Stations disposant de GPL-c et ruptures',
        E85: 'Stations disposant de Superéthanol E85 et ruptures',

      },
      legend: {
        minPrix: null,
        tertilePrix1: null,
        tertilePrix2: null,
        meanPrix: null,
        medianPrix: null,
      },
      tooltip: {
        top: '100px',
        left: '300px',
        display: 'none',
        properties: null,
      },
      dataChloropleth: null,
      dataPoints: null,
      matchExpression: null,
      searchAdress: null,
      resultsAdresses: null,
      currentFuel: "E10",
      dateMaj: null,
      zoomLevel: null,
      lat: null,
      lng: null,
      firstResult: null,
      valuesx: null,
      valuesy: null,
      valuesPrices: null,
      titleChart: '',
      showRupture: false,
    }
  },
  computed: {
  },
  mounted() {
    this.dataChloropleth = null
    this.matchExpression = ['match', ['get', 'code']]
    this.zoomLevel = 4.2
    this.lat = 46.3
    this.lng = 2
    const initialState = { lng: this.lng, lat: this.lat, zoom: this.zoomLevel };
    this.map = markRaw(new Map({
      container: this.$refs.mapContainer,
      style: styleVector,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom
    }));
    
    fetch('https://data.explore.data.gouv.fr/latest_france.json', {
        compress: false,
        headers: { "accept-encoding": "gzip" },
    })
    .then((response) => {
        return response.json()
    })
    .then((data) => {
      //data.features = data.features.filter((feature) => ((feature.properties.hasOwnProperty("SP95")) || (feature.properties.hasOwnProperty("SP98")) || (feature.properties.hasOwnProperty("E10")) || (feature.properties.hasOwnProperty("Gazole")) || (feature.properties.hasOwnProperty("GPLc")) || (feature.properties.hasOwnProperty("E85"))))
      this.dataPoints = JSON.parse(JSON.stringify(data))
      this.legend.minPrix = 0
      this.legend.tertilePrix1 = data.properties[this.currentFuel][1]
      this.legend.tertilePrix2 = data.properties[this.currentFuel][2]
      this.legend.maxPrix = data.properties[this.currentFuel][3]
      this.legend.meanPrix = parseFloat(data.properties[this.currentFuel + "_mean"]).toFixed(2)
      this.legend.medianPrix = parseFloat(data.properties[this.currentFuel + "_median"]).toFixed(2)

      this.dateMaj = new Date(data.properties.maj);
      this.map.on('load', (m) => {
        this.map.addSource('station_points', {
            type: 'geojson',
            data: this.dataPoints
        });
        this.map.addLayer({
            id: 'stations',
            type: 'circle',
            source: 'station_points',
            paint: {
              // Make circles larger as the user zooms from z12 to z22.
              'circle-radius': {
                base: 3.75,
                stops: [
                  [3, 3],
                  [12, 10],
                  [18, 60]
                ]
              },
              // Color circles by ethnicity, using a `match` expression.
              'circle-color': [
                'match',
                ['get', this.currentFuel + '_color'],
                "1",
                '#67A532',
                "2",
                '#C8AA39',
                "3",
                '#FA7A35',
                /* other */ 'hsla(0%, 0%, 0%, 0)'
              ]
            },
            minzoom:1,
        });


        this.map.on('zoom', () => {
          let timer = setTimeout(() => {
            const currentZoom = this.map.getZoom();
            if(currentZoom != this.zoomLevel) {
              this.zoomLevel = currentZoom
              if(currentZoom > 10) {
                this.displayAllStations()
              } else {
                this.displayAllStations()
              }
            }
          }, 350)
        });

        this.map.on('mousemove', this.showMapTooltip);
        this.map.on('touchmove', this.showMapTooltip);
        this.map.on('click', this.showMapTooltip);

        this.map.on('mouseleave', 'stations', (e) => {
          this.tooltip.display = 'none'
        });

        this.map.addControl(
          new GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true
            },
            trackUserLocation: true,
            fitBoundsOptions: {maxZoom:12}
          })
        );


      });
    })


    fetch('https://data.explore.data.gouv.fr/prix_2022.json')
    .then((response) => {
        return response.json()
    })
    .then((data) => {
      this.valuesPrices = data
      let valuesx = []
      let valuesy = []
      data.forEach((d) => {
        valuesx.push(d["date"].split('-')[2] + "/" + d["date"].split('-')[1] + "/" + d["date"].split('-')[0].slice(2,4))
        valuesy.push(parseFloat(d[this.currentFuel + "_mean"]).toFixed(2))
      });
      this.valuesx = valuesx;
      this.valuesy = valuesy;
      this.titleChart = "Evolution des prix moyens de " + this.fuelFr[this.currentFuel]

    });
  },
  methods: {
    updateDate(val){

      fetch('https://data.explore.data.gouv.fr/historique/' + val + '.json')
      .then((response) => {
          return response.json()
      })
      .then((data) => {
        //data.features = data.features.filter((feature) => ((feature.properties.hasOwnProperty("SP95")) || (feature.properties.hasOwnProperty("SP98")) || (feature.properties.hasOwnProperty("E10")) || (feature.properties.hasOwnProperty("Gazole")) || (feature.properties.hasOwnProperty("GPLc")) || (feature.properties.hasOwnProperty("E85"))))

        this.dataPoints = JSON.parse(JSON.stringify(data))
        this.map.getSource("station_points").setData(this.dataPoints);

        this.legend.minPrix = 0
        this.legend.tertilePrix1 = data.properties[this.currentFuel][1]
        this.legend.tertilePrix2 = data.properties[this.currentFuel][2]
        this.legend.maxPrix = data.properties[this.currentFuel][3]
        this.legend.meanPrix = parseFloat(data.properties[this.currentFuel + "_mean"]).toFixed(2)
        this.legend.medianPrix = parseFloat(data.properties[this.currentFuel + "_median"]).toFixed(2)

        this.dateMaj = new Date(val);
    })

    },
    showMapTooltip(e) {
      var width = 10;
      var height = 10;
      let features = this.map.queryRenderedFeatures([
        [e.point.x - width / 2, e.point.y - height / 2],
        [e.point.x + width / 2, e.point.y + height / 2]
      ], {
        layers: ['stations']
      });
      features = features.filter(feature => feature.layer.paint['circle-color'].a > 0)
      if (features && features.length > 0) {
        this.tooltip.top = (this.$refs.mapContainer.getBoundingClientRect().y + e.point.y + 10).toString() + 'px'
        this.tooltip.left = (this.$refs.mapContainer.getBoundingClientRect().x + e.point.x + 10).toString() + 'px'
        this.tooltip.display = 'block'
        this.tooltip.properties = features[0].properties
      } else {
        this.tooltip.display = 'none'
      }
    },
    formatDateMaJ(){
      if(this.dateMaj.getFullYear()){
        let minutes = this.dateMaj.getMinutes()
        let hours = this.dateMaj.getHours() + ((this.dateMaj.getTimezoneOffset()/60) * -1)
        if (minutes < 10) {
          minutes = '0' + this.dateMaj.getMinutes()
        }
        if (hours < 10) {
          hours = '0' + (parseInt(this.dateMaj.getHours()) + parseInt((this.dateMaj.getTimezoneOffset()/60) * -1)).toString()
        }
        return "Le " + this.dateMaj.getDate() + "/" + (this.dateMaj.getMonth()+1) + "/" + this.dateMaj.getFullYear() + " à " + hours + 'h' + minutes
      } else {
        return ""
      }
    },
    getDayBeforeOrAfter(val){
      let mydate = new Date(this.dateMaj)
      mydate.setDate(mydate.getDate() + val);
      let day = mydate.getDate()
      let month = mydate.getMonth() + 1
      if((mydate.getDate()) < 10){
        day = '0' + day
      }
      if(mydate.getMonth()+1 < 10){
        month = '0' + month
      }
      return mydate.getFullYear() + "-" + month + "-" + day
    },
    displayRupture() {
      this.displayAllStations()
    },
    goToFirstResult() {
      if(this.firstResult){
        this.moveTo(this.firstResult.geometry.coordinates, 13)
      }
    },
    isoToDateFr(maj, type) {
      let date = new Date(maj);
      if(type === 'long') {
        return date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear() + " à " + date.getHours() + "h" + date.getMinutes()
      } else {
        return date.getDate() + "/" + (date.getMonth()+1) + " à " + date.getHours() + "h"
      }
    },
    getAdresses() {
        fetch('https://api-adresse.data.gouv.fr/search/?q=' + this.searchAdress.replace(' ', '%20'))
        .then((response) => {
            return response.json()
        })
        .then((data) => {
          this.resultsAdresses = data
          this.firstResult = data.features[0]
          //this.moveTo(data.features[0].geometry.coordinates, 13)
        })
    },
    closeModal() {
      /*this.$refs.modalCloseButton.click()*/
    },
    moveTo(coordinates, zoomLevel) {
      this.closeModal()
      this.resultsAdresses = null
      this.zoomLevel = zoomLevel
      this.map.flyTo({
        center: coordinates,
        zoom: zoomLevel,
      });
    },
    displayAllStations(){
      let paintProperties = []
      if(this.zoomLevel > 10){
        this.showRupture = true
        paintProperties = [
          'match',
          ['get', this.currentFuel + '_color'],
          "0",
          '#000000',
          "1",
          '#67A532',
          "2",
          '#C8AA39',
          "3",
          '#FA7A35',
          /* other */ '#AAAAAA'
        ]
      }
      else {
        if(this.showRupture) {
            paintProperties = [
            'match',
            ['get', this.currentFuel + '_color'],
            "0",
            '#000000',
            "1",
            '#67A532',
            "2",
            '#C8AA39',
            "3",
            '#FA7A35',
            /* other */ 'hsla(0%, 0%, 0%, 0)'
          ]
        } else {
            paintProperties = [
              'match',
              ['get', this.currentFuel + '_color'],
              "1",
              '#67A532',
              "2",
              '#C8AA39',
              "3",
              '#FA7A35',
              /* other */ 'hsla(0%, 0%, 0%, 0)'
            ]
        }
      }
      this.map.setPaintProperty("stations", "circle-color", paintProperties)

    },
    changeMap() {
      //this.showRupture = false;
      this.legend.minPrix = 0
      this.legend.tertilePrix1 = this.dataPoints.properties[this.currentFuel][1]
      this.legend.tertilePrix2 = this.dataPoints.properties[this.currentFuel][2]
      this.legend.maxPrix = this.dataPoints.properties[this.currentFuel][3]
      this.legend.meanPrix = parseFloat(this.dataPoints.properties[this.currentFuel + "_mean"]).toFixed(2)
      this.legend.medianPrix = parseFloat(this.dataPoints.properties[this.currentFuel + "_median"]).toFixed(2)

      this.displayAllStations()

      let valuesx = []
      let valuesy = []
      this.valuesPrices.forEach((d) => {
        valuesx.push(d["date"].split('-')[2] + "/" + d["date"].split('-')[1] + "/" + d["date"].split('-')[0].slice(2,4))
        valuesy.push(parseFloat(d[this.currentFuel + "_mean"]).toFixed(2))
      });
      this.valuesx = valuesx;
      this.valuesy = valuesy;
      this.titleChart = "Evolution des prix moyens de " + this.fuelFr[this.currentFuel]
    },
    autoComplete() {
      if(this.searchAdress.length === 0) {
        this.resultsAdresses = null
      }
      let search = this.searchAdress
      let timer = setTimeout(() => {
        if(this.searchAdress === search) {
          this.getAdresses()
        }
      }, 650)
    },
  },
  watch: {
  }
}
</script>

<style scoped>
@import '~maplibre-gl/dist/maplibre-gl.css';

html{
  height: 100%;
}

.fr-container--fluid .fr-sidemenu {
  margin-left: 0;
  margin-right: 0;
}

@media (min-width: 48em) {
  .fr-sidemenu--sticky .fr-sidemenu__inner {
    max-height: calc(100vh - 60px);
    padding: 1.25rem;
  }
}

.map-wrap {
  height: calc(100vh - 60px);
}

.map {
  width: 100%;
  height: calc(100% - 60px);
  cursor: pointer;

}

#titleMap {
  position: absolute;
  bottom: 2.5rem;
  right: 0.5rem;
  background-color: white;
  z-index: 100;
  display: none;
  font-style: italic;
  font-family: Marianne;
  cursor: grab;
}

#legendMap {
  position: absolute;
  width: 280px;
  height: 110px;
  top: 10px;
  left: 10px;
  background-color: white;
  z-index: 100;
  padding-left: 5px;
  padding-right: 5px;
  display: none;
  font-family: Marianne;
  cursor: grab;
}

#searchMap {
  position: absolute;
  width: 400px;
  height: 80px;
  top: auto;
  bottom:100px;
  right: 0px;
  left:0px;
  z-index: 999;
}

@media (min-width: 48em) {
  .map {
    height: 100%;
  }
    
  #legendMap {
    width: 500px;
    height: 80px;
  }

  #titleMap {
    bottom: 2rem;
  }

  #searchMap {
    height: 80px;
    top: 10px;
    bottom:auto;
    left:auto;
    right: 50px;
  }
}

@media (min-width: 62em) {
  .map-wrap {
    height: calc(100vh - 60px); /* calculate height of the screen minus the heading */
  }

  .fr-header__body-row{
    padding:0.75rem 0;
  }
  
}

#titleMap {
  display: block;
}

#legendMap {
  display: block;
}

.menu{
  min-width: 400px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 20px;
}

.input-adresse{
    width: 350px;
}


.watermark {
  position: absolute;
  left: 10px;
  bottom: 10px;
  z-index: 999;
}

.tooltip{
  position: fixed;
  min-width: 200px;
  max-width: 450px;
  background-color: white;
  z-index: 999;
  border-radius: 5px;
  padding-top: 10px;
  padding-bottom: 10px;
}

.tooltip-title{
  border-radius: 5px;
  color: black;
  font-weight: bold;
  padding-left: 10px;
  padding-right: 10px;
  font-size: 14px;
}


.tooltip-value{
  font-size: 12px;
  padding-left: 10px;
  padding-right: 10px;
  padding: 5px;
}

.tooltip-value{
  font-style: italic;
  padding-left: 10px;
}

.tooltip-value-grey{
  color: #AAAAAA
}

.legendMap-colors{
  display: flex;
  width: 100%;
  padding-left: 5px;
  padding-right: 5px;
}

.legendMap-color{
  width: 100%;
  margin: auto;
}

.legendMap-color-green{
  background-color: #67A532;
  height: 10px;
  margin-right: 5px;
}

.legendMap-color-orange{
  background-color: #C8AA39;
  height: 10px;
  margin-right: 5px;
}

.legendMap-color-red{
  background-color: #FA7A35;
  height: 10px;
}

.legendMap-title{
  margin-left: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
}

.tootlip-content{
  padding-left: 5px;
}

.csvapi .fr-btn{
  border-radius: 0px;
}

.autocomplete-container {
  position: relative;
}

.autocomplete {
  position: absolute;
  top: 40px;
  border-top: 1px solid #ebebeb;
  width: 100%;
}

.autocomplete-item {
  width: 100%;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #ebebeb;
  border-left: 1px solid #ebebeb;
  border-right: 1px solid #ebebeb;
  background-color: white;
  padding-left: 10px;
  padding-right: 10px;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.autocomplete-item:hover{
  background-color: #3558A2;
  color: white;
}

.autocomplete-item-select{
  background-color: #3558A2;
  color: white;
}

.subtitle {
  font-size: 1rem;
  font-weight: bold;
  line-height: 1.2;
  cursor: pointer;
}

.nb-legend {
  font-size: 11px;
}

.mapboxgl-map::v-deep .maplibregl-ctrl-attrib a::after {
  content: none;
}

.label-rupture{
  font-size: 13px;
  font-weight: bold;
  font-style: italic;
}
</style>