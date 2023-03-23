<template>
  <div class="fr-container fr-container-lg--fluid" id="searchMap">
    <div class="autocomplete-container">
      <div class="fr-search-bar" id="search-540" role="search">
        <label class="fr-label" for="search-540-input">
            Rechercher
        </label>
        <input 
          v-model="searchAdress"
          class="fr-input"
          placeholder="Rechercher une adresse"
          type="search"
          id="search-540-input"
          name="search-540-input"
          v-on:keyup.enter="goToFirstResult()"
          @input="autoComplete()"
        >
        <button class="fr-btn search-btn" title="Rechercher" @click="getAdresses()">
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
</template>

<script>

import appStore from '@/apps/dvf/store'

export default {
  name: 'SearchBar',
  components: {},
  data() {
    return {
      searchAdress: null,
      resultsAdresses: null,
    }
  },
  computed: {
  },
  mounted() {
    
  },
  methods: {
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
    autoComplete() {
      console.log("autoComplete ?")
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
    moveTo(coord,zoom){
      console.log("move to",coord)
    }
  },
  watch: {
  }
}

</script>

<style scoped>

  #searchMap{
    width: 305px;
    position: absolute;
    height: 40px;
    z-index: 999;
    top: 20px;
    right:20px;
  }

  .autocomplete-container {
    position: relative;
  }

  .autocomplete {
    position: absolute;
    
    border-top: 1px solid #ebebeb;
    width: 305px;
    z-index: 999;
  }

  input{
    background-color: white;
  }

  .search-btn{
    border-radius: 0!important;
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

</style>