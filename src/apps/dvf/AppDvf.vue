<template>
  <div class="fr-container--fluid">
    <header-apps
      :formHref="formHref"
      :appName="appName"
      :appLink="appLink"
      :betaApp="true"
      :displayBanner="true"
    ></header-apps>
    <!-- <div class="safari" v-if="isSafari">Vous utilisez le navigateur Safari, nous vous conseillons de basculer sur un autre navigateur car des bugs sont remontés sur celui-ci au niveau de la carte.<br />Nous travaillons à leurs résolutions.</div> -->
    <div class="dvf_header">
      <h2>Explorateur de données de valeurs foncières</h2>
      <h3>
        Suivez l'évolution des prix de l'immobilier et trouvez le prix des
        ventes immobilières des 5 dernières années
      </h3>
      <div class="maj_date_container">
        Dernière mise à jour des données : février 2025
      </div>
    </div>

    <div
      class="dvf_content"
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

      <div class="dvf_app">
        <map-view v-if="activePanel == 'carte'"></map-view>
        <tableau-view v-if="activePanel == 'tableau'"></tableau-view>
        <faq-view v-if="activePanel == 'faq'"></faq-view>
        <sources-view v-if="activePanel == 'sources'"></sources-view>
      </div>
    </div>

    <footer-apps :scrollable="isScrollable" :display="isDisplay"></footer-apps>
  </div>
</template>

<script>
import appStore from "@/apps/dvf/store";
import HeaderApps from "@/views/HeaderApps";
import FooterApps from "@/views/FooterApps";
import MapView from "@/apps/dvf/views/MapView";
import TableauView from "@/apps/dvf/views/TableauView";
import FaqView from "@/apps/dvf/views/FaqView";
import SourcesView from "@/apps/dvf/views/SourcesView";

export default {
  name: "AppDvf",
  components: {
    HeaderApps,
    FooterApps,
    MapView,
    TableauView,
    FaqView,
    SourcesView,
  },  
  metaInfo: {
    title: "Explorateur de données de valeurs foncières - DVF",
    meta: [
      {
        name: "description",
        content: "Suivez l'évolution des prix de l'immobilier et trouvez le prix des ventes immobilières des 5 dernières années.",
      },
      // Ajoutez d'autres balises meta si nécessaire
    ],
  },
  data() {
    return {
      panels: [
        { id: "carte", label: "Carte" },
        { id: "tableau", label: "Tableau" },
        { id: "faq", label: "Questions fréquentes" },
        { id: "sources", label: "Sources" },
      ],
      formHref: "https://tally.so/r/m6L5jo",
      appName: "DVF",
      pageName: "immobilier",
      //isSafari: false,
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
      return window.location.origin + '/' + this.$route.params.lang + "/immobilier?onglet=carte&filtre=tous";
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
    // let isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification));
    // this.isSafari = isSafari

    if (this.$route.query.onglet) {
      if (this.$route.query.onglet != this.activePanel) {
        this.changeActivePanel(this.$route.query.onglet);
      }
    } else {
      this.changeActivePanel("carte");
    }
  },
  methods: {
    changeActivePanel(id) {
      appStore.commit("changeActivePanel", id);
      this.$router
        .push({
          name: this.pageName,
          params: { lang: this.$route.params.lang },
          query: { ...this.$route.query, onglet: id },
        })
        .catch(() => {});
    },
    updateActiveFilter(f) {
      appStore.commit("updateActiveFilter", f);
      this.$router
        .push({
          name: this.pageName,
          params: { lang: this.$route.params.lang },
          query: { ...this.$route.query, filtre: f },
        })
        .catch(() => {});
    },
    updateActiveLatLng() {
      this.$router
        .push({
          name: this.pageName,
          params: { lang: this.$route.params.lang },
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
              name: this.pageName,
              params: { lang: this.$route.params.lang },
              query: { ...this.$route.query, code: this.userLocation.dep },
            })
            .catch(() => {});
        }
      }
      if (level == "commune") {
        if (this.userLocation.com != this.$route.query.code) {
          this.$router
            .push({
              name: this.pageName,
              params: { lang: this.$route.params.lang },
              query: { ...this.$route.query, code: this.userLocation.com },
            })
            .catch(() => {});
        }
      }
      if (level == "section") {
        if (this.userLocation.section != this.$route.query.code) {
          this.$router
            .push({
              name: this.pageName,
              params: { lang: this.$route.params.lang },
              query: { ...this.$route.query, code: this.userLocation.section },
            })
            .catch(() => {});
        }
      }
      if (level == "parcelle") {
        if (this.userLocation.parcelle != this.$route.query.code) {
          this.$router
            .push({
              name: this.pageName,
              params: { lang: this.$route.params.lang },
              query: { ...this.$route.query, code: this.userLocation.parcelle },
            })
            .catch(() => {});
        }
      }
      if (level != "fra") {
        if (level != this.$route.query.level) {
          this.$router
            .push({
              name: this.pageName,
              params: { lang: this.$route.params.lang },
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
            .push({ 
              name: this.pageName,
              params: { lang: this.$route.params.lang },
              query: query 
            })
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

.dvf_header {
  padding-left: 20px;
  padding-top: 30px;
  position: relative;
}

.dvf_header h2 {
  font-size: 24px;
  margin-bottom: 0;
  line-height: 32px;
}

.dvf_header h3 {
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 0;
  line-height: 2.25rem;
}

.dvf_header .maj_date_container {
  position: absolute;
  right: 0;
  top: 0;
  font-size: 14px;
  font-weight: 700;
  top: 30px;
  right: 20px;
}

.dvf_content {
  position: absolute;
  top: 156px;
  bottom: 0px;
  width: 100%;
}

.dvf_app {
  position: absolute;
  width: 100%;
  top: 40px;
  bottom: 0;
}

.mainView {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
}

.dvf_content.scrollable {
  position: relative;
  top: 0px;
  height: 100%;
}

.dvf_content.scrollable .dvf_app {
  top: 0;
}

.dvf_content.scrollable .dvf_app {
  position: relative;
  height: 100%;
}

.dvf_content.scrollable .mainView {
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
  .dvf_header .maj_date_container {
    top: 10px;
  }
}

@media screen and (max-width: 767px) {
  .dvf_header {
    display: none;
  }

  .dvf_content {
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

  .dvf_app {
    top: 0px;
    bottom: 41px;
  }

}

  .safari{
    position: absolute;
    top: 60px;
    width: 100%;
    background-color: #FB7935;
    z-index: 100;
    padding: 10px;
    text-align: center;
    font-weight: bold;
    color: white;
  }

</style>
