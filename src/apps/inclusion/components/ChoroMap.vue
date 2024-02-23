<template>
  <div class="choroMap">
    <search-bar></search-bar>
    <div
      ref="mapTooltip"
      class="map_tooltip"
      v-show="tooltip.visibility == 'visible'"
      :style="{ top: tooltip.top, left: tooltip.left }"
    >
      <div class="tooltip_body">
        <b>{{ tooltip.place }}</b>
        <div v-if="tooltip.value" class="tooltip_place">
          <b>{{ tooltip.value }}</b> {{ mappingUnits[activeFilter] }}
        </div>
      </div>
    </div>
    <div
      ref="mapTooltipPoints"
      class="map_tooltip"
      v-show="tooltipPoints.visibility == 'visible'"
      :style="{ top: tooltipPoints.top, left: tooltipPoints.left }"
    >
      <div class="tooltip_body">
        <div v-if="tooltipPoints.value" class="tooltip_place">
          <b>{{ tooltipPoints.value }}</b>
        </div>
      </div>
    </div>
    <div class="map_container" ref="mapContainer"></div>
    <div v-if="zoomLevel < 8" class="leg_container">
      <div class="color_blocks">
        <span class="leg_title"
          >{{ mappingTitles[activeFilter] }}
          <span v-if="activeSubFilter"
            ><i>"{{ activeSubFilterName }}"</i></span
          ></span
        >
        <span class="leg_borne min"> {{ legMin }}</span>
        <span class="leg_borne pivot">{{ legPivot }}</span>
        <span class="leg_borne max"> {{ legMax }}</span>
      </div>
    </div>
    <div class="leg_container2" @click="changeMapStyle()">
      <span v-if="mapStyle === 'vector'"
        ><img src="../assets/images/preview-ortho.png" width="50" height="50"
      /></span>
      <span v-if="mapStyle === 'ortho'"
        ><img src="../assets/images/preview-vector.png" width="50" height="50"
      /></span>
    </div>
  </div>
</template>

<script>
import appStore from "@/apps/inclusion/store";
import SearchBar from "@/apps/inclusion/components/SearchBar";

import { Map, GeolocateControl } from "maplibre-gl";

import { markRaw } from "vue";
import styleVector from "@/apps/inclusion/assets/json/vector-inclusion.json";
import CenterDeps from "@/apps/inclusion/assets/json/centers_deps.json";

import * as d3 from "d3-scale";

