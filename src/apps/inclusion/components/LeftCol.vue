<template>
  <div class="leftCol" :class="leftColOpening">
    <div class="leftColOpener" @click="changeLeftColOpening()">
      <svg
        width="10"
        height="6"
        viewBox="0 0 10 6"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M4.99999 2.21917L1.69999 5.51916L0.757324 4.5765L4.99999 0.333832L9.24266 4.5765L8.29999 5.51916L4.99999 2.21917Z"
          fill="#161616"
        />
      </svg>
    </div>

    <div class="header_container" v-if="level === 'fra'">
      <h2 class="intro_title">Bonjour !<br />Bienvenue</h2>
      <span class="intro_text"
        >Découvrez les structures et services de l'inclusion en France et sur
        votre territoire.</span
      >
    </div>
    <div class="header_container" v-else>
      <br />
      <p><b>Département</b></p>
      <h2 class="intro_title">{{ this.userLocation.depName }}</h2>
    </div>
    <div>
      <label for="select-fuel" class="fr-label fr-text--bold fr-mb-1w"
        >Sélectionnez un indicateur</label
      >
      <select
        id="select-fuel"
        class="fr-select"
        v-model="currentKpi"
        @change="changeFilter()"
      >
        <option v-for="item in kpis" :key="item" :value="item">
          {{ mappingKpiTitle[item] }}
        </option>
      </select>
      <br />

      <span
        v-for="kpi in kpis"
        :key="kpi"
        v-if="kpi != 'stats_structures' && kpi != 'stats_services'"
      >
        <label
          v-if="currentKpi == kpi"
          for="select-fuel"
          class="fr-label fr-text--bold fr-mb-1w"
          >Sélectionnez {{ mappingSelect[kpi] }}</label
        >
        <select
          v-if="currentKpi == kpi"
          id="select-fuel"
          class="fr-select"
          v-model="currentSubKpi"
          @change="changeSubFilter()"
        >
          <option
            v-for="item in mappingData[kpi]"
            v-bind:key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </option>
        </select>
      </span>
    </div>
    <div v-if="kpiNb && !detailData" class="stats_container">
      <div class="global_numbers_container">
        <div class="global_number_wrapper">
          <div class="global_number_title">
            {{ mappingKpiTitle[currentKpi] }}
            <div
              class="info_btn"
              @mouseover="hoveredInfo = 'structures'"
              @mouseleave="hoveredInfo = ''"
            >
              <div>?</div>
            </div>
          </div>

          <div class="info_bulle" v-if="hoveredInfo == 'structures'">
            A compléter
          </div>

          <div class="global_number_value">
            {{ kpiNb }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="detailData" style="margin-bottom: 20px">
      <br /><br />
      <h3>{{ detailData.nom }}</h3>
      <span v-if="detailData.adresse">{{ detailData.adresse }} </span>
      <span v-if="detailData.code_postal">{{ detailData.code_postal }} </span>
      <span v-if="detailData.commune">{{ detailData.commune }}</span>
      <br />
      <span v-if="detailData.telephone"
        >Tel : {{ detailData.telephone }} <br
      /></span>
      <span v-if="detailData.courriel"
        >Mail : {{ detailData.courriel }} <br
      /></span>
      <span v-if="detailData.site_web"
        ><a :href="detailData.site_web">Site Web</a> <br
      /></span>
      <br />
      <span v-if="detailData.labels_nationaux">
        <b v-if="detailData.labels_nationaux.length > 0">Labels :</b>
        <span v-for="item in detailData.labels_nationaux" :key="item">
          {{ item }} &nbsp; </span
        ><br />
      </span>
      <p
        v-if="detailData.presentation_resume || detailData.presentation_detail"
      >
        <b>Présentation :</b>
      </p>
      <p v-if="detailData.presentation_resume">
        {{ detailData.presentation_resume }}
      </p>
      <p v-if="detailData.presentation_detail">
        {{ detailData.presentation_detail }}
      </p>

      <span v-if="detailData.services">
        <br />
        <h5 v-if="detailData.services.length > 0">Services :</h5>
        <span v-for="item in detailData.services" :key="item.id">
          <div style="border: 1px solid grey; padding: 10px">
            <span v-if="item.nom"
              ><h6>{{ item.nom }}</h6></span
            >
            <span v-if="item.presentation_resume || item.presentation_detail"
              ><b>Présentation : </b></span
            ><br />
            <span v-if="item.presentation_resume">{{
              item.presentation_resume
            }}</span>
            <span v-if="item.presentation_detail">{{
              item.presentation_detail
            }}</span>
          </div>
        </span>
      </span>
    </div>
  </div>
</template>

<script>
import appStore from "@/apps/inclusion/store";
import CenterDeps from "@/apps/inclusion/assets/json/centers_deps.json";

import dataFrais from "@/apps/inclusion/assets/json/frais.json";
import dataLabelsNationaux from "@/apps/inclusion/assets/json/labels_nationaux.json";
import dataModesAccueil from "@/apps/inclusion/assets/json/modes_accueil.json";
import dataProfils from "@/apps/inclusion/assets/json/profils.json";
import dataThematiques from "@/apps/inclusion/assets/json/thematiques.json";
import dataTypologieServices from "@/apps/inclusion/assets/json/typologie_services.json";
import dataTypologieStructures from "@/apps/inclusion/assets/json/typologie_structures.json";

export default {
  name: "LeftCol",
  components: {},
  data() {
    return {
      apiLevel: null,
      apiResult: null,
      apiCode: null,
      clientData: {
        totalStructures: 0,
        totalServices: 0,
      },
      hoveredInfo: "",
      hoveredBulle: "",
      leftColOpening: "semiopen",
      currentKpi: "stats_structures",
      currentSubKpi: null,
      dataLabelsNationaux: dataLabelsNationaux,
      dataFrais: dataFrais,
      dataModesAccueil: dataModesAccueil,
      dataProfils: dataProfils,
      dataThematiques: dataThematiques,
      dataTypologieServices: dataTypologieServices,
      dataTypologieStructures: dataTypologieStructures,
      mappingKpiTitle: {
        stats_structures: "Nombre de structures référencées",
        stats_services: "Nombre de services référencés",
        stats_labels: "Labels nationaux référencés",
        stats_thematiques: "Thématiques des services référencés",
        stats_profils: "Répartition par type de profil",
        stats_modes_accueil: "Répartition par type de mode d'accueil",
        stats_frais: "Répartition par type de frais",
        stats_typologie_services: "Types de services référencés",
        stats_typologie_structures: "Types de structures référencées",
      },
      mappingSelect: {
        stats_labels: "un label",
        stats_thematiques: "une thématique",
        stats_profils: "un profil",
        stats_modes_accueil: "un mode d'accueil",
        stats_frais: "un type de frais",
        stats_typologie_services: "un type de service",
        stats_typologie_structures: "un type de structure",
      },
      mappingData: {
        stats_labels: dataLabelsNationaux,
        stats_thematiques: dataThematiques,
        stats_profils: dataProfils,
        stats_modes_accueil: dataModesAccueil,
        stats_frais: dataFrais,
        stats_typologie_services: dataTypologieServices,
        stats_typologie_structures: dataTypologieStructures,
      },
      kpis: [
        "stats_structures",
        "stats_services",
        "stats_labels",
        "stats_thematiques",
        "stats_profils",
        "stats_modes_accueil",
        "stats_frais",
        "stats_typologie_services",
        "stats_typologie_structures",
      ],
      kpiNb: null,
    };
  },
  computed: {
    saveApiUrl: function () {
      return appStore.state.saveApiUrl;
    },
    saveApiResponse: function () {
      return appStore.state.saveApiResponse;
    },
    zoomLevel: function () {
      return appStore.state.map.zoomLevel;
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
    userLocation: function () {
      return appStore.state.userLocation;
    },
    mapProperties: function () {
      return appStore.state.mapProperties;
    },
    actualData: function () {
      return appStore.state.actualData;
    },
    detailData: function () {
      return appStore.state.detailData;
    },
  },
  mounted() {
    if (this.actualData) {
      this.manageData(this.actualData);
    }
  },
  methods: {
    changeFilter() {
      appStore.commit("updateActiveFilter", this.currentKpi);
      appStore.commit("updateActiveSubFilter", null);
      appStore.commit("updateActiveSubFilterName", null);
    },
    changeSubFilter() {
      appStore.commit("updateActiveSubFilter", this.currentSubKpi);
      let name = null;
      this.mappingData[this.currentKpi].forEach((d) => {
        if (d.value == this.currentSubKpi) {
          name = d.label;
        }
      });
      appStore.commit("updateActiveSubFilterName", name);
    },
    manageData(obj) {
      if (!this.userLocation.dep) {
        if (obj) {
          let cpt = 0;
          obj.forEach((d) => {
            cpt = cpt + d.value;
          });
          this.kpiNb = cpt;
        }
      } else {
        if (obj) {
          let cpt = 0;
          obj.forEach((d) => {
            if (d["dep"] == this.userLocation.dep) {
              cpt = cpt + d.value;
            }
          });
          this.kpiNb = cpt;
        }
      }
    },
    changeLeftColOpening() {
      if (this.leftColOpening == "close" || this.leftColOpening == "semiopen") {
        this.leftColOpening = "open";
      } else {
        this.leftColOpening = "close";
      }
    },
    sendApiResultToStore(url, data) {
      let obj = {};
      obj.url = url;
      obj.data = data;
      appStore.commit("addApiResult", obj);
    },
  },
  watch: {
    actualData() {
      this.manageData(this.actualData);
    },
    userLocation() {
      this.manageData(this.actualData);
    },
  },
};
</script>

<style scoped>
.leftCol {
  position: relative;
  display: inline-block;
  width: 30%;
  float: left;
  padding-left: 20px;
  padding-right: 20px;
  height: 100%;
  overflow: scroll;
}

.leftColOpener {
  display: none;
}

.header_container {
  padding-bottom: 10px;
}

.intro_title {
  font-size: 28px;
  line-height: 38px;
  margin-bottom: 5px;
  margin-top: 10px;
}

.intro_text {
  font-size: 14px;
  line-height: 24px;
}

.ariane_container {
  width: 100%;
  margin-top: 20px;
}

.ariane_container div {
  display: inline-block;
  font-size: 12px;
  color: #666666;
}

.ariane_container div span {
  text-decoration: underline;
}

.ariane_container div:before {
  content: ">";
  margin: 0 5px 0 5px;
  text-decoration: none;
}

.ariane_container div:first-child:before {
  display: none;
}

.location_container {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 20px;
}

.location_title {
  font-weight: 700;
  font-size: 12px;
  color: #3a3a3a;
}

.location_label {
  font-weight: 800;
  font-size: 28px;
  color: #161616;
}

.global_numbers_container {
  padding-top: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e5e5;
  border-top: 1px solid #e5e5e5;
}

.global_number_wrapper {
  width: 100%;
  display: inline-block;
  position: relative;
}

.global_number_title {
  font-weight: 700;
  font-size: 12px;
  color: #3a3a3a;
  line-height: 16px;
  position: relative;
}

.global_number_title .info_btn {
  display: inline-block;
  margin-left: 5px;
  position: relative;
  top: 0px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: #e6eefe;
  cursor: pointer;
  padding-left: 4px;
}

.info_bulle {
  position: absolute;
  width: 100%;
  font-size: 12px;
  font-weight: 400;
  background-color: white;
  left: 50%;
  top: 18px;
  transform: translate(-50%, 0);
  padding: 10px;
  line-height: 16px;
  border-radius: 5px;
  display: block;
  z-index: 999;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.16),
    0px 1px 0px -2px rgba(0, 0, 0, 0.16), 0px 1px 4px rgba(0, 0, 0, 0.23);
}

.global_number_value {
  font-weight: 800;
  font-size: 24px;
  color: #161616;
}

.tab_container {
  padding-top: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e5e5;
}

.tab_container table {
  width: 100%;
  text-align: center;
  margin: 0 auto;
}

.tab_container table th {
  font-size: 12px;
  font-weight: 400;
}

.tab_container table th svg {
  width: 12px;
  height: 12px;
  transform: translate(0, 1px);
}

.tab_container table th.hide {
  opacity: 0.3;
}

.tab_container table th.left {
  text-align: left;
}

.tab_container table td {
  font-size: 12px;
  font-weight: 700;
}

.tab_container table td.hide {
  opacity: 0.3;
}

.chart_container {
  padding-top: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e5e5;
  position: relative;
}

.links_container {
  padding-top: 0px;
  padding-bottom: 5px;
  border-bottom: 1px solid #e5e5e5;
  height: 35px;
  overflow: hidden;
  position: relative;
  margin-bottom: 15px;
}

.links_container[data-open="open"] {
  height: auto;
}

.links_title {
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 20px;
  position: relative;
  left: 10px;
  cursor: pointer;
}

.links_title svg {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translate(0, -50%) rotate(180deg);
}

.links_container[data-open="open"] .links_title {
  font-weight: 700;
}

.links_container[data-open="open"] .links_title svg {
  transform: translate(0, -50%) rotate(0deg);
}

.chart_title {
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
}

.chart_geo {
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
}

.chart_info_btn {
  display: inline-block;
  margin-left: 5px;
  position: relative;
  top: 3px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: #e6eefe;
  cursor: pointer;
}

.chart_info_bulle {
  position: absolute;
  width: 80%;
  font-size: 12px;
  font-weight: 400;
  background-color: white;
  left: 50%;
  top: 50px;
  transform: translate(-50%, 0);
  padding: 10px;
  line-height: 16px;
  border-radius: 5px;
  display: block;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.16),
    0px 1px 0px -2px rgba(0, 0, 0, 0.16), 0px 1px 4px rgba(0, 0, 0, 0.23);
}

