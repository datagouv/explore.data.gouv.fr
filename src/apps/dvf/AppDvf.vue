<template>
  <div class="fr-container--fluid">
    <header-apps :formHref="formHref"></header-apps>
    <div class="dvf_header">
      <h2>Explorateur de données de valeurs foncières</h2>
      <h3>Suivez l'évolution des prix de l'immobilier et trouvez le prix des ventes immobilières</h3>
      <div class="maj_date_container">Dernière mise à jour des données : 26 octobre 2022</div>
    </div>

    <div class="dvf_content" :class="activePanel==='faq'?'scrollable':''">
        
        <div class="panel_container">
          <div
          class="panel"
          v-for="p in panels"
          :class="p.id===activePanel?'active':''" 
          @click="changeActivePanel(p.id)"
          >
            {{p.label}}
          </div>
        </div>

        <div class="dvf_app">
          <map-view v-if="activePanel=='carte'"></map-view>
          <tableau-view v-if="activePanel=='tableau'"></tableau-view>
          <faq-view v-if="activePanel=='faq'"></faq-view>
          <sources-view v-if="activePanel=='sources'"></sources-view>
        </div>

    </div>

    <footer-apps :scrollable="isScrollable"></footer-apps>
  </div>
</template>

<script>

import appStore from '@/apps/dvf/store'
import HeaderApps from '@/views/HeaderApps'
import FooterApps from '@/views/FooterApps'
import MapView from '@/apps/dvf/views/MapView'
import TableauView from '@/apps/dvf/views/TableauView'
import FaqView from '@/apps/dvf/views/FaqView'
import SourcesView from '@/apps/dvf/views/SourcesView'

export default {
  name: 'AppDvf',
  components: {HeaderApps, FooterApps, MapView,TableauView,FaqView,SourcesView},
  data() {
    return {
      panels:[
        {"id":"carte","label":"Carte"},
        {"id":"tableau","label":"Tableau"},
        {"id":"faq","label":"Questions fréquentes"},
        {"id":"sources","label":"Sources"},
      ],
      formHref:"https://data.gouv.fr"
    }
  },
  computed: {
    activePanel () {
      return appStore.state.activePanel
    },
    activeFilter:function(){
      return appStore.state.activeFilter
    },
    zoomLevel:function(){
      return appStore.state.mapProperties.zoomLevel
    },
    lat:function(){
      return appStore.state.mapProperties.lat
    },
    lng:function(){
      return appStore.state.mapProperties.lng
    },
    level:function(){
      return appStore.state.userLocation.level
    },
    userLocation:function(){
      return appStore.state.userLocation
    },
    init:function(){
      return appStore.state.mapProperties.init
    },
    isScrollable:function(){
      if(appStore.state.activePanel==='faq'){
        return "scrollable"
      }else{
        return ""
      }
    }
  },
  mounted() {

    if(this.$route.query.onglet){
      if(this.$route.query.onglet != this.activePanel){
        this.changeActivePanel(this.$route.query.onglet) 
      }
    }else{
      this.changeActivePanel("carte")
    }

    /* if(this.$route.query.filtre){
      if(this.$route.query.filtre != this.activeFilter){
        this.updateActiveFilter(this.$route.query.filtre) 
      }
    }else{
      this.updateActiveFilter("tous")
    } */
    
  },
  methods: {
    changeActivePanel(id){
      appStore.commit("changeActivePanel",id)
      this.$router.push({path: this.$route.path, query: { ...this.$route.query, onglet: id }}).catch(()=>{});
    },
    updateActiveFilter(f){
      appStore.commit("updateActiveFilter",f)
      this.$router.push({path: this.$route.path, query: { ...this.$route.query, filtre: f }}).catch(()=>{})
    },
    // updateActiveLatLng(){
    //   let lat = parseFloat(this.lat).toFixed(2)
    //   let lng = parseFloat(this.lng).toFixed(2)
    //   let zoomLevel = parseFloat(this.zoomLevel).toFixed(2)
    //   if (lat != this.$route.query.lat) {
    //     this.$router.push({path: this.$route.path, query: { ...this.$route.query, lat: lat }})
    //   }
    //   if (lng != this.$route.query.lng) {
    //     this.$router.push({path: this.$route.path, query: { ...this.$route.query, lng: lng }})
    //   }
    //   if (zoomLevel != this.$route.query.zoom) {
    //     this.$router.push({path: this.$route.path, query: { ...this.$route.query, zoom: zoomLevel }})
    //   }
    // },
    updateActivePosition(){
        let level = this.level
        if (level == "departement"){
          if (this.userLocation.dep != this.$route.query.code) {
            this.$router.push({path: this.$route.path, query: { ...this.$route.query, code: this.userLocation.dep }}).catch(()=>{})
          }
        }
        if (level == "commune"){
          if (this.userLocation.com != this.$route.query.code) {
            this.$router.push({path: this.$route.path, query: { ...this.$route.query, code: this.userLocation.com }}).catch(()=>{})
          }
        }
        if (level == "section"){
          if (this.userLocation.section != this.$route.query.code) {
            this.$router.push({path: this.$route.path, query: { ...this.$route.query, code: this.userLocation.section }}).catch(()=>{})
          }
        }
        if (level == "parcelle"){
          if (this.userLocation.parcelle != this.$route.query.code) {
            this.$router.push({path: this.$route.path, query: { ...this.$route.query, code: this.userLocation.parcelle }}).catch(()=>{})
          }
        }
        if (level != "fra") {
          if (level != this.$route.query.level) {
            this.$router.push({path: this.$route.path, query: { ...this.$route.query, level: level }}).catch(()=>{})
          }
        } else {
          console.log(this.init)
          if (!this.init) {
            let query = {}
            for (const [key, value] of Object.entries(this.$route.query)) {
              console.log(key)
              if (key != "level" && key != "code"){
                query[key] = value
              }
            }
            this.$router.push({path: this.$route.path, query: query}).catch(()=>{})
          }
        }
     }
  },
  watch: {
    // zoomLevel(){
    //   this.updateActiveLatLng()
    // },
    // lat(){
    //   this.updateActiveLatLng()
    // },
    // lng(){
    //   this.updateActiveLatLng()
    // },
    level(){
      this.updateActivePosition()
    },
    userLocation(){
      this.updateActivePosition()
    }
  }
}
</script>

