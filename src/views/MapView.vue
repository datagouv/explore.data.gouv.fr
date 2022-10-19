<template>
  <div class="fr-container--fluid">
    <header role="banner" class="fr-header">
      <div class="fr-header__body">
          <div class="fr-container--fluid fr-px-2w">
              <div class="fr-header__body-row">
                  <div class="fr-header__brand fr-enlarge-link">
                      <div class="fr-header__brand-top">
                          <div class="fr-header__logo">
                            <h1 class="subtitle fr-m-0">explorateur de données
                                <span class="fr-badge fr-badge--info fr-badge--no-icon">BETA</span>
                            </h1>
                            <svg role="img" aria-label="data.gouv.fr" width="131" cursor="pointer" height="22" class="logotype" viewBox="0 0 131 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.21406 16.5782H12.0479V1.99277H9.21406V7.20431C8.19129 6.25324 7.01894 5.7777 5.65524 5.7777C2.71536 5.7777 0.328 8.03661 0.328 11.3267C0.328 14.5569 2.84293 16.8562 5.71946 16.8562C7.14739 16.8562 8.21284 16.3803 9.21406 15.4683V16.5782ZM6.23151 8.19541C8.02104 8.19541 9.34164 9.44386 9.34164 11.2871C9.34164 13.2094 7.97793 14.4381 6.23151 14.4381C4.46222 14.4381 3.18386 13.114 3.18386 11.3104C3.18386 9.58595 4.35576 8.20025 6.23107 8.20025L6.23151 8.19541ZM23.2809 16.5782H26.1147V6.05484H23.2809V7.20431C22.2581 6.25324 21.0858 5.7777 19.7221 5.7777C16.7817 5.7777 14.3948 8.03661 14.3948 11.3267C14.3948 14.5569 16.9097 16.8562 19.7863 16.8562C21.216 16.8562 22.2805 16.3803 23.2835 15.4683V16.5782H23.2809ZM20.2983 8.19541C22.0874 8.19541 23.4084 9.44386 23.4084 11.2871C23.4084 13.2094 22.0447 14.4381 20.2983 14.4381C18.529 14.4381 17.2507 13.114 17.2507 11.3104C17.2507 9.58595 18.4226 8.20025 20.2979 8.20025L20.2983 8.19541V8.19541ZM29.3142 6.05484H27.8656V8.31419H29.3146V16.5782H32.152V8.31419H33.8368V6.05484H32.1564V2.17049H29.3234V6.05484H29.3142V6.05484ZM43.7562 16.5782H46.5905V6.05484H43.7562V7.20431C42.7339 6.25324 41.562 5.7777 40.1983 5.7777C37.2575 5.7777 34.871 8.03661 34.871 11.3267C34.871 14.5569 37.3855 16.8562 40.2621 16.8562C41.69 16.8562 42.7554 16.3803 43.7566 15.4683V16.5782H43.7562ZM40.7737 8.19541C42.5641 8.19541 43.8847 9.44386 43.8847 11.2871C43.8847 13.2094 42.521 14.4381 40.7737 14.4381C39.0052 14.4381 37.7264 13.114 37.7264 11.3104C37.7264 9.58595 38.8983 8.20025 40.7737 8.20025V8.19541V8.19541ZM51.0049 13.8235C50.1097 13.8235 49.3641 14.4777 49.3641 15.3298C49.3641 16.1621 50.1097 16.8562 51.0049 16.8562C51.9213 16.8562 52.6238 16.1621 52.6238 15.3298C52.6238 14.4975 51.8997 13.8235 51.0049 13.8235V13.8235ZM66.6092 6.05484H63.7749V7.20431C62.7095 6.27303 61.6018 5.7777 60.195 5.7777C57.318 5.7777 54.9073 7.91784 54.9073 11.1678C54.9073 14.3189 57.2916 16.5787 60.3401 16.5787C61.8094 16.5787 62.83 16.1225 63.7714 15.2704C63.7714 16.2611 63.7494 16.9746 63.0676 17.5693C62.5573 18.0048 61.7039 18.26 60.6569 18.26C59.4603 18.26 58.6113 17.9828 58.0351 17.3494H54.9029C55.6684 19.5489 57.6479 20.6795 60.7625 20.6795C62.4869 20.6795 63.8506 20.3011 64.8712 19.5093C66.1689 18.4799 66.5956 17.1118 66.5956 15.0707V6.05264L66.6092 6.05484V6.05484ZM60.8333 8.19541C62.7086 8.19541 63.9232 9.50325 63.9232 11.2074C63.9232 12.9912 62.6233 14.1605 60.876 14.1605C59.1075 14.1605 57.7645 12.9319 57.7645 11.1876C57.7645 9.56264 58.958 8.19541 60.8328 8.19541H60.8333ZM74.7945 5.7777C71.7046 5.7777 68.935 8.13559 68.935 11.3267C68.935 14.4183 71.5348 16.8562 74.8156 16.8562C78.2676 16.8562 80.8027 14.3585 80.8027 11.3069C80.8027 8.19541 78.0973 5.77726 74.7945 5.77726V5.7777ZM74.8372 8.2746C76.6909 8.2746 77.9482 9.54284 77.9482 11.3267C77.9482 13.1698 76.5845 14.3585 74.8372 14.3585C73.0045 14.3585 71.79 13.0902 71.79 11.3069C71.79 9.56264 73.0683 8.2746 74.8372 8.2746V8.2746ZM83.0977 10.8709C83.0977 11.7428 83.055 12.2381 83.2042 13.0902C83.6515 15.5475 85.3351 16.836 88.0625 16.836C89.6391 16.836 90.811 16.4401 91.7062 15.5075C92.9027 14.2793 93.0303 12.8527 93.0303 10.9105V6.05484H90.1973V11.6636C90.1973 13.447 89.5815 14.4183 88.0682 14.4183C86.5769 14.4183 85.939 13.4272 85.939 11.5444V6.0544H83.1061V10.8714L83.0977 10.8709V10.8709ZM99.5167 16.5782H101.349L106.165 6.05484H103.288L100.433 12.2575L97.578 6.05484H94.6791L99.5136 16.5782H99.5167Z" fill="#373C42"></path>
                                <path d="M108.541 14.4926C108.9 14.4926 109.201 14.6091 109.443 14.8419C109.693 15.0648 109.819 15.3405 109.819 15.6689C109.819 15.9945 109.694 16.2731 109.443 16.5048C109.194 16.7306 108.893 16.8435 108.541 16.8435C108.192 16.8435 107.892 16.7306 107.64 16.5048C107.399 16.2701 107.279 15.9901 107.279 15.6645C107.279 15.339 107.401 15.0633 107.644 14.8375C107.896 14.6029 108.197 14.4856 108.546 14.4856L108.541 14.4926ZM120.43 6.31262L120.205 7.08158H118.376L116.998 12.1739C116.388 14.4189 115.774 16.155 115.156 17.3824C114.279 19.1144 113.335 20.3107 112.324 20.9711C111.556 21.4761 110.788 21.7286 110.019 21.7286C109.521 21.7286 109.096 21.5887 108.744 21.309C108.486 21.1148 108.357 20.8623 108.357 20.5514C108.357 20.303 108.465 20.0856 108.682 19.8991C108.89 19.7202 109.15 19.6307 109.461 19.6307C109.687 19.6307 109.879 19.6967 110.037 19.8287C110.19 19.9606 110.266 20.1123 110.266 20.2835C110.266 20.4536 110.178 20.612 110.002 20.7586C109.87 20.8671 109.804 20.9478 109.804 21.0006C109.804 21.071 109.833 21.1252 109.892 21.1633C109.968 21.2161 110.085 21.2425 110.244 21.2425C110.604 21.2425 110.984 21.1369 111.383 20.9258C111.776 20.7146 112.127 20.3994 112.434 19.98C112.745 19.5665 113.037 18.9682 113.31 18.1852C113.427 17.8597 113.741 16.7834 114.251 14.9563L116.428 7.07366H114.25L114.425 6.30383C115.118 6.30383 115.601 6.2613 115.877 6.17625C116.153 6.08241 116.404 5.91128 116.629 5.66289C116.864 5.40598 117.165 4.93235 117.531 4.242C118.024 3.3094 118.496 2.58649 118.948 2.07327C119.566 1.38203 120.214 0.865438 120.89 0.523486C121.574 0.174496 122.216 0 122.817 0C123.451 0 123.959 0.151327 124.344 0.453981C124.728 0.749303 124.92 1.0719 124.92 1.42177C124.92 1.69334 124.825 1.92238 124.634 2.1089C124.44 2.29454 124.194 2.38736 123.895 2.38736C123.635 2.38736 123.422 2.31697 123.254 2.17621C123.096 2.03544 123.017 1.86827 123.017 1.67471C123.017 1.55154 123.071 1.40051 123.18 1.22161C123.288 1.03392 123.342 0.909282 123.342 0.847695C123.342 0.739185 123.305 0.657803 123.229 0.603548C123.121 0.524952 122.962 0.485654 122.754 0.485654C122.228 0.485654 121.756 0.641087 121.338 0.951952C120.778 1.364 120.276 2.00919 119.833 2.88753C119.607 3.34503 119.194 4.48292 118.593 6.30119H120.431L120.43 6.31262V6.31262Z" fill="#373C42"></path>
                                <path d="M121.282 6.68567L125.605 6.03285L123.801 11.6962C125.262 9.37348 126.59 7.74994 127.784 6.82556C128.461 6.29709 129.012 6.03285 129.439 6.03285C129.714 6.03285 129.931 6.11057 130.09 6.266C130.249 6.41352 130.328 6.63112 130.328 6.91882C130.328 7.43145 130.186 7.92077 129.901 8.38678C129.701 8.73635 129.413 8.91114 129.037 8.91114C128.845 8.91114 128.678 8.85293 128.536 8.7365C128.402 8.61978 128.319 8.44089 128.285 8.19982C128.269 8.0526 128.231 7.95582 128.173 7.90948C128.106 7.84702 128.027 7.81578 127.935 7.81578C127.793 7.81578 127.659 7.84687 127.534 7.90904C127.317 8.01755 126.987 8.31962 126.544 8.81525C125.851 9.57481 125.099 10.5617 124.289 11.7758C123.937 12.289 123.636 12.8668 123.387 13.509C123.035 14.3947 122.834 14.927 122.785 15.1059L122.384 16.5708H120.466L122.785 9.33433C123.051 8.49558 123.185 7.89731 123.185 7.53952C123.185 7.39875 123.122 7.28145 122.996 7.1876C122.829 7.06149 122.607 6.99844 122.331 6.99844C122.155 6.99844 121.833 7.03217 121.364 7.09962L121.276 6.66851L121.282 6.68567V6.68567Z" fill="#373C42"></path>
                            </svg>
                          </div>
                          <div class="fr-header__navbar">
                              <button class="fr-btn--search fr-btn" data-fr-opened="false" aria-controls="modal-541" id="button-542" title="Rechercher">
                                  Rechercher
                              </button>
                          </div>
                      </div>
                      <div v-if="dateMaj" class="fr-header__service fr-hidden-md">
                        <p class="fr-header__service-tagline">Mis à jour le {{ dateMaj }}</p>
                    </div>
                  </div>
                  <div class="fr-header__tools">
                      <div class="fr-header__search fr-modal" id="modal-541">
                          <div class="fr-container fr-container-lg--fluid">
                              <button class="fr-btn--close fr-btn" aria-controls="modal-541" title="Fermer" ref="modalCloseButton">
                                  Fermer
                              </button>
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
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </header>
    <div>
      <div v-if="tooltip.properties" class="tooltip" :style="{top:tooltip.top,left:tooltip.left, display:tooltip.display}">
          <div v-if="tooltip.properties.adr" class="tooltip-title">{{ tooltip.properties.adr }}</div>
          <div v-if="tooltip.properties.cpl_adr" class="tooltip-title">{{ tooltip.properties.cpl_adr }}</div>
          <div v-if="tooltip.properties[currentFuel + '_maj']" class="tooltip-value tooltip-value-italic">
            {{ isoToDateFr(tooltip.properties[currentFuel + '_maj']) }}
          </div>
          <div class="tootlip-content">
            <span v-for="item in ['SP95', 'E10', 'SP98', 'Gazole']" :key="item">
              <span v-if="tooltip.properties[item] != 'R'">
                <div v-if="tooltip.properties[item]" class="tooltip-value">
                  <span v-if="tooltip.properties[item + '_color'] === '1'">
                    <img src="../static/images/dispo-green.png" width="12" alt="" />
                  </span>
                  <span v-if="tooltip.properties[item + '_color'] === '2'">
                    <img src="../static/images/dispo-orange.png" width="12" alt="" />
                  </span>
                  <span v-if="tooltip.properties[item + '_color'] === '3'">
                    <img src="../static/images/dispo-red.png" width="12" alt="" />
                  </span>
                  {{ fuelFr[item] }} : {{ tooltip.properties[item] }} €
                </div>
              </span>
              <span v-else>
                <div v-if="tooltip.properties[item]" class="tooltip-value tooltip-value-grey">
                  <span>
                    <img src="../static/images/caution-sign.png" width="12" alt="" />
                    {{ fuelFr[item] }} : En rupture
                  </span>
                </div>
              </span>
            </span>
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
                      <p v-if="dateMaj">Mis à jour le {{ dateMaj }}</p>
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
                      </select>
                      <div class="fr-toggle fr-my-1v">
                          <input 
                            v-model="showRupture" 
                            type="checkbox" 
                            class="fr-toggle__input" 
                            aria-describedby="toggle-698-hint-text" 
                            id="checkbox"
                            @change="displayRupture"
                          >
                          <label 
                            class="fr-toggle__label"
                            for="checkbox"
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
                      <div v-if="this.legend.percentRupture" class="fr-my-5v">
                        <div class="fr-text--bold fr-mb-1v">Stations en rupture de {{ currentFuel }}* :</div>
                          {{ this.legend.percentRupture }} %
                      </div>
                      <div v-if="valuesx && valuesy">
                        <bar-or-graph indicateur="toto" color="#3558a2" :titleChart="titleChart" unitChart="€" typeChart="line" :valuesx="valuesx" :valuesy="valuesy"></bar-or-graph>
                      </div>
                      <br />
                      <div class="nb-legend">
                        <i>* Les ruptures ne sont comptabilisées qu'à partir du 15 septembre 2022</i>
                        <br />
                        <i><b>Point d'attention : les données affichées sont à la date J-1 (veille du jour en cours).</b></i>
                        <br />
                        <i>Les sources de données utilisées pour réaliser cette application <a href="https://www.data.gouv.fr/fr/datasets/prix-des-carburants-en-france-flux-instantane/"><u>sont disponibles sur data.gouv.fr</u></a> et <a href="https://explore.data.gouv.fr/?url=https://www.data.gouv.fr/fr/datasets/r/64e02cff-9e53-4cb2-adfd-5fcc88b2dc09"><u>sont explorables ici.</u></a></i>
                        <i> Celles-ci sont mises à disposition par le Ministère de l'Économie, des Finances et de la Souveraineté industrielle.
                        Pour plus d'informations rendez-vous sur le site officiel.</i>
                      </div>
                      <br />
                    </div>
                </div>
            </div>
          </nav>
        </div>
        <div id="map" class="map fr-col-12 fr-col-md-8 fr-col-xl-9" ref="mapContainer">
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
import { Map } from 'maplibre-gl';
import BarOrGraph from '@/components/BarOrGraph.vue'