.chart_info_btn div {
  display: block;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  font-weight: 700;
}

.mutations_container {
  margin-top: 30px;
}

.title_mutations {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 15px;
}

.mutations_total {
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
  text-align: center;
  margin-bottom: 25px;
}

.mutation_box {
  width: 100%;
  /*max-width: 450px;*/
  min-height: 50px;
  margin: 0 auto 35px;
}

.mutation_box .content {
  border: 1px solid #eeeeee;
  padding: 20px;
  position: relative;
}

.mutation_box .content .nature {
  position: absolute;
  top: 0;
  font-size: 12px;
  font-weight: 700;
  color: #666666;
  background-color: white;
  border: 1px solid #eeeeee;
  border-radius: 4px;
  padding: 0 6px 0 6px;
  text-transform: uppercase;
  transform: translate(0, -50%);
}

.mutation_box .content .price {
  font-size: 18px;
  font-weight: 800;
  display: block;
  color: #161616;
}

.mutation_box .content .infos {
  padding: 0 10px 0;
}

.mutation_box .content .topinfo {
  font-size: 12px;
  color: #666666;
  font-weight: 400;
  display: block;
  height: 20px;
}

.mutation_box .content .complInfo {
  font-size: 11px;
  color: #666666;
  font-weight: 400;
  display: block;
}

