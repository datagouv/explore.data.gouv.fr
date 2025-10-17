<template>
  <div>
    <div class="fr-container fr-container-lg--fluid" id="searchMap">
      <div class="autocomplete-container">
        <div class="fr-search-bar" id="search-540" role="search">
          <label class="fr-label" for="search-540-input"> Rechercher </label>
          <input
            v-model="searchAdress"
            class="fr-input"
            placeholder="Rechercher une adresse ou une parcelle"
            type="search"
            id="search-540-input"
            name="search-540-input"
            v-on:keyup.enter="autoComplete()"
            @input="autoComplete()"
          />
          <button
            class="fr-btn search-btn"
            title="Rechercher"
            @click="getAdresses()"
          >
            Rechercher
          </button>
        </div>
      </div>
    </div>
    <div v-if="resultsAdresses" class="autocomplete">
      <div
        @click="moveTo(item.geometry.coordinates, item.properties.citycode, item.properties.city)"
        v-for="item in resultsAdresses.features"
        :key="item.properties.label"
      >
        <div
          :class="
            firstResult.properties.label === item.properties.label
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

export default {
  name: "SearchBar",
  components: {},
  data() {
    return {
      searchAdress: null,
      resultsAdresses: null,
    };
  },
  computed: {},
  mounted() {},
  methods: {
    getAdresses() {
      fetch(
        "https://api-adresse.data.gouv.fr/search/?q=" +
          this.searchAdress.replace(" ", "%20")
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          this.resultsAdresses = data;
          this.firstResult = data.features[0];
        });
    },
    getParcelle() {
      fetch(
        "https://data.geopf.fr/geocodage/search?index=parcel&q=" +
         this.searchAdress
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          data.features[0].citycode = data.features[0].departmentcode + data.features[0].municipalitycode
          this.resultsAdresses = data;
          this.firstResult = data.features[0];
        });
    },
    autoComplete() {
      if (this.searchAdress.length === 0) {
        this.resultsAdresses = null;
      }
      // if the search is a parcelle id, we take it as it is
      const pattern = /^\d{8}(\d|[A-Z])[A-Z]\d{4}$/;
      if (pattern.test(this.searchAdress)) {
        let timer = setTimeout(() => {
          this.getParcelle();
        }, 650);
        return;
      }
      let search = this.searchAdress;
      let timer = setTimeout(() => {
        if (this.searchAdress === search) {
          this.getAdresses();
        }
      }, 650);
    },
    moveTo(coord, citycode, cityname) {
      let obj = {}
      obj["coord"] = coord
      obj["citycode"] = citycode
      obj["cityname"] = cityname
      appStore.commit("changeSearchBarCoordinates", obj);
      this.resultsAdresses = null;
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