import { markRaw } from 'vue';
import styleVector from '../static/json/vector.json'
import CenterDeps from '../static/json/centers_deps.json'
import * as d3 from 'd3-scale'

export default {
  name: 'MapView',
  components: {Map, markRaw, BarOrGraph},
  data() {
    return {
      map: Object,
      fuelFr: {
        SP95: 'SP 95',
        SP98: 'SP 98',
        Gazole: 'Gazole',
        E10: 'SP 95-E10'
      },
      titleFr: {
        SP95: 'Stations disposant du Sans Plomb 95 et prix associés',
        SP98: 'Stations disposant du Sans Plomb 98 et prix associés',
        Gazole: 'Stations disposant du Gazole et prix associés',
        E10: 'Stations disposant du Sans Plomb 95 (E10) et prix associés',
      },
      titleFrRupture: {
        SP95: 'Stations en rupture de Sans Plomb 95',
        SP98: 'Stations en rupture de Sans Plomb 98',
        Gazole: 'Stations en rupture de Gazole',
        E10: 'Stations en rupture de Sans Plomb 95 (E10)',
      },
      legend: {
        minPrix: null,
        tertilePrix1: null,
        tertilePrix2: null,
        meanPrix: null,
        medianPrix: null,
        percentRupture: null,
      },
      tooltip: {
        top: '100px',
        left: '300px',
        display: 'none',
        properties: null,
      },
      dataChloropleth: null,
      dataPoints: null,
      partialData: null,
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
    
    fetch('https://data.explore.data.gouv.fr/synthese_france.json')
    .then((response) => {
        return response.json()
    })
    .then((data) => {
      this.dataPoints = JSON.parse(JSON.stringify(data))
      this.partialData = JSON.parse(JSON.stringify(data))
      this.partialData.features =  this.partialData.features.filter(feature => (feature.properties[this.currentFuel] & feature.properties[this.currentFuel] != "R"))

      this.legend.minPrix = 0
      this.legend.tertilePrix1 = data.properties[this.currentFuel][1]
      this.legend.tertilePrix2 = data.properties[this.currentFuel][2]
      this.legend.maxPrix = data.properties[this.currentFuel][3]
      this.legend.meanPrix = parseFloat(data.properties[this.currentFuel + "_mean"]).toFixed(2)
      this.legend.medianPrix = parseFloat(data.properties[this.currentFuel + "_median"]).toFixed(2)
      this.legend.percentRupture = parseFloat(data.properties[this.currentFuel + "_rupture"]).toFixed(2)

      let dateMaj = new Date(data.properties.maj);
      this.dateMaj = dateMaj.getDate() + "/" + (dateMaj.getMonth()+1) + "/" + dateMaj.getFullYear()
      
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

        this.map.on('mousemove', this.showMapTooltip);
        this.map.on('touchmove', this.showMapTooltip);
        this.map.on('click', this.showMapTooltip);

        this.map.on('mouseleave', 'stations', (e) => {
          this.tooltip.display = 'none'
        });
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
    displayRupture() {
      if(this.showRupture) {  
        let paintProperties = [
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
        this.map.setPaintProperty("stations", "circle-color", paintProperties)
      } else {
        let paintProperties = [
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
        this.map.setPaintProperty("stations", "circle-color", paintProperties)
      }
    
    },
    goToFirstResult() {
      if(this.firstResult){
        this.moveTo(this.firstResult.geometry.coordinates, 13)
      }
    },
    isoToDateFr(maj) {
      let date = new Date(maj);
      return "MAJ: " + date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear() + " à " + date.getHours() + "H" + date.getMinutes()
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
      this.$refs.modalCloseButton.click()
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
    changeMap() {
      //this.showRupture = false;
      this.legend.minPrix = 0
      this.legend.tertilePrix1 = this.partialData.properties[this.currentFuel][1]
      this.legend.tertilePrix2 = this.partialData.properties[this.currentFuel][2]
      this.legend.maxPrix = this.partialData.properties[this.currentFuel][3]
      this.legend.meanPrix = parseFloat(this.partialData.properties[this.currentFuel + "_mean"]).toFixed(2)
      this.legend.medianPrix = parseFloat(this.partialData.properties[this.currentFuel + "_median"]).toFixed(2)
      this.legend.percentRupture = parseFloat(this.partialData.properties[this.currentFuel + "_rupture"]).toFixed(2)

      let paintProperties = [
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

      if(this.showRupture){
        paintProperties = [
          'match',
          ['get', this.currentFuel + '_color'],
          "0",
          "#000000",
          "1",
          '#67A532',
          "2",
          '#C8AA39',
          "3",
          '#FA7A35',
          /* other */ 'hsla(0%, 0%, 0%, 0)'
        ]

      }
      this.map.setPaintProperty("stations", "circle-color", paintProperties)

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
      }, 1000)
    },
  },
  watch: {
  }
}
</script>

<style scoped>
@import '~maplibre-gl/dist/maplibre-gl.css';

.fr-container--fluid .fr-sidemenu {
  margin-left: 0;
  margin-right: 0;
}

@media (min-width: 48em) {
  .fr-sidemenu--sticky .fr-sidemenu__inner {
    max-height: calc(100vh - 106px);
    padding: 1.25rem;
  }
}

.map-wrap {
  height: calc(100vh - 124px); /* calculate height of the screen minus the heading */
}

.map {
  width: 100%;
  height: calc(100% - 48px);
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
  width: 400px;
  height: 80px;
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

@media (min-width: 48em) {
  .map {
    height: 100%;
  }
    
  #legendMap {
    width: 500px;
  }

  #titleMap {
    bottom: 2rem;
  }
}

@media (min-width: 62em) {
  .map-wrap {
    height: calc(100vh - 100.5px); /* calculate height of the screen minus the heading */
  }

  .autocomplete {
    right: 2.5rem;
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
  color: #777777
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
  z-index: 1000;
  border-top: 1px solid #ebebeb;
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
</style>