.mutation_box .content .topinfo img {
  vertical-align: middle;
}

.mutation_box .content .date {
  margin-bottom: 10px;
}

.infos_item {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
}

.infos_item .title {
  font-size: 12px;
  font-weight: 400;
  color: #161616;
}

.infos_item .title img {
  vertical-align: middle;
}

.infos_item .filet {
  width: auto;
  height: 1px;
  background-color: #eeeeee;
  flex-grow: 10;
  margin-left: 10px;
  margin-right: 10px;
}

.infos_item .value {
  font-size: 12px;
  font-weight: 700;
  color: #161616;
}

.cardPartner {
  padding-bottom: 10px;
  display: flex;
  cursor: pointer;
}

.textPartner {
  color: #3558a2;
  font-size: 12px;
  font-weight: 700;
  line-height: 12px;
  cursor: pointer;
}

.dpe-tag {
  color: #fff;
  font-size: 18px;
  font-weight: 500;
  width: 64px;
  height: 32px;
  line-height: 32px;
  padding-right: 12px;
  text-align: center;
  clip-path: polygon(0 0, 75% 0, 75% 0, 99% 50%, 75% 99%, 75% 99%, 0 99%);
}

.content-dpe {
  font-size: 12px;
}

.content-copro {
  font-size: 12px;
}

