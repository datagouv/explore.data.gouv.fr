<template>
  <div id="filtersBox" :class="openFilters?'open':''">
    <div class="filtersHeader" @click="openFilters?openFilters=false:openFilters=true">
      <span>Filtres</span>
      <div class="filtersIcon">
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M4.99999 3.78132L8.29999 0.481323L9.24266 1.42399L4.99999 5.66666L0.757324 1.42399L1.69999 0.481323L4.99999 3.78132Z" fill="#161616"/>
        </svg>
      </div>
    </div>
    <div class="filtersBody">
      <span class="filtersTitle">TYPE DE BIEN</span>
      <div class="filter"
        :class="activeFilter=='tous'?'selected':''" @click="updateActiveFilter('tous')"><div></div>Tous (appt. + maison)</div>
      <div class="filter" :class="activeFilter=='appartement'?'selected':''"  @click="updateActiveFilter('appartement')"><div></div>Appartement</div>
      <div class="filter" :class="activeFilter=='maison'?'selected':''"  @click="updateActiveFilter('maison')"><div></div>Maison</div>
      <div class="filter" :class="activeFilter=='local'?'selected':''"  @click="updateActiveFilter('local')"><div></div>Local commercial</div>

    </div>
  </div>
</template>

<script>

import appStore from '@/apps/dvf/store'

export default {
  name: 'FiltersBox',
  components: {},
  data() {
    return {
      openFilters:false,
      selectedFilter:"tous"
    }
  },
  computed: {
    activeFilter:function(){
      return appStore.state.activeFilter
    },
  },
  mounted() {
    
  },
  methods: {
    updateActiveFilter(f){
      appStore.commit("updateActiveFilter",f)
      this.$router.push({path: this.$route.path, query: { ...this.$route.query, filtre: f }})
    }
  },
  watch: {
  }
}

</script>

<style scoped>

  #filtersBox{
    width: 305px;
    position: absolute;
    height: 40px;
    top: 60px;
    right:20px;
    background-color: white;
    z-index: 9;
    transition: all 0.2s ease-in-out;
    overflow: hidden;
  }

  #filtersBox.open{
    height: 208px;
  }

  .filtersHeader{
    width: 100%;
    height: 40px;
    position: relative;
    cursor: pointer;
    padding-left: 16px;
    border-bottom: 1px solid #E5E5E5;
  }

  .filtersHeader span{
    display: block;
    position: absolute;
    font-size: 14px;
    font-weight: 700;
    top:50%;
    transform:translate(0,-50%);
  }

  .filtersIcon{
    display: block;
    position: absolute;
    right: 20px;
    top:50%;
    transform:translate(0,-50%);
    transition: all 0.2s ease-in-out;
  }

  #filtersBox.open .filtersIcon{
    transform:translate(0,-50%) rotate(180deg); 
  }

  .filtersBody{
    padding-left: 16px;
    padding-top: 5px;
  }

  .filtersTitle{
    font-size: 12px;
    font-weight: 700;
    margin-top: 5px;
    margin-bottom: 5px;
    display: block;
  }

  .filter{
    font-size: 14px;
    font-weight: 400;
    display: block;
    cursor: pointer;
  }

  .filter div{
    width: 20px;
    height: 20px;
    border:1px solid black;
    display: inline-block;
    border-radius: 50%;
    margin-right: 5px;
    transform:translate(0,5px);
    position: relative;
  }

  .filter.selected div:before{
    content: "";
    display: block;
    width: 10px;
    height:10px;
    background-color: #3558A2;
    border-radius: 50%;
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
  }

</style>