export default {
  name: "ChoroMap",
  components: { Map, markRaw, SearchBar },
  data() {
    return {
      map: Object,
      dataChloropleth: {
        fra: [],
        departement: [],
        commune: [],
      },
      legMin: 0,
      legMax: 0,
      legPivot: 0,
      tooltip: {
        top: "0px",
        left: "0px",
        display: "block",
        visibility: "",
        value: 0,
        date: "",
        place: "NaN",
      },
      tooltipPoints: {
        top: "0px",
        left: "0px",
        display: "block",
        visibility: "",
        value: 0,
        date: "",
        place: "NaN",
      },
      fetching: false,
      mappingUnits: {
        stats_structures: "structures",
        stats_services: "services",
      },
      mappingTitles: {
        stats_structures: "Nombre de structures référencées",
        stats_services: "Nombre de services référencées",
        stats_labels: "Labels ",
        stats_thematiques: "Thématiques ",
        stats_profils: "Profils ",
        stats_frais: "Frais de type ",
        stats_modes_accueil: "Mode d'accueil ",
        stats_typologie_services: "Type de service ",
        stats_typologie_structures: "Type de structure ",
      },
      mappingKpiType: {
        stats_structures: "structure",
        stats_services: "service",
      },
      mappingDepFile: {
        stats_structures: "type",
        stats_services: "type",
        stats_labels: "labels",
        stats_thematiques: "thematiques",
        stats_profils: "profils",
        stats_frais: "frais",
        stats_modes_accueil: "modes_accueil",
        stats_typologie_services: "types",
        stats_typologie_structures: "typologie",
      },
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
      mapStyle: "vector",
      waitZoom: false,
    };
  },
  computed: {
    saveApiUrl: function () {
      return appStore.state.saveApiUrl;
    },
    actualData: function () {
      return appStore.state.actualData;
    },
    saveApiResponse: function () {
      return appStore.state.saveApiResponse;
    },
    mouseLocation: function () {
      return appStore.state.mouseLocation;
    },
    userLocation: function () {
      return appStore.state.userLocation;
    },
    mapProperties: function () {
      return appStore.state.mapProperties;
    },
    lng: function () {
      return appStore.state.mapProperties.lng;
    },
    lat: function () {
      return appStore.state.mapProperties.lat;
    },
    centerLng: function () {
      return appStore.state.mapProperties.centerLng;
    },
    centerLat: function () {
      return appStore.state.mapProperties.centerLat;
    },
    zoom: function () {
      return appStore.state.mapProperties.zoom;
    },
    zoomLevel: function () {
      return appStore.state.mapProperties.zoomLevel;
    },
    dep: function () {
      return appStore.state.userLocation.dep;
    },
    level: function () {
      return appStore.state.userLocation.level;
    },
    activeFilter: function () {
      return appStore.state.activeFilter;
    },
    activeSubFilter: function () {
      return appStore.state.activeSubFilter;
    },
    activeSubFilterName: function () {
      return appStore.state.activeSubFilterName;
    },
    searchBarCoordinates: function () {
      return appStore.state.searchBarCoordinates;
    },
  },
  mounted() {
    appStore.commit("changeZoomLevel", 4.8);
    appStore.commit("changeMapLng", 2);
    appStore.commit("changeMapLat", 46.3);
    appStore.commit("changeMapInit", true);
    this.changeLocation("changeUserLocation", "fra", null, null);

    let obj = {};
    for (const [key, value] of Object.entries(this.$route.query)) {
      if (!key.includes("__")) {
        obj[key] = value;
      }
    }
    this.$router.push({ path: this.$route.path, query: obj }).catch(() => {});
    // Au load de la page, on récupère les stats au niveau EPCI pour l'affichage carte
    let url = "https://files.data.gouv.fr/data-inclusion/stats_general.json";
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.sendApiResultToStore(url, data);
        let structData = data.filter(
          (d) => d.type == this.mappingKpiType[this.activeFilter]
        );
        appStore.commit("addActualData", structData);
        let matchExpression = this.changeChloroplethColors(
          "dep",
          "value",
          "code"
        );

        // Create map
        this.map = markRaw(
          new Map({
            container: this.$refs.mapContainer,
            style: styleVector,
            center: [this.lng, this.lat],
            zoom: this.zoomLevel,
          })
        );

        // On map load, add its layers
        this.map.on("load", (m) => {
          const departementsFillLayer = {
            id: `departements_fill`,
            type: "fill",
            source: "decoupage-administratif-dep",
            "source-layer": "departements",
            paint: {
              "fill-color": matchExpression,
              "fill-opacity": 1,
            },
          };

          const departementsFillLayer2 = {
            id: `departements_fill2`,
            type: "fill",
            source: "decoupage-administratif-dep",
            "source-layer": "departements",
            paint: {
              "fill-opacity": 0,
            },
            minzoom: 8,
          };

          const departementsLineLayer = {
            id: `departements_line`,
            type: "line",
            source: "decoupage-administratif-dep",
            "source-layer": "departements",
            layout: {
              "line-cap": "round",
              "line-join": "round",
            },
            paint: {
              "line-opacity": 0.8,
              "line-color": "rgb(255,255,255)",
              "line-width": 1.5,
            },
          };

          this.map.addSource("inclusion_datapoints", {
            type: "geojson",
            data: null,
          });
          const inclusionPoints = {
            id: "inclusion_points",
            type: "circle",
            source: "inclusion_datapoints",
            paint: {
              // Make circles larger as the user zooms from z12 to z22.
              "circle-radius": {
                base: 3.75,
                stops: [
                  [3, 3],
                  [12, 10],
                  [18, 60],
                ],
              },
              // Color circles by ethnicity, using a `match` expression.
              "circle-color": "#060091",
            },
            minzoom: 1,
          };

          this.map.addLayer(departementsFillLayer);
          this.map.addLayer(departementsFillLayer2);
          this.map.addLayer(departementsLineLayer);
          this.map.addLayer(inclusionPoints);

          this.map.on("click", "departements_fill", (e) => {
            // si on est au niveau france
            // ou
            // si on est au niveau département et que le dep userlocation != dep mouselocation
            if (
              this.userLocation.level == "fra" ||
              (this.userLocation.level == "departement" &&
                this.userLocation.dep != this.mouseLocation.dep)
            ) {
              let depBonus = ["75", "92", "93", "94"];
              let bonus = 0;
              if (depBonus.includes(e.features[0].properties.code)) {
                bonus = 1.8;
              }
              this.changeDep = true;
              this.map.flyTo({
                center: CenterDeps[e.features[0].properties.code].coordinates,
                zoom: 9 + bonus,
              });
            }
          });

          // when user move on layer departement
          this.map.on("mousemove", "departements_fill", (e) => {
            let depId = e.features[0]["properties"]["code"];
            let depName = e.features[0]["properties"]["nom"];
            // if it is not the actual displaying departement or
            // the actual mouseover departement (if there is a change)
            if (
              this.userLocation.dep != depId &&
              this.mouseLocation.dep != depId
            ) {
              // if we are on france level, we display the name of the departement
              if (this.userLocation.level == "fra") {
                this.fetchTooltipData("departement", depId, depName);
                //this.tooltip.place = e.features[0]["properties"]["nom"]
              }
              // we display in light grey the background of departement mouseovered
              let matchExpression = 0;
              matchExpression = ["match", ["get", "code"]];
              matchExpression.push(depId, 0.4);
              matchExpression.push(1);
              this.map.setPaintProperty(
                "departements_fill",
                "fill-opacity",
                matchExpression
              );
              if (!this.changeDep) {
                this.displayTooltip(e);
                this.mousePosition.dep.code = depId;
                this.mousePosition.dep.nom = e.features[0]["properties"]["nom"];
                this.changeLocation(
                  "changeMouseLocation",
                  "departement",
                  depId,
                  depName
                );
              }
            }
          });

          // when user move on layer departement
          this.map.on("mousemove", "departements_fill2", (e) => {
            let depId = e.features[0]["properties"]["code"];

            if (depId != this.userLocation.dep) {
              matchExpression = ["match", ["get", "code"]];
              matchExpression.push(depId, 0.4);
              matchExpression.push(0);
              this.map.setPaintProperty(
                "departements_fill2",
                "fill-opacity",
                matchExpression
              );
            }
          });

          // when user move on layer departement
          this.map.on("click", "departements_fill2", (e) => {
            let depId = e.features[0]["properties"]["code"];
            if (depId != this.userLocation.dep) {
              this.changeLocation(
                "changeMouseLocation",
                "departement",
                depId,
                e.features[0]["properties"]["nom"]
              );
              this.changeLocation("changeUserLocation", "fra", null, null);
              this.changeDep = true;

              let depBonus = ["75", "92", "93", "94"];
              let bonus = 0;
              if (depBonus.includes(e.features[0].properties.code)) {
                bonus = 1.8;
              }

              this.map.flyTo({
                center: CenterDeps[e.features[0].properties.code].coordinates,
                zoom: 9 + bonus,
              });
            }
          });

          this.map.on("mouseleave", "departements_fill", (e) => {
            this.hideTooltip();
          });
        });

        this.map.on("zoom", (m) => {
          appStore.commit("changeZoomLevel", this.map.getZoom());
        });

        this.map.on("click", (e) => {
          appStore.commit("addDetailData", null);
          if (this.zoomLevel > 8) {
            this.checkIfPoint(e);
          }
        });

        this.map.on("mousemove", (e) => {
          appStore.commit("changeMapLat", e.lngLat.wrap().lat);
          appStore.commit("changeMapLng", e.lngLat.wrap().lng);
          this.showMapTooltip(e);
        });

        this.map.on("move", (e) => {
          appStore.commit("changeCenterMapLat", this.map.getCenter().lat);
          appStore.commit("changeCenterMapLng", this.map.getCenter().lng);
        });

        this.map.on("moveend", (e) => {
          this.waitZoom = false;
          this.fetching = false;
        });

        this.map.on("load", (e) => {
          setTimeout((e) => {
            if (
              this.$route.query.level &&
              this.$route.query.level === "departement"
            ) {
              this.mousePosition.dep.code = this.$route.query.code;
              this.mousePosition.dep.nom =
                CenterDeps[this.$route.query.code]["nom"];
              this.changeDep = true;
            }
            if (
              this.$route.query.lat &&
              this.$route.query.lng &&
              this.$route.query.zoom
            ) {
              let url =
                "https://geo.api.gouv.fr/communes?lat=" +
                this.$route.query.lat +
                "&lon=" +
                this.$route.query.lng;
              fetch(url)
                .then((response) => {
                  return response.json();
                })
                .then((data) => {
                  if (data[0] && data[0]["codeDepartement"]) {
                    this.changeLocation(
                      "changeUserLocation",
                      "departement",
                      data[0]["codeDepartement"],
                      CenterDeps[data[0]["codeDepartement"]]["nom"]
                    );
                    this.changeLocation(
                      "changeMouseLocation",
                      "departement",
                      data[0]["codeDepartement"],
                      CenterDeps[data[0]["codeDepartement"]]["nom"]
                    );
                  }
                  this.fetching = true;
                  this.map.flyTo({
                    center: [this.$route.query.lng, this.$route.query.lat],
                    zoom: this.$route.query.zoom,
                  });
                });
            }
          }, 500);
        });

        this.map.addControl(
          new GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true,
            },
            trackUserLocation: true,
          })
        );
      });
  },
  methods: {
    checkIfPoint(e) {
      var width = 10;
      var height = 10;
      let features = this.map.queryRenderedFeatures(
        [
          [e.point.x - width / 2, e.point.y - height / 2],
          [e.point.x + width / 2, e.point.y + height / 2],
        ],
        {
          layers: ["inclusion_points"],
        }
      );
      features = features.filter(
        (feature) => feature.layer.paint["circle-color"].a > 0
      );
      if (features && features.length > 0) {
        this.retrieveDetailInclusion(features[0]["properties"]);
      }
    },
    retrieveDetailInclusion(obj) {
      let url =
        "https://api.data.inclusion.beta.gouv.fr/api/v0/" +
        obj["type"] +
        "s/" +
        obj["source"] +
        "/" +
        obj["id"];
      let data = null;
      if (this.saveApiUrl.includes(url)) {
        data = this.saveApiResponse[url];
        appStore.commit("addDetailData", data);
      } else {
        const headers = {
          Authorization: "Bearer " + process.env.VUE_APP_INCLUSION_TOKEN,
        };
        fetch(url, { headers })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            this.sendApiResultToStore(url, data);
            appStore.commit("addDetailData", data);
          });
      }
    },
    showMapTooltip(e) {
      var width = 10;
      var height = 10;
      let features = this.map.queryRenderedFeatures(
        [
          [e.point.x - width / 2, e.point.y - height / 2],
          [e.point.x + width / 2, e.point.y + height / 2],
        ],
        {
          layers: ["inclusion_points"],
        }
      );
      features = features.filter(
        (feature) => feature.layer.paint["circle-color"].a > 0
      );
      if (features && features.length > 0) {
        this.tooltipPoints.top =
          (
            this.$refs.mapContainer.getBoundingClientRect().y +
            e.point.y +
            10
          ).toString() + "px";
        this.tooltipPoints.left =
          (
            this.$refs.mapContainer.getBoundingClientRect().x +
            e.point.x +
            10
          ).toString() + "px";
        this.tooltipPoints.display = "block";
        this.tooltipPoints.properties = features[0].properties;
        this.tooltipPoints.visibility = "visible";
        this.tooltipPoints.value = "Cliquez pour le détail";
      } else {
        this.tooltipPoints.display = "none";
        this.tooltipPoints.visibility = "none";
      }
    },
    changeMapStyle() {
      if (this.mapStyle === "vector") {
        this.mapStyle = "ortho";
        this.map.setLayoutProperty("simple-tiles", "visibility", "visible");
        this.map.setLayoutProperty("background", "visibility", "none");
        this.map.setLayoutProperty("landcover-grass", "visibility", "none");
        this.map.setLayoutProperty(
          "landcover-grass-park",
          "visibility",
          "none"
        );
        this.map.setLayoutProperty("waterway_tunnel", "visibility", "none");
        this.map.setLayoutProperty("waterway-other", "visibility", "none");
        this.map.setLayoutProperty(
          "waterway-other-intermittent",
          "visibility",
          "none"
        );
        this.map.setLayoutProperty(
          "waterway-stream-canal",
          "visibility",
          "none"
        );
        this.map.setLayoutProperty(
          "waterway-stream-canal-intermittent",
          "visibility",
          "none"
        );
        this.map.setLayoutProperty("waterway-river", "visibility", "none");
        this.map.setLayoutProperty(
          "waterway-river-intermittent",
          "visibility",
          "none"
        );
        this.map.setLayoutProperty("water-offset", "visibility", "none");
        this.map.setLayoutProperty("water", "visibility", "none");
        this.map.setLayoutProperty("water-intermittent", "visibility", "none");
        this.map.setLayoutProperty("boundary-water", "visibility", "none");
      } else {
        this.mapStyle = "vector";
        this.map.setLayoutProperty("simple-tiles", "visibility", "none");
        this.map.setLayoutProperty("background", "visibility", "visible");
        this.map.setLayoutProperty("landcover-grass", "visibility", "visible");
        this.map.setLayoutProperty(
          "landcover-grass-park",
          "visibility",
          "visible"
        );
        this.map.setLayoutProperty("waterway_tunnel", "visibility", "visible");
        this.map.setLayoutProperty("waterway-other", "visibility", "visible");
        this.map.setLayoutProperty(
          "waterway-other-intermittent",
          "visibility",
          "visible"
        );
        this.map.setLayoutProperty(
          "waterway-stream-canal",
          "visibility",
          "visible"
        );
        this.map.setLayoutProperty(
          "waterway-stream-canal-intermittent",
          "visibility",
          "visible"
        );
        this.map.setLayoutProperty("waterway-river", "visibility", "visible");
        this.map.setLayoutProperty(
          "waterway-river-intermittent",
          "visibility",
          "visible"
        );
        this.map.setLayoutProperty("water-offset", "visibility", "visible");
        this.map.setLayoutProperty("water", "visibility", "visible");
        this.map.setLayoutProperty(
          "water-intermittent",
          "visibility",
          "visible"
        );
        this.map.setLayoutProperty("boundary-water", "visibility", "visible");
      }
    },
    getCode(code) {
      if (parseInt(code.substring(0, 2)) >= 97) {
        return code.substring(0, 3);
      } else {
        return code.substring(0, 2);
      }
    },
    changeLocation(commitFunction, level, code, name) {
      this.fetching = false;
      let obj = {};
      if (level == "fra") {
        obj.level = "fra";
        obj.dep = null;
        obj.depName = null;
      }
      if (level == "departement") {
        obj.level = "departement";
        obj.dep = code;
        obj.depName = name;
      }
      appStore.commit(commitFunction, obj);
    },
    sendApiResultToStore(url, data) {
      let obj = {};
      obj.url = url;
      obj.data = data;
      appStore.commit("addApiResult", obj);
    },
    changeChloroplethColors(
      property_code_geo,
      property_value,
      property_tile_code_geo
    ) {
      let list_obj = [];
      let dataObj = [];
      this.actualData.forEach((d) => {
        if (!list_obj.includes(d[property_code_geo])) {
          list_obj.push(d[property_code_geo]);
          dataObj.push(d);
        }
      });

      let { x, scaleMin, scaleMax } = this.calculateColor(
        dataObj,
        property_value
      );
      let matchExpression = this.getMatchExpressionStart(
        dataObj,
        x,
        property_value,
        property_code_geo,
        property_tile_code_geo
      );
      return matchExpression;
    },
    getMatchExpressionStart(
      data,
      x,
      propertyValueData,
      propertyCodeData,
      propertyTile
    ) {
      let matchExpression = ["match", ["get", propertyTile]];
      data.forEach((d) => {
        if (d[propertyValueData] != null) {
          let color = x(parseFloat(d[propertyValueData]));
          matchExpression.push(d[propertyCodeData], color);
        } else {
          matchExpression.push(d[propertyCodeData], "rgba(100, 100, 100, 0.7)");
        }
      });
      matchExpression.push("rgba(100, 100, 100, 0.7)");
      return matchExpression;
    },
    median(arr) {
      const mid = Math.floor(arr.length / 2),
        nums = [...arr].sort((a, b) => a - b);
      return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
    },
    calculateColor(data, valProperty) {
      const valStat = [];
      data.forEach((d) => {
        if (d[valProperty] != null) {
          valStat.push(parseFloat(d[valProperty]));
        }
      });
      let scaleMin = Math.min.apply(null, valStat);
      let scaleMax = Math.max.apply(null, valStat);
      let pivot = this.median(valStat);
      if (!scaleMin || scaleMin === Infinity || scaleMin === -Infinity) {
        scaleMin = "Pas de données";
        pivot = "Pas de données";
      }
      if (!scaleMax || scaleMax === Infinity || scaleMax === -Infinity) {
        scaleMax = "Pas de données";
        pivot = "Pas de données";
      }
      this.legMin = scaleMin;
      this.legMax = scaleMax;
      this.legPivot = pivot;

      let x = d3
        .scaleLinear()
        .domain([scaleMin, pivot, scaleMax])
        .range(["#CC000A", "#FFF64E", "#028758"]);

      return { x, scaleMin, scaleMax };
    },
    displayTooltip(e) {
      this.tooltip.visibility = "visible";
      let tooltipX = e.point.x + 500;
      let tooltipY = e.point.y + 30;
      this.tooltip.top = tooltipY + "px";
      this.tooltip.left = tooltipX + "px";
    },
    hideTooltip() {
      this.tooltip.visibility = "none";
    },
    fetchTooltipData(level, code, name) {
      this.tooltip.visibility = "visible";
      this.tooltip.place = name;
      let found = false;
      this.actualData.forEach((d) => {
        if (d["dep"] == code) {
          found = true;
          this.tooltip.value = d["value"];
        }
      });
      if (!found) {
        this.tooltip.value = "Pas de données";
      }
    },
    manageChloroplethColors() {
      if (this.actualData) {
        let property_tile_code_geo = "code";
        let matchExpression = this.changeChloroplethColors(
          "dep",
          "value",
          property_tile_code_geo
        );
        let exp = null;
        if (matchExpression.length == 3) {
          exp = matchExpression[2];
        } else {
          exp = matchExpression;
        }
        this.map.setPaintProperty("departements_fill", "fill-color", exp);
      }
    },
    processData(data) {
      let filterData = {};
      filterData["properties"] = data["properties"];
      filterData["type"] = data["type"];
      if (this.activeFilter == "stats_structures") {
        filterData["features"] = data.features.filter(
          (d) => d["properties"]["type"] == "structure"
        );
      } else if (this.activeFilter == "stats_services") {
        filterData["features"] = data.features.filter(
          (d) => d["properties"]["type"] == "service"
        );
      } else {
        filterData["features"] = data.features.filter((d) => {
          if (d["properties"][this.mappingDepFile[this.activeFilter]]) {
            return d["properties"][
              this.mappingDepFile[this.activeFilter]
            ].includes(this.activeSubFilter);
          }
        });
      }
      return filterData;
    },
    loadInclusionPoints() {
      if (this.userLocation.dep) {
        let url =
          "https://files.data.gouv.fr/data-inclusion/dep/inclusion_dep_" +
          this.userLocation.dep +
          ".geojson";
        let data = null;
        if (this.saveApiUrl.includes(url)) {
          data = this.saveApiResponse[url];
          data = this.processData(data);
          this.map.getSource("inclusion_datapoints").setData(data);
        } else {
          fetch(url)
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              this.sendApiResultToStore(url, data);
              data = this.processData(data);
              this.map.getSource("inclusion_datapoints").setData(data);
            });
        }
      }
    },
    manageFilters() {
      let url = null;
      if (this.activeFilter == "stats_structures") {
        let url =
          "https://files.data.gouv.fr/data-inclusion/stats_general.json";
        let data = null;
        if (this.saveApiUrl.includes(url)) {
          data = this.saveApiResponse[url];
          let filterData = data.filter((d) => d.type == "structure");
          appStore.commit("addActualData", filterData);
          this.manageChloroplethColors();
        } else {
          fetch(url)
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              this.sendApiResultToStore(url, data);
              let filterData = data.filter((d) => d.type == "structure");
              appStore.commit("addActualData", filterData);
              this.manageChloroplethColors();
            });
        }
      }
      if (this.activeFilter == "stats_services") {
        let url =
          "https://files.data.gouv.fr/data-inclusion/stats_general.json";
        let data = null;
        if (this.saveApiUrl.includes(url)) {
          data = this.saveApiResponse[url];
          let filterData = data.filter((d) => d.type == "service");
          appStore.commit("addActualData", filterData);
          this.manageChloroplethColors();
        } else {
          fetch(url)
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              this.sendApiResultToStore(url, data);
              let filterData = data.filter((d) => d.type == "service");
              appStore.commit("addActualData", filterData);
              this.manageChloroplethColors();
            });
        }
      }

      if (this.activeFilter == "stats_labels") {
        let url =
          "https://files.data.gouv.fr/data-inclusion/stats_structures_labels_nationaux.json";
        this.manageSubFiltersData(url);
      }

      if (this.activeFilter == "stats_thematiques") {
        let url =
          "https://files.data.gouv.fr/data-inclusion/stats_services_thematiques.json";
        this.manageSubFiltersData(url);
      }

      if (this.activeFilter == "stats_profils") {
        let url =
          "https://files.data.gouv.fr/data-inclusion/stats_services_profils.json";
        this.manageSubFiltersData(url);
      }

      if (this.activeFilter == "stats_frais") {
        let url =
          "https://files.data.gouv.fr/data-inclusion/stats_services_frais.json";
        this.manageSubFiltersData(url);
      }

      if (this.activeFilter == "stats_modes_accueil") {
        let url =
          "https://files.data.gouv.fr/data-inclusion/stats_services_modes_accueil.json";
        this.manageSubFiltersData(url);
      }

      if (this.activeFilter == "stats_typologie_services") {
        let url =
          "https://files.data.gouv.fr/data-inclusion/stats_services_types.json";
        this.manageSubFiltersData(url);
      }

      if (this.activeFilter == "stats_typologie_structures") {
        let url =
          "https://files.data.gouv.fr/data-inclusion/stats_structures_typologie.json";
        this.manageSubFiltersData(url);
      }
    },
    manageSubFiltersData(url) {
      if (this.activeSubFilter) {
        let data = null;
        if (this.saveApiUrl.includes(url)) {
          data = this.saveApiResponse[url];
          let filterData = data.filter((d) => d.id == this.activeSubFilter);
          appStore.commit("addActualData", filterData);
          this.manageChloroplethColors();
        } else {
          fetch(url)
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              this.sendApiResultToStore(url, data);
              let filterData = data.filter((d) => d.id == this.activeSubFilter);
              appStore.commit("addActualData", filterData);
              this.manageChloroplethColors();
            });
        }
      }
    },
  },
  watch: {
    dep() {
      this.loadInclusionPoints();
    },
    searchBarCoordinates() {
      let url =
        "https://geo.api.gouv.fr/communes?lat=" +
        this.searchBarCoordinates[1] +
        "&lon=" +
        this.searchBarCoordinates[0];
      fetch(url)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data[0] && data[0]["codeDepartement"]) {
            this.changeLocation(
              "changeUserLocation",
              "departement",
              data[0]["codeDepartement"],
              CenterDeps[data[0]["codeDepartement"]]["nom"]
            );
            this.changeLocation(
              "changeMouseLocation",
              "departement",
              data[0]["codeDepartement"],
              CenterDeps[data[0]["codeDepartement"]]["nom"]
            );
          }
          this.fetching = true;
          appStore.commit("changeZoomLevel", 14);
          this.map.flyTo({
            center: this.searchBarCoordinates,
            zoom: 14,
          });
        });
    },
    activeFilter() {
      this.manageFilters();
      this.loadInclusionPoints();
      appStore.commit("addDetailData", null);
    },
    activeSubFilter() {
      this.manageFilters();
      this.loadInclusionPoints();
      appStore.commit("addDetailData", null);
    },
    zoomLevel() {
      if (this.waitZoom === false) {
        if (this.zoomLevel < 8) {
          if (this.level != "fra") {
            this.map.setLayoutProperty(
              "departements_fill",
              "visibility",
              "visible"
            );
            this.map.setLayoutProperty(
              "inclusion_points",
              "visibility",
              "none"
            );
            if (!this.fetching) {
              this.changeLocation("changeUserLocation", "fra", null, "France");
              this.changeLocation("changeMouseLocation", "fra", null, "France");
            }
            this.manageChloroplethColors();
            appStore.commit("addDetailData", null);
          }
        } else {
          this.map.setLayoutProperty("departements_fill", "visibility", "none");
          this.map.setLayoutProperty(
            "inclusion_points",
            "visibility",
            "visible"
          );
          this.changeDep = false;
          if (!this.fetching) {
            this.changeLocation(
              "changeUserLocation",
              "departement",
              this.mouseLocation.dep,
              this.mouseLocation.depName
            );
          }
          this.map.setPaintProperty("departements_fill2", "fill-opacity", 0);
          this.loadInclusionPoints();
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "~maplibre-gl/dist/maplibre-gl.css";

.choroMap {
  width: 70%;
  display: inline-block;
  min-height: 100%;
  position: relative;
}

.map_container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.leg_container {
  position: absolute;
  width: 388px;
  height: 89px;
  left: 16px;
  background-color: #ffffff;
  bottom: 20px;
}

.leg_container2 {
  position: absolute;
  width: 50px;
  height: 50px;
  right: 30px;
  background-color: #ffffff;
  bottom: 20px;
  cursor: pointer;
}

.leg_title {
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  position: absolute;
  top: -45px;
}

.color_blocks {
  width: 360px;
  height: 8px;
  background: linear-gradient(
    90deg,
    rgba(205, 0, 25, 1) 0%,
    rgba(255, 0, 31, 1) 9%,
    rgba(255, 97, 47, 1) 18%,
    rgba(255, 142, 58, 1) 27%,
    rgba(255, 199, 66, 1) 36%,
    rgba(255, 223, 81, 1) 45%,
    rgba(255, 244, 86, 1) 54%,
    rgba(200, 253, 79, 1) 63%,
    rgba(133, 220, 68, 1) 72%,
    rgba(34, 215, 65, 1) 81%,
    rgba(0, 173, 52, 189) 89%,
    rgba(0, 114, 71, 1) 98%
  );
  margin: 55px auto 0;
  position: relative;
}

.leg_borne {
  font-weight: 400;
  font-size: 10px;
  position: absolute;
  bottom: -25px;
}

.leg_borne.min {
  left: 0;
}

.leg_borne.pivot {
  left: 50%;
  transform: translate(-50%, 0);
}

.leg_borne.max {
  right: 0;
}

.map_tooltip {
  width: auto;
  min-width: 165px;
  height: auto;
  background-color: white;
  position: fixed;
  z-index: 999;
  border-radius: 4px;
  box-shadow: 0 8px 16px 0 rgba(22, 22, 22, 0.12),
    0 8px 16px -16px rgba(22, 22, 22, 0.32);
  text-align: left;
  pointer-events: none;
  font-size: 0.75rem;
  .tooltip_body {
    padding-left: 0.75rem;
    padding-top: 0.25rem;
    padding-right: 0.75rem;
    line-height: 1.67;
    .tooltip_place {
      color: #242424;
    }
  }
}

@media screen and (max-width: 1279px) {
  .choroMap {
    width: 60%;
  }

  .leg_container {
    bottom: 60px;
  }
}

@media screen and (max-width: 767px) {
  .choroMap {
    position: absolute;
    width: 100%;
    display: block;
    min-height: 100%;
    position: relative;
  }

  .leg_container {
    display: none;
  }
}
</style>