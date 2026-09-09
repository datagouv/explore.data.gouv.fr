<template>
  <div>
    <div class="fr-container fr-container-lg--fluid" id="searchMap">
      <div class="autocomplete-container">
        <div class="fr-search-bar" id="search-540" role="search">
          <label class="fr-label" for="search-540-input"> Rechercher </label>
          <input
            v-model="searchAdress"
            class="fr-input"
            placeholder="Rechercher une adresse"
            type="search"
            id="search-540-input"
            name="search-540-input"
            v-on:keyup.enter="search()"
            @input="autoComplete()"
          />
          <button
            class="fr-btn search-btn"
            title="Rechercher"
            @click="search()"
          >
            Rechercher
          </button>
        </div>
      </div>
    </div>
    <div v-if="searchMessage" class="autocomplete">
      <div class="autocomplete-message">{{ searchMessage }}</div>
    </div>
    <div v-else-if="results.length" class="autocomplete">
      <div
        @click="moveTo(item)"
        v-for="item in results"
        :key="item.properties.id"
      >
        <div
          :class="
            firstResult && firstResult.properties.label === item.properties.label
              ? 'autocomplete-item autocomplete-item-select'
              : 'autocomplete-item'
          "
          @mouseover="firstResult = item"
        >
          {{ item.properties.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import appStore from "@/apps/dvf/store";

// Référence cadastrale complète : 5 chiffres de commune, 5 de section
// (préfixe + lettres), 4 de parcelle.
const PARCELLE_PATTERN = /^\d{8}(\d|[A-Z])[A-Z]\d{4}$/;

export default {
  name: "SearchBar",
  components: {},
  data() {
    return {
      searchAdress: "",
      results: [],
      firstResult: null,
      searchMessage: "",
      debounceTimer: null,
    };
  },
  computed: {},
  mounted() {},
  methods: {
    search() {
      clearTimeout(this.debounceTimer);
      const query = this.searchAdress.trim();
      this.clearResults();
      if (query.length === 0) {
        return;
      }
      if (PARCELLE_PATTERN.test(query)) {
        this.getParcelle(query);
      } else {
        this.getAdresses(query);
      }
    },
    autoComplete() {
      clearTimeout(this.debounceTimer);
      if (this.searchAdress.trim().length === 0) {
        this.clearResults();
        return;
      }
      this.debounceTimer = setTimeout(() => this.search(), 650);
    },
    clearResults() {
      this.results = [];
      this.firstResult = null;
      this.searchMessage = "";
    },
    getAdresses(query) {
      fetch(
        "https://data.geopf.fr/geocodage/search/?q=" + encodeURIComponent(query)
      )
        .then((response) => response.json())
        .then((data) => {
          if (this.searchAdress.trim() !== query) {
            return;
          }
          if (!data.features || data.features.length === 0) {
            this.searchMessage =
              "Aucune adresse ne correspond à « " +
              query +
              " ». Vérifiez l'orthographe, ou saisissez le nom d'une commune.";
            return;
          }
          this.results = data.features;
          this.firstResult = data.features[0];
        })
        .catch(() => {
          this.searchMessage =
            "La recherche d'adresse est momentanément indisponible. Réessayez dans quelques instants.";
        });
    },
    getParcelle(query) {
      fetch(
        "https://data.geopf.fr/geocodage/search?index=parcel&q=" +
          encodeURIComponent(query)
      )
        .then((response) => response.json())
        .then((data) => {
          if (this.searchAdress.trim() !== query) {
            return;
          }
          if (!data.features || data.features.length === 0) {
            this.searchMessage =
              "Aucune parcelle ne porte la référence « " +
              query +
              " ». Vérifiez la référence sur cadastre.gouv.fr.";
            return;
          }
          const parcelle = data.features[0];
          parcelle.properties.citycode =
            parcelle.properties.departmentcode +
            parcelle.properties.municipalitycode;
          parcelle.properties.label = "Parcelle " + parcelle.properties.id;
          this.results = [parcelle];
          this.firstResult = parcelle;
        })
        .catch(() => {
          this.searchMessage =
            "La recherche de parcelle est momentanément indisponible. Réessayez dans quelques instants.";
        });
    },
    moveTo(item) {
      appStore.commit("changeSearchBarCoordinates", {
        coord: item.geometry.coordinates,
        citycode: item.properties.citycode,
        cityname: item.properties.city,
      });
      this.clearResults();
    },
  },
  watch: {},
};
</script>

<style scoped>
#searchMap {
  width: 305px;
  position: absolute;
  height: 40px;
  z-index: 10;
  top: 10px;
  right: 45px;
}

.autocomplete-container {
  position: relative;
  width: 305px;
  left: 0;
  position: absolute;
}

.autocomplete {
  position: absolute;
  border-top: 1px solid #ebebeb;
  width: 305px;
  z-index: 999;
  top: 50px;
  right: 45px;
}

input {
  background-color: white;
}

.search-btn {
  border-radius: 0 !important;
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

.autocomplete-message {
  width: 100%;
  border-bottom: 1px solid #ebebeb;
  border-left: 1px solid #ebebeb;
  border-right: 1px solid #ebebeb;
  background-color: white;
  padding: 10px;
  font-size: 12px;
  line-height: 16px;
  color: #666666;
}

.autocomplete-item:hover {
  background-color: #3558a2;
  color: white;
}

.autocomplete-item-select {
  background-color: #3558a2;
  color: white;
}

@media screen and (max-width: 767px) {
  #searchMap {
    right: auto;
    left: 50%;
    transform: translate(-55%, 0);
  }
}
</style>