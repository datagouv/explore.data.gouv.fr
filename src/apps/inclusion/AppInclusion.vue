<template>
  <div class="fr-container--fluid">
    <header-apps
      :formHref="formHref"
      :appName="appName"
      :appLink="appLink"
    ></header-apps>
    <div>
      <div style="background-color: #f5f5fe; height: 500px">
        <div style="width: 70%; margin: auto">
          <div style="display: flex">
            <div
              style="
                flex-direction: row;
                width: 50%;
                margin: auto;
                padding-top: 100px;
              "
            >
              <h1>Les données de l'inclusion dans mon département</h1>
              <button
                @click="scrollMeTo('inclusionApp')"
                style="
                  padding-top: 10px;
                  padding-bottom: 10px;
                  padding-left: 20px;
                  padding-right: 20px;
                  background-color: #060091;
                  color: white;
                  font-size: 15px;
                "
              >
                Se rendre sur la cartographie
              </button>
              <br />
              <br />
              <p>
                Suivre l'évolution des données publiques dans mon département.
              </p>
            </div>
            <div
              style="
                flex-direction: row;
                width: 50%;
                text-align: center;
                margin: auto;
                padding-top: 50px;
              "
            >
              <img src="./assets/images/inclusion.png" width="400" />
            </div>
            <div></div>
          </div>
        </div>
      </div>
      <div>
        <div style="width: 70%; margin: auto">
          <div style="display: flex">
            <div style="flex-direction: row; width: 50%; padding-top: 50px">
              <h2>Qu'est-ce que Data Inclusion ?</h2>
              <br />
              <p>
                Data Inclusion est une démarche collective visant à créer un
                référentiel commun de toutes les données de l'offre d'insertion
                des territoires afin de permettre à tous les services recensant
                et mettant en visibilité leur offre d'être interopérables et de
                mutualiser les efforts de recensement et de mise à jour.
              </p>
              <br />
              <p>
                <a style="color: #060091; font-weight: bold" href=""
                  >En savoir plus sur la démarche</a
                >
              </p>
            </div>
            <div
              style="flex-direction: row; margin-left: 30px; margin-top: 50px"
            ></div>
            <div style="margin-top: 80px">
              <p>
                <a
                  style="color: #060091; font-weight: bold; font-size: 15px"
                  href=""
                  >1. Un référentiel commun : les schémas de données et les
                  nomenclatures</a
                >
              </p>
              <p>
                <a
                  style="color: #060091; font-weight: bold; font-size: 15px"
                  href=""
                  >2. Des données publiques et téléchargeables en open data</a
                >
              </p>
              <p>
                <a
                  style="color: #060091; font-weight: bold; font-size: 15px"
                  href=""
                  >3. Des données publiques et connectables : API</a
                >
              </p>
              <p>
                <a
                  style="color: #060091; font-weight: bold; font-size: 15px"
                  href=""
                  >4. Un accompagnement des acteurs</a
                >
              </p>
              <p>
                <a
                  style="color: #060091; font-weight: bold; font-size: 15px"
                  href=""
                  >5. La qualité et la mise à jour des données</a
                >
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div
        ref="inclusionApp"
        class="inclusion_content"
        :class="
          activePanel === 'faq' || activePanel === 'sources' ? 'scrollable' : ''
        "
      >
        <div class="panel_container">
          <div
            class="panel"
            v-for="p in panels"
            :class="p.id === activePanel ? 'active' : ''"
            @click="changeActivePanel(p.id)"
          >
            <img v-if="p.id === 'carte'" src="./assets/images/carte.svg" />
            <img v-if="p.id === 'tableau'" src="./assets/images/tableau.svg" />
            <img v-if="p.id === 'faq'" src="./assets/images/faq.svg" />
            <img v-if="p.id === 'sources'" src="./assets/images/sources.svg" />
            <span v-if="p.id == 'faq' && isMobile">FAQ</span>
            <span v-else>{{ p.label }}</span>
          </div>
        </div>

        <div class="inclusion_app">
          <map-view v-if="activePanel == 'carte'"></map-view>
          <tableau-view v-if="activePanel == 'tableau'"></tableau-view>
          <faq-view v-if="activePanel == 'faq'"></faq-view>
          <sources-view v-if="activePanel == 'sources'"></sources-view>
        </div>
      </div>

      <footer-apps
        :scrollable="isScrollable"
        :display="isDisplay"
      ></footer-apps>
    </div>
  </div>