.dpe-final {
  margin-top: 10px;
}

.copro-final {
  margin-top: 10px;
}

.one-dpe {
  margin-left: 40px;
  margin-right: 40px;
  margin-top: 10px;
  margin-bottom: 10px;
  border: 1px solid #ebebeb;
}

.one-copro {
  margin-left: 40px;
  margin-right: 40px;
  margin-top: 10px;
  border: 1px solid #ebebeb;
}

.etiquette-dpe {
  display: flex;
  flex-direction: row;
  height: 40px;
}

.title-etiquette {
  margin-left: 15px;
  line-height: 30px;
}

.dpe-color-a {
  background-color: #009c6d;
}
.dpe-color-b {
  background-color: #52b153;
}
.dpe-color-c {
  background-color: #78bd76;
}
.dpe-color-d {
  background-color: #f4e70f;
}
.dpe-color-e {
  background-color: #f0b50f;
}
.dpe-color-f {
  background-color: #eb8235;
}
.dpe-color-g {
  background-color: #d7221f;
}

@media screen and (max-width: 1279px) {
  .leftCol {
    width: 40%;
  }
}

@media screen and (max-width: 767px) {
  .leftCol {
    position: absolute;
    width: 95%;
    left: 50%;
    top: 70%;
    transform: translate(-50%, -40px);
    z-index: 99;
    background-color: white;
    padding-top: 25px;
    padding-bottom: 50px;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
  }

  .leftCol.close {
    top: 100%;
  }

  .leftCol.open {
    top: 10%;
    overflow: scroll;
  }

  .leftCol.semiopen {
    top: 70%;
  }

  .leftColOpener {
    display: block;
    height: 40px;
    position: absolute;
    padding-top: 10px;
    top: 0;
    left: 50%;
    transform: translate(-50%, 0);
    width: 100%;
    text-align: center;
  }

  .leftColOpener svg {
    position: relative;
    top: 0;
  }

  .leftCol.open .leftColOpener {
    transform: translate(-50%, 0) rotate(180deg);
  }
}
</style>