<style scoped>

  .dvf_header{
    padding-left: 20px;
    padding-top: 30px;
    position: relative;
  }

  .dvf_header h2{
    font-size: 24px;
    margin-bottom: 0;
    line-height: 32px;
  }

  .dvf_header h3{
    font-size: 14px;
    font-weight: 400;
    margin-bottom: 0;
  }

  .dvf_header .maj_date_container{
    position: absolute;
    right: 0;
    top:0;
    font-size: 14px;
    font-weight: 700;
    top:30px;
    right: 20px;
  }

  .dvf_content{
    position: absolute;
    top:158px;
    bottom:0px;
    width: 100%;
  }

  .dvf_app{
    position: absolute;
    width:100%;
    top:40px;    
    bottom:0;
  }

  .mainView{
    width: 100%;
    height: 100%;
    position: absolute;
    top:0;
    bottom:0; 
  }

  .dvf_content.scrollable{
    position: relative;
    top:0px;
    height: 100%;
  }

  .dvf_content.scrollable .dvf_app{
    position: relative;
    height: 100%;
  }

  .dvf_content.scrollable .mainView{
    position: relative;
  }

  .panel_container{
    display: flex;
    padding-left: 15px;
    padding-right: 15px;
    border-bottom:1px solid #E5E5E5;
  }

  .panel{
    width: 25%;
    height: 40px;
    background-color: #E6EEFE;
    font-size: 16px;
    font-weight: 700;
    text-align: center;
    margin:0 5px 0 5px;
    display: flex;
    justify-content: center;
    align-content: center;
    flex-direction: column;
    border-top:2px solid transparent;
    border-left:1px solid transparent;
    border-right:1px solid transparent;
    border-bottom:1px solid #E5E5E5;
    cursor: pointer;
    transform:translate(0,1px);
  }

  .panel.active{
    background-color: white;
    border-top:2px solid #3558A2;
    border-left:1px solid #E5E5E5;
    border-right:1px solid #E5E5E5;
    border-bottom:1px solid #ffffff;
    cursor: default;
    color:#3558A2;
  }

</style>