</template>

<script>
import appStore from "@/apps/inclusion/store";
import HeaderApps from "@/views/HeaderApps";
import FooterApps from "@/apps/inclusion/components/FooterApps";
import MapView from "@/apps/inclusion/views/MapView";
import TableauView from "@/apps/inclusion/views/TableauView";
import FaqView from "@/apps/inclusion/views/FaqView";
import SourcesView from "@/apps/inclusion/views/SourcesView";

export default {
  name: "AppInclusion",
  components: {
    HeaderApps,
    FooterApps,
    MapView,
    TableauView,
    FaqView,
    SourcesView,
  },
  data() {
    return {
      panels: [
        { id: "carte", label: "Carte" },
        { id: "tableau", label: "Tableau" },
        { id: "faq", label: "Questions fréquentes" },
        { id: "sources", label: "Sources" },
      ],
      formHref: "", // https://tally.so/r/m6L5jo
      appName: "Inclusion",
    };
  },
  computed: {
    activePanel() {
      return appStore.state.activePanel;
    },
    activeFilter: function () {
      return appStore.state.activeFilter;
    },
    zoomLevel: function () {
      return appStore.state.mapProperties.zoomLevel;
    },
    lat: function () {
      return appStore.state.mapProperties.lat;
    },
    lng: function () {
      return appStore.state.mapProperties.lng;
    },
    centerLat: function () {
      return appStore.state.mapProperties.centerLat;
    },
    centerLng: function () {
      return appStore.state.mapProperties.centerLng;
    },
    level: function () {
      return appStore.state.userLocation.level;
    },
    userLocation: function () {
      return appStore.state.userLocation;
    },
    init: function () {
      return appStore.state.mapProperties.init;
    },
    isScrollable: function () {
      if (
        appStore.state.activePanel === "faq" ||
        appStore.state.activePanel === "sources"
      ) {
        return "scrollable";
      } else {
        return "";
      }
    },
    isDisplay: function () {
      if (appStore.state.activePanel === "tableau") {
        return "";
      } else {
        return "display";
      }
    },
    appLink: function () {
      return window.location.origin + "/inclusion?onglet=carte&filtre=tous";
    },
    isMobile: function () {
      if (window.innerWidth < 768) {
        return true;
      } else {
        return false;
      }
    },
  },
  mounted() {
    if (this.$route.query.onglet) {
      if (this.$route.query.onglet != this.activePanel) {
        this.changeActivePanel(this.$route.query.onglet);
      }
    } else {
      this.changeActivePanel("carte");
    }
  },
  methods: {
    scrollMeTo(refName) {
      var element = this.$refs[refName];
      element.scrollIntoView();
    },
    changeActivePanel(id) {
      appStore.commit("changeActivePanel", id);
      this.$router
        .push({
          path: this.$route.path,
          query: { ...this.$route.query, onglet: id },
        })
        .catch(() => {});
    },
    updateActiveFilter(f) {
      appStore.commit("updateActiveFilter", f);
      appStore.commit("updateActiveSubFilter", null);
      appStore.commit("updateActiveSubFilterName", null);
      this.$router
        .push({
          path: this.$route.path,
          query: { ...this.$route.query, filtre: f },
        })
        .catch(() => {});
    },
    updateActiveLatLng() {
      this.$router
        .push({
          path: this.$route.path,
          query: {
            ...this.$route.query,
            lat: this.centerLat.toFixed(5),
            lng: this.centerLng.toFixed(5),
            zoom: this.zoomLevel.toFixed(2),
          },
        })
        .catch(() => {});
    },
    updateActivePosition() {
      let level = this.level;
      if (level == "departement") {
        if (this.userLocation.dep != this.$route.query.code) {
          this.$router
            .push({
              path: this.$route.path,
              query: { ...this.$route.query, code: this.userLocation.dep },
            })
            .catch(() => {});
        }
      }
      if (level == "commune") {
        if (this.userLocation.com != this.$route.query.code) {
          this.$router
            .push({
              path: this.$route.path,
              query: { ...this.$route.query, code: this.userLocation.com },
            })
            .catch(() => {});
        }
      }
      if (level == "section") {
        if (this.userLocation.section != this.$route.query.code) {
          this.$router
            .push({
              path: this.$route.path,
              query: { ...this.$route.query, code: this.userLocation.section },
            })
            .catch(() => {});
        }
      }
      if (level == "parcelle") {
        if (this.userLocation.parcelle != this.$route.query.code) {
          this.$router
            .push({
              path: this.$route.path,
              query: { ...this.$route.query, code: this.userLocation.parcelle },
            })
            .catch(() => {});
        }
      }
      if (level != "fra") {
        if (level != this.$route.query.level) {
          this.$router
            .push({
              path: this.$route.path,
              query: { ...this.$route.query, level: level },
            })
            .catch(() => {});
        }
      } else {
        if (!this.init) {
          let query = {};
          for (const [key, value] of Object.entries(this.$route.query)) {
            if (key != "level" && key != "code") {
              query[key] = value;
            }
          }
          this.$router
            .push({ path: this.$route.path, query: query })
            .catch(() => {});
        }
      }
    },
  },
  watch: {
    level() {
      this.updateActivePosition();
    },
    userLocation() {
      this.updateActivePosition();
    },
    centerLat() {
      this.updateActiveLatLng();
    },
    centerLng() {
      this.updateActiveLatLng();
    },
  },
};
</script>

<style scoped>
* {
  box-sizing: inherit;
}

.inclusion_header {
  padding-left: 20px;
  padding-top: 30px;
  position: relative;
}

.inclusion_header h2 {
  font-size: 24px;
  margin-bottom: 0;
  line-height: 32px;
}

.inclusion_header h3 {
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 0;
  line-height: 2.25rem;
}

.inclusion_header .maj_date_container {
  position: absolute;
  right: 0;
  top: 0;
  font-size: 14px;
  font-weight: 700;
  top: 30px;
  right: 20px;
}

.inclusion_content {
  position: absolute;
  top: 100%;
  bottom: 0px;
  width: 100%;
}

.inclusion_app {
  position: absolute;
  width: 100%;
  top: 40px;
  bottom: 0;
}

.mainView {
  width: 100%;
  min-height: 750px;
  position: absolute;
  top: 0;
  bottom: 0;
}

.inclusion_content.scrollable {
  position: relative;
  top: 0px;
  height: 100%;
}

.inclusion_content.scrollable .inclusion_app {
  top: 0;
}

.inclusion_content.scrollable .inclusion_app {
  position: relative;
  height: 100%;
}

.inclusion_content.scrollable .mainView {
  position: relative;
}

.panel_container {
  display: flex;
  padding-left: 15px;
  padding-right: 15px;
  border-bottom: 1px solid #e5e5e5;
}

.panel {
  width: 25%;
  height: 40px;
  background-color: #e6eefe;
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  margin: 0 5px 0 5px;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: row;
  border-top: 2px solid transparent;
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;
  border-bottom: 1px solid #e5e5e5;
  cursor: pointer;
  transform: translate(-1px, 1px);
  overflow: hidden;
}

.panel img {
  width: 15px;
  margin-right: 10px;
}

.panel span {
  transform: translate(0, 6px);
}

.panel.active {
  background-color: white;
  border-top: 2px solid #3558a2;
  border-left: 1px solid #e5e5e5;
  border-right: 1px solid #e5e5e5;
  border-bottom: 1px solid #ffffff;
  cursor: default;
  color: #3558a2;
}

@media screen and (max-width: 1279px) {
  .inclusion_header .maj_date_container {
    top: 10px;
  }
}

@media screen and (max-width: 767px) {
  .inclusion_header {
    display: none;
  }

  .inclusion_content {
    top: 50px;
  }

  .panel_container {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 999;
    background-color: white;
  }

  .panel {
    background-color: white;
    flex-direction: column;
    border: none;
    font-size: 12px;
  }

  .panel img {
    margin-right: 0px;
    left: 50%;
    position: relative;
    margin-left: -9px;
    margin-top: 5px;
  }

  .panel span {
    transform: translate(0, 0px);
  }

  .panel.active {
    background-color: white;
    border: none;
    cursor: default;
    color: #3558a2;
  }

  .inclusion_app {
    top: 0px;
    bottom: 41px;
  }
}
</style>