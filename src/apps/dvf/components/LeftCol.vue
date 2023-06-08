<template>
    <div class="leftCol" :class="{[leftColOpening]: true}">

      <div class="leftColOpener" @click="changeLeftColOpening()"><span>^</span></div>

      <div class="header_container" v-if="level === 'fra'">
        <h2 class="intro_title">Bonjour !<br>Bienvenue</h2>
        <span class="intro_text">Suivez l'évolution des prix de l'immobilier et trouver le prix des ventes immobilières sur les 5 dernières années.</span>
      </div>

      <div class="header_container" v-if="level != 'fra'">

        <div class="ariane_container">
          <div><span>France</span></div>
          <div v-if="userLocation.depName"><span>{{ userLocation.depName}} ({{ userLocation.dep }})</span></div>
          <div v-if="userLocation.comName"><span>{{ userLocation.comName }} ({{ userLocation.com }})</span></div>
          <div v-if="userLocation.sectionName"><span>Section {{ userLocation.sectionName }}</span></div>
          <div v-if="userLocation.parcelleName"><span>Parcelle {{ userLocation.parcelleName }}</span></div>
        </div>

        <div class="location_container">

          <div v-if="level === 'fra'">
           <div><span class="location_title">PAYS</span></div>
           <div><span class="location_label">France entière</span></div>
          </div>

          <div v-if="level === 'departement'">
           <div><span class="location_title">DÉPARTEMENT</span></div>
           <div><span class="location_label">{{ userLocation.depName }} ({{ userLocation.dep }})</span></div>
          </div>

          <div v-if="level === 'commune'">
           <div><span class="location_title">COMMUNE</span></div>
           <div><span class="location_label">{{ userLocation.comName }} ({{ userLocation.com }})</span></div>
          </div>

          <div v-if="level === 'section'">
           <div><span class="location_title">SECTION CADASTRALE</span></div>
           <div><span class="location_label">{{ userLocation.section }}</span></div>
          </div>

          <div v-if="level === 'parcelle'">
           <div><span class="location_title">PARCELLE CADASTRALE</span></div>
           <div><span class="location_label">{{ userLocation.parcelle }}</span></div>
          </div>

        </div>

      </div>

      <div class="links_container" v-if="level != 'fra'">
          <div class="cardPartner" @click="goToPartner('arcep')">
            <!-- <div class="logoPartner">
              <img src="../assets/logos/arcep.png" width="100" />
            </div> -->
            <div class="textPartner">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 2V3H1.5V8.5H7V6H8V9C8 9.27614 7.77614 9.5 7.5 9.5H1C0.723858 9.5 0.5 9.27614 0.5 9V2.5C0.5 2.22386 0.723858 2 1 2H4ZM9.5 0.5V5L7.603 3.1035L4.6035 6.1035L3.8965 5.3965L6.896 2.3965L5 0.5H9.5Z" fill="#3558A2"/></svg>
              Voir la couverture réseaux sur maconnexioninternet.arcep.fr
            </div>
          </div>
          <div class="cardPartner" @click="goToPartner('brgm')" v-if="this.userLocation.level != 'departement'">
            <!-- <div class="logoPartner">
              <img src="../assets/logos/logo_GR.png" width="100" />
            </div> -->
            <div class="textPartner">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 2V3H1.5V8.5H7V6H8V9C8 9.27614 7.77614 9.5 7.5 9.5H1C0.723858 9.5 0.5 9.27614 0.5 9V2.5C0.5 2.22386 0.723858 2 1 2H4ZM9.5 0.5V5L7.603 3.1035L4.6035 6.1035L3.8965 5.3965L6.896 2.3965L5 0.5H9.5Z" fill="#3558A2"/></svg>
              Voir les risques sur georisques.gouv.fr
            </div>
          </div>
          <div class="cardPartner" @click="goToPartner('acceslibre')">
            <!-- <div class="logoPartner">
              <img src="../assets/logos/acceslibre.svg" width="100" />
            </div> -->
            <div class="textPartner">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 2V3H1.5V8.5H7V6H8V9C8 9.27614 7.77614 9.5 7.5 9.5H1C0.723858 9.5 0.5 9.27614 0.5 9V2.5C0.5 2.22386 0.723858 2 1 2H4ZM9.5 0.5V5L7.603 3.1035L4.6035 6.1035L3.8965 5.3965L6.896 2.3965L5 0.5H9.5Z" fill="#3558A2"/></svg>
              Voir l’accessibilité sur acceslibre.beta.gouv.fr
            </div>
          </div>
          <div class="cardPartner" @click="goToPartner('ign')">
            <!--  <div class="logoPartner">
              <img src="../assets/logos/logo-geoportail.svg" width="100" />
            </div> -->
            <div class="textPartner">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 2V3H1.5V8.5H7V6H8V9C8 9.27614 7.77614 9.5 7.5 9.5H1C0.723858 9.5 0.5 9.27614 0.5 9V2.5C0.5 2.22386 0.723858 2 1 2H4ZM9.5 0.5V5L7.603 3.1035L4.6035 6.1035L3.8965 5.3965L6.896 2.3965L5 0.5H9.5Z" fill="#3558A2"/></svg>
              Voir les informations d’urbanisme sur geoportail-urbanisme.gouv.fr
            </div>
          </div>
        </div>

      <div class="stats_container" v-if="level != 'parcelle'">

        <div class="global_numbers_container">
          <div class="global_number_wrapper">
            <div class="global_number_title">Nombre total de ventes</div>
            <div class="global_number_value">{{clientData["totalVentes"]}}</div>
          </div>
          <div class="global_number_wrapper">
            <div class="global_number_title">Prix de vente moyen au m²</div>
            <div class="global_number_value">{{clientData["totalAverage"]}}</div>
          </div>
        </div>

        <div class="tab_container">
          <table>
            <tr>
              <th></th>
              <th :class="activeFilter=='maison'||activeFilter=='local'?'hide':''"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22 21H2V19H3V4C3 3.44772 3.44772 3 4 3H18C18.5523 3 19 3.44772 19 4V9H21V19H22V21ZM17 19H19V11H13V19H15V13H17V19ZM17 9V5H5V19H11V9H17ZM7 11H9V13H7V11ZM7 15H9V17H7V15ZM7 7H9V9H7V7Z"></path></svg> Appt.</th>
              <th :class="activeFilter=='appartement'||activeFilter=='local'?'hide':''"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 21.0001H5C4.44772 21.0001 4 20.5524 4 20.0001V11.0001L1 11.0001L11.3273 1.61162C11.7087 1.26488 12.2913 1.26488 12.6727 1.61162L23 11.0001L20 11.0001V20.0001C20 20.5524 19.5523 21.0001 19 21.0001ZM13 19.0001H18V9.15757L12 3.70302L6 9.15757V19.0001H11V13.0001H13V19.0001Z"></path></svg> Maisons </th>
              <th :class="activeFilter!='local'?'hide':''"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21 13.2422V20H22V22H2V20H3V13.2422C1.79401 12.435 1 11.0602 1 9.5C1 8.67286 1.22443 7.87621 1.63322 7.19746L4.3453 2.5C4.52393 2.1906 4.85406 2 5.21132 2H18.7887C19.1459 2 19.4761 2.1906 19.6547 2.5L22.3575 7.18172C22.7756 7.87621 23 8.67286 23 9.5C23 11.0602 22.206 12.435 21 13.2422ZM19 13.9725C18.8358 13.9907 18.669 14 18.5 14C17.2409 14 16.0789 13.478 15.25 12.6132C14.4211 13.478 13.2591 14 12 14C10.7409 14 9.5789 13.478 8.75 12.6132C7.9211 13.478 6.75911 14 5.5 14C5.331 14 5.16417 13.9907 5 13.9725V20H19V13.9725ZM5.78865 4L3.35598 8.21321C3.12409 8.59843 3 9.0389 3 9.5C3 10.8807 4.11929 12 5.5 12C6.53096 12 7.44467 11.3703 7.82179 10.4295C8.1574 9.59223 9.3426 9.59223 9.67821 10.4295C10.0553 11.3703 10.969 12 12 12C13.031 12 13.9447 11.3703 14.3218 10.4295C14.6574 9.59223 15.8426 9.59223 16.1782 10.4295C16.5553 11.3703 17.469 12 18.5 12C19.8807 12 21 10.8807 21 9.5C21 9.0389 20.8759 8.59843 20.6347 8.19746L18.2113 4H5.78865Z"></path></svg> Locaux</th>
            </tr>
            <tr>
              <th class='left'>Ventes :</th>
              <td :class="activeFilter=='maison'||activeFilter=='local'?'hide':''">{{clientData["appVentes"]}}</td>
              <td :class="activeFilter=='appartement'||activeFilter=='local'?'hide':''">{{clientData["houseVentes"]}}</td>
              <td :class="activeFilter!='local'?'hide':''">{{clientData["localVentes"]}}</td>
            </tr>
            <tr>
              <th class='left'>Prix moyen m² :</th>
              <td :class="activeFilter=='maison'||activeFilter=='local'?'hide':''">{{clientData["appPrice"]}}</td>
              <td :class="activeFilter=='appartement'||activeFilter=='local'?'hide':''">{{clientData["housePrice"]}}</td>
              <td :class="activeFilter!='local'?'hide':''">{{clientData["localPrice"]}}</td>
            </tr>
          </table>
        </div>

        <div class="chart_container">
          <span class="chart_title">Evolution du prix de vente moyen au m²</span>
          <span class="chart_geo">{{chartGeoLabel}}</span>
          <div class="chart_info_btn line_chart_info" @mouseover="hoveredBulle='line'" @mouseleave="hoveredBulle=''"><div>?</div></div>
          <div class="chart_info_bulle" v-if="hoveredBulle=='line'">Ce graphique indique l'évolution du prix au m² pour le type de biens sélectionné et l'échelle sélectionnée. Les prix au m² sont obtenus en divisant la valeur foncière du bien par sa surface au sol.</div>
          <line-chart></line-chart>
        </div>

        <div class="chart_container">
          <span class="chart_title">Distribution du prix de vente au m²</span>
          <span class="chart_geo">{{chartGeoLabel}}</span>
          <div class="chart_info_btn bar_chart_info" @mouseover="hoveredBulle='bar'" @mouseleave="hoveredBulle=''"><div>?</div></div>
          <div class="chart_info_bulle" v-if="hoveredBulle=='bar'">Ce graphique montre la répartition des prix des ventes à l'échelle sélectionnée, pour le type de biens sélectionné. En survolant chaque barre, vous pouvez voir combien de ventes se sont faites à un montant compris dans la tranche de prix affichée.</div>
          <bar-chart></bar-chart>
        </div>


      </div>

      <div class="mutations_container" v-if="level === 'parcelle'">
        <div class="mutation_box" v-bind:key="p['id']" v-for="p in parcellesMutations">
          <div class="content">
            <div class="nature">{{ p["nature_mutation"] }}</div>
            <span class="price">{{ p["price"] }}</span>
            <div class="infos">
              <span class="topinfo adresse"><img src="../assets/images/pin.svg"/> {{p["adresse_numero"]}} {{p["adresse_nom_voie"].toLowerCase()}}</span>
              <span class="topinfo id"><img src="../assets/images/id.svg"/> {{ p["id"] }}</span>
              <span class="topinfo date"><img src="../assets/images/date.svg"/> {{ p["date"] }}</span>
              
              <span v-for="item in p['assets']" class="infos_item">
                <span class="title">
                  <img v-if="item['type'].substring(0,4) === 'Dépe'" src="../assets/images/dependance.svg"/>
                  <img v-if="item['type'].substring(0,4) === 'Mais'" src="../assets/images/maison.svg"/>
                  <img v-if="item['type'].substring(0,4) === 'Loca'" src="../assets/images/local.svg"/>
                  <img v-if="item['type'].substring(0,4) === 'Appa'" src="../assets/images/appartement.svg"/>
                  <img v-if="item['type'].substring(0,4) != 'Dépe' && item['type'].substring(0,4) != 'Mais' && item['type'].substring(0,4) != 'Loca' && item['type'].substring(0,4) != 'Appa' " src="../assets/images/terrain.svg"/>
                  {{ item["type"] }}
                </span>
                <div class="filet" v-if="item['surface']"></div>
                <span class="value">{{ item["surface"] }}</span>
              </span>
            </div>  
            </div>
          </div>
        </div>
        

      </div>

    </div>
</template>

<script>

import appStore from '@/apps/dvf/store'
import LineChart from '@/apps/dvf/components/LineChart'
import BarChart from '@/apps/dvf/components/BarChart'
import CenterDeps from '@/apps/dvf/assets/json/centers_deps.json'

export default {
  name: 'LeftCol',
  components: {LineChart, BarChart},
  data() {
    return {
      apiLevel: null,
      apiResult: null,
      apiCode: null,
      clientData:{
        totalVentes:0,
        totalAverage:0,
        appVentes:0,
        appPrice:0,
        houseVentes:0,
        housePrice:0,
        localVentes:0,
        localPrice:0
      },
      rollingData:{
        nb_ventes_appartement:0,
        nb_ventes_local:0,
        nb_ventes_maison:0,
        moy_prix_m2_appartement:0,
        moy_prix_m2_local:0,
        moy_prix_m2_maison:0
      },
      parcellesMutations:null,
      leftColOpening:"",
      hoveredBulle:""
    }
  },
  computed: {
    saveApiUrl:function(){
      return appStore.state.saveApiUrl
    },
    saveApiResponse:function(){
      return appStore.state.saveApiResponse
    },
    zoomLevel:function(){
      return appStore.state.map.zoomLevel
    },
    dep:function(){
      return appStore.state.userLocation.dep
    },
    com:function(){
      return appStore.state.userLocation.com
    },
    section:function(){
      return appStore.state.userLocation.section
    },
    parcelle:function(){
      return appStore.state.userLocation.parcelle
    },
    level:function(){
      return appStore.state.userLocation.level
    },
    depLabel:function(){
      return appStore.state.locationLabels.dep
    },
    comLabel:function(){
      return appStore.state.locationLabels.com
    },
    activeFilter:function(){
      return appStore.state.activeFilter
    },
    userLocation:function(){
      return appStore.state.userLocation
    },
    mapProperties:function(){
      return appStore.state.mapProperties
    },
    chartGeoLabel:function(){
      var label = this.getGeoLabel()
      return label
    }
  },
  mounted() {
      let url = "http://dvf.dataeng.etalab.studio/nation/mois"
      fetch(url)
      .then((response) => {
          return response.json()
      })
      .then((data) => {
       this.sendApiResultToStore(url, data)
       this.apiResult = data
       this.apiLevel = "nation"
       if(this.$route.query.filtre){
          if(this.$route.query.filtre != this.activeFilter){
            this.updateActiveFilter(this.$route.query.filtre) 
          }
        }else{
          this.updateActiveFilter("tous")
        }
      });
  },
  methods: {
    fetchHistoricalData(level){
      if (level != "parcelle"){
        let url = null
        let code = null
        let data = null
        if (level == "fra"){
          code = "nation"
          url = "http://dvf.dataeng.etalab.studio/nation/mois"
        }
        if (level === "departement"){
          code = this.dep
          url = "http://dvf.dataeng.etalab.studio/departement/" + code
        }
        if (level === "commune"){
          code = this.com
          url = "http://dvf.dataeng.etalab.studio/commune/" + code
        }
        if (level === "section"){
          code = this.section
          url = "http://dvf.dataeng.etalab.studio/section/" + code
        }
        if (this.saveApiUrl.includes(url)){
          data = this.saveApiResponse[url] 
          if (data) {
            this.sendApiResultToStore(url, data)
            this.apiResult = data
            this.apiLevel = level
            this.apiCode = code
          }
        } else {
          fetch(url)
          .then((response) => {
              return response.json()
          })
          .then((data) => {
            this.sendApiResultToStore(url, data)
            this.apiResult = data
            this.apiLevel = level
            this.apiCode = code
          });
        }
      }
    },
    storeApiData(){
      appStore.commit("updateApiData",this.apiResult)
      appStore.commit("updateApiLevel",this.apiLevel)
      appStore.commit("updateApiCode",this.apiCode)
    },
    buildClientData(){
      var url
      if(this.apiLevel=="commune"){
        url = "http://dvf.dataeng.etalab.studio/departement/"+this.dep+"/communes"
      } else if(this.apiLevel=="section"){
        url= "http://dvf.dataeng.etalab.studio/commune/"+this.com+"/sections"
      } else if(this.apiLevel=="fra"){
         url = "http://dvf.dataeng.etalab.studio/nation"
      }
      else{
        url = "http://dvf.dataeng.etalab.studio/" + this.apiLevel
      }
      if (this.saveApiUrl.includes(url)) {
          this.manageClientData(this.saveApiResponse[url])
      } else {
        fetch(url)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
          this.sendApiResultToStore(url, data)
          this.manageClientData(data)
          });
      }
    },

    manageClientData(data){
        var levelData
        if(this.apiLevel == 'nation'){
          levelData = data["data"][0]
        }else{
          levelData = data["data"].find(obj => {
            return obj.code_geo === this.apiCode
          })
        }
        if(this.activeFilter === 'tous'){
          this.clientData.totalVentes=(levelData["nb_mutations_appartement_5ans"]+levelData["nb_mutations_maison_5ans"]).toLocaleString()
          this.clientData.totalAverage=Math.round(levelData["moy_prix_m2_appart_maison_5ans"]).toLocaleString()+"€"
        }else if(this.activeFilter === 'maison'){
          this.clientData.totalVentes=levelData["nb_mutations_maison_5ans"].toLocaleString()
          this.clientData.totalAverage=Math.round(levelData["moy_prix_m2_maison_5ans"]).toLocaleString()+"€"
        }else if(this.activeFilter === 'appartement'){
          this.clientData.totalVentes=levelData["nb_mutations_appartement_5ans"].toLocaleString()
          this.clientData.totalAverage=Math.round(levelData["moy_prix_m2_appart_5ans"]).toLocaleString()+"€"
        }else if(this.activeFilter === 'local'){
          this.clientData.totalVentes=levelData["nb_mutations_local_5ans"].toLocaleString()
          this.clientData.totalAverage=Math.round(levelData["moy_prix_m2_local_5ans"]).toLocaleString()+"€"
        }
        this.clientData.appVentes=levelData["nb_mutations_appartement_5ans"].toLocaleString()

        if(levelData["moy_prix_m2_appart_5ans"] === null){
          this.clientData.appPrice = "indisponible"
        }else{
          this.clientData.appPrice=Math.round(levelData["moy_prix_m2_appart_5ans"]).toLocaleString()+"€"  
        }
        
        this.clientData.houseVentes=levelData["nb_mutations_maison_5ans"].toLocaleString()

        if(levelData["moy_prix_m2_maison_5ans"] === null){
          this.clientData.housePrice = "indisponible"
        }else{
          this.clientData.housePrice=Math.round(levelData["moy_prix_m2_maison_5ans"]).toLocaleString()+"€"  
        }

        this.clientData.localVentes=levelData["nb_mutations_local_5ans"].toLocaleString()

        if(levelData["moy_prix_m2_local_5ans"] === null){
          this.clientData.localPrice = "indisponible"
        }else{
          this.clientData.localPrice=Math.round(levelData["moy_prix_m2_local_5ans"]).toLocaleString()+"€"  
        }

    },
    manageMutationsData(data){
      if(data){
        let mutationsId = []
        let mutationsObj = {}
        this.parcellesMutations = []
        data["data"].forEach(obj => {
          if (obj.id_parcelle == this.userLocation.parcelle) {
            if (!mutationsId.includes(obj.id_mutation)){ 
              mutationsId.push(obj.id_mutation)
              mutationsObj[obj.id_mutation] = {}
              mutationsObj[obj.id_mutation]["id"] = obj.id_mutation
              mutationsObj[obj.id_mutation]["nature_mutation"] = obj.nature_mutation
              mutationsObj[obj.id_mutation]["adresse_nom_voie"] = obj.adresse_nom_voie
              mutationsObj[obj.id_mutation]["adresse_numero"] = obj.adresse_numero
              mutationsObj[obj.id_mutation]["date"] = this.formatDate(obj.date_mutation)
              mutationsObj[obj.id_mutation]["price"] = this.formatPrice(obj.valeur_fonciere)
              mutationsObj[obj.id_mutation]["assets"] = []
            }
            if(obj.type_local) {
              let asset = {}
              let complement_type = ""
              if (obj.nombre_pieces_principales){
                complement_type = " / " + obj.nombre_pieces_principales + "p"
              }
              asset["type"] = obj.type_local + complement_type
              asset["surface"] = this.formatSurface(obj.surface_reelle_bati)
              mutationsObj[obj.id_mutation]["assets"].push(asset)
            }
            if(obj.nature_culture) {
              let asset = {}
              asset["type"] = obj.nature_culture
              asset["surface"] = this.formatSurface(obj.surface_terrain)
              mutationsObj[obj.id_mutation]["assets"].push(asset)
            }
            mutationsObj[obj.id_mutation]["assets"] = mutationsObj[obj.id_mutation]["assets"].reduce((unique, o) => {
                if(!unique.some(subobj => subobj.type === o.type && subobj.surface === o.surface)) {
                  unique.push(o);
                }
                return unique;
            },[]);
            let sorter = (a, b) => {
              if(a.type.includes("Appartement")){
                  return -1;
              };
              if(b.type.includes("Appartement")){
                  return 1;
              };
              return a.name < b.name ? -1 : 1;
            };
            mutationsObj[obj.id_mutation]["assets"].sort(sorter)
            sorter = (a, b) => {
              if(a.type.includes("Maison")){
                  return -1;
              };
              if(b.type.includes("Maison")){
                  return 1;
              };
              return a.name < b.name ? -1 : 1;
            };
            mutationsObj[obj.id_mutation]["assets"].sort(sorter)
            this.parcellesMutations = mutationsObj
            console.log(this.parcellesMutations)
            //console.log(obj)
            }
          });
          //console.log(mutationsObj)
      }
    },
    fetchMutationsData(){
      if(this.userLocation.parcelle){
        var self = this
        let data = null
        var url="http://dvf.dataeng.etalab.studio/mutations/" + this.userLocation.parcelle.substring(0,5) + "/" + this.userLocation.parcelle.substring(5,10)
        if (this.saveApiUrl.includes(url)){
            data = this.saveApiResponse[url] 
            this.manageMutationsData(data)
          } else {
          fetch(url)
          .then((response) => {
              return response.json()
          })
          .then((data) => {
            this.sendApiResultToStore(url, data)
            this.manageMutationsData(data)

          })
        }
      }
    },

    updateActiveFilter(f){
      appStore.commit("updateActiveFilter",f)
      this.$router.push({path: this.$route.path, query: { ...this.$route.query, filtre: f }}).catch(()=>{});
    },

    formatDate(date){
      var d = new Date(date)
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return d.toLocaleDateString("fr-Fr",options)
    },

    formatPrice(price){
      if (price) {
        var p = parseInt(price).toLocaleString()+" €"
        return p
      } else {
        return "Non renseigné"
      }
    },

    formatSurface(surface){
      if(surface) {
        var s = parseInt(surface).toLocaleString()+" m²"
        return s
      } else {
        return null
      }
    },

    sendApiResultToStore(url, data){
      let obj = {}
      obj.url = url
      obj.data = data
      appStore.commit("addApiResult", obj)
    },
    goToPartner(partner){
      if (this.userLocation.level == "departement"){
        if (partner == 'arcep') { 
          window.open("https://maconnexioninternet.arcep.fr/?lat=" + CenterDeps[this.userLocation.dep]["coordinates"][1] + '&lng=' + CenterDeps[this.userLocation.dep]["coordinates"][0] + '&zoom=' + this.mapProperties.zoomLevel + '&mode=normal')
        }
        if (partner == 'acceslibre') { 
          window.open("https://acceslibre.beta.gouv.fr/recherche/?what=&where=" + this.userLocation.depName + "&lat=" + CenterDeps[this.userLocation.dep]["coordinates"][1] + "&lon=" + CenterDeps[this.userLocation.dep]["coordinates"][0] + "&code=" + this.userLocation.dep)
        }
        if (partner == 'ign') { 
          window.open("https://www.geoportail-urbanisme.gouv.fr/map/#tile=1&zoom=" + this.mapProperties.zoomLevel + "&lon=" + CenterDeps[this.userLocation.dep]["coordinates"][0] + "&lat=" + CenterDeps[this.userLocation.dep]["coordinates"][1])
        }
      } else {
        let url = "https://geo.api.gouv.fr/communes?code=" + this.userLocation.com + "&fields=centre"
        fetch(url)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
          if (partner == 'arcep') { 
            window.open("https://maconnexioninternet.arcep.fr/?lat=" + data[0]["centre"]["coordinates"][1] + '&lng=' + data[0]["centre"]["coordinates"][0] + '&zoom=' + this.mapProperties.zoomLevel + '&mode=normal')
          }
          if (partner == 'brgm') { 
            window.open("https://www.georisques.gouv.fr/mes-risques/connaitre-les-risques-pres-de-chez-moi/rapport2?form-adresse=true&isCadastre=false&city=" + this.userLocation.comName + "&type=housenumber&typeForm=commune&codeInsee=" + this.userLocation.com + "&lon=" + data[0]["centre"]["coordinates"][0] + "&lat=" +  data[0]["centre"]["coordinates"][1] + "&go_back=%2F")
          }
          if (partner == 'acceslibre') { 
            window.open("https://acceslibre.beta.gouv.fr/recherche/?what=&where=" + this.userLocation.comName + "&lat=" + data[0]["centre"]["coordinates"][1] + "&lon=" + data[0]["centre"]["coordinates"][0] + "&code=" + this.userLocation.com)
          }
          if (partner == 'ign') { 
            window.open("https://www.geoportail-urbanisme.gouv.fr/map/#tile=1&zoom=" + this.mapProperties.zoomLevel + "&lon=" + data[0]["centre"]["coordinates"][0] + "&lat=" + data[0]["centre"]["coordinates"][1] + "&mlon=" + data[0]["centre"]["coordinates"][0] + "&mlat=" + data[0]["centre"]["coordinates"][1])
          }
        })
      }
    },
    getGeoLabel(){
      var label = ""

      if(this.level === 'fra'){
        label = ""
      }else if(this.level === 'departement'){
        label = " ("+this.userLocation.depName+")"
      }else if(this.level === 'commune'){
        label = " ("+this.userLocation.comName+")"
      }else if(this.level === 'section'){
        label = " ("+this.userLocation.section+")"
      }else if(this.level === 'parcelle'){
        label = " ("+this.userLocation.parcelle+")"
      }

      return label
    },

    getMutationPicto(){
      return "../assets/images/appartement.svg"
    },

    changeLeftColOpening(){
      if(this.leftColOpening == "close"||this.leftColOpening == ""){
        this.leftColOpening = "open"
      }else{
        this.leftColOpening = "close"
      } 
    }
  },
  watch: {
    
    // level: {
    //   handler(value) {
    //     this.fetchHistoricalData(value)
    //   }
    // },
    level(){
      this.fetchHistoricalData(this.level)
      //this.buildClientData()
    },
    dep(){
      this.fetchHistoricalData(this.level)
    },
    com(){
      this.fetchHistoricalData(this.level)
    },
    section(){
      this.fetchHistoricalData(this.level)
    },
    parcelle(){
      this.fetchMutationsData(this.parcelle)
    },
    apiResult(){
      this.buildClientData()
      this.storeApiData()
    },
    activeFilter(){
      this.buildClientData()
    }
  }
}

</script>

<style scoped>

.leftCol{
  position: relative;
  display: inline-block;
  width: 25%;
  float:left;
  padding-left: 20px;
  padding-right: 20px;
  height: 100%;
  overflow: scroll;
}

.leftColOpener{
  display: none;
}

.header_container{
  padding-bottom: 10px;
}

.intro_title{
  font-size: 28px;
  line-height: 38px;
  margin-bottom: 5px;
  margin-top: 10px;
}

.intro_text{
  font-size: 14px;
  line-height: 24px;
}

.ariane_container{
  width: 100%;
  margin-top: 20px;
}

.ariane_container div{
  display: inline-block;
  font-size: 12px;
  color:#666666;
}

.ariane_container div span{
  text-decoration: underline;
}

.ariane_container div:before{
  content: ">";
  margin:0 5px 0 5px;
  text-decoration: none;
}

.ariane_container div:first-child:before{
  display: none;
}

.location_container{
  width: 100%;
  margin-top: 10px;
}

.location_title{
  font-weight: 700;
  font-size: 12px;
  color:#3A3A3A;
}

.location_label{
  font-weight: 800;
  font-size: 28px;
  color:#161616;
}

.global_numbers_container{
  padding-top: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #E5E5E5;
  border-top: 1px solid #E5E5E5;
}

.global_number_wrapper{
  width: 50%;
  display: inline-block;
}

.global_number_title{
  font-weight: 700;
  font-size: 12px;
  color:#3A3A3A;
  line-height: 16px;
}

.global_number_value{
  font-weight: 800;
  font-size: 24px;
  color:#161616;
}

.tab_container{
  padding-top: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #E5E5E5;
}

.tab_container table{
  width: 100%;
  text-align: center;
  margin:0 auto;
}

.tab_container table th{
  font-size: 12px;
  font-weight: 400;
}

.tab_container table th svg{
  width: 12px;
  height: 12px;
  transform:translate(0,1px);
}

.tab_container table th.hide{
  opacity: 0.3;
}

.tab_container table th.left{
  text-align: left;
}

.tab_container table td{
  font-size: 12px;
  font-weight: 700;
}

.tab_container table td.hide{
  opacity: 0.3;
}


.chart_container{
  padding-top: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #E5E5E5;
  position: relative;
}

.links_container{
  padding-top: 0px;
  padding-bottom: 5px;
  border-bottom: 1px solid #E5E5E5;
}

.chart_title{
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
}

.chart_geo{
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
}

.chart_info_btn{
  display: inline-block; 
  margin-left: 5px;
  position: relative;
  top:3px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: #E6EEFE;
  cursor: pointer;
}

.chart_info_bulle{
  position: absolute;
  width: 80%;
  font-size: 12px;
  font-weight: 400;
  background-color: white;
  left:50%;
  top:50px;
  transform: translate(-50%,0);
  padding: 10px;
  line-height: 16px;
  border-radius: 5px;
  display: block;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.16), 0px 1px 0px -2px rgba(0, 0, 0, 0.16), 0px 1px 4px rgba(0, 0, 0, 0.23);
}

.chart_info_btn div{
  display: block;
  position: absolute;
  left:50%;
  top:50%;
  transform:translate(-50%,-50%);
  font-size: 12px;
  font-weight: 700;
}

.mutations_container{
  margin-top: 20px;
}

.mutation_box{
  width: 100%;
  /*max-width: 450px;*/
  min-height:50px;
  margin:0 auto 15px;
}

.mutation_box .content{
  border:1px solid #eeeeee;
  padding:20px;
  position: relative;
}

.mutation_box .content .nature{
  position: absolute;
  top:0;
  font-size: 12px;
  font-weight: 700;
  color:#666666;
  background-color: white;
  border:1px solid #eeeeee;
  border-radius: 4px;
  padding: 0 6px 0 6px;
  text-transform:uppercase;
  transform: translate(0,-50%);
}

.mutation_box .content .price{
  font-size: 18px;
  font-weight: 800;
  display: block;
  color: #161616;
}

.mutation_box .content .infos{
  padding: 0 10px 0;
}

.mutation_box .content .topinfo{
  font-size: 12px;
  color:#666666;
  font-weight: 400;
  display: block;
  height: 20px;
}

.mutation_box .content .topinfo img{
  vertical-align: middle;
}

.mutation_box .content .date{
  margin-bottom: 10px;
}

.infos_item{
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
}

.infos_item .title{
  font-size: 12px;
  font-weight: 400;
  color:#161616;
}

.infos_item .title img{
  vertical-align: middle;
}

.infos_item .filet{
  width: auto;
  height: 1px;
  background-color: #eeeeee;
  flex-grow: 10;
  margin-left: 10px;
  margin-right: 10px;
}

.infos_item .value{
  font-size: 12px;
  font-weight: 700;
  color:#161616;
}

.cardPartner{
  padding-bottom: 10px;
  display: flex;
  cursor: pointer;
}

.textPartner{
  color:#3558A2;
  font-size: 12px;
  font-weight: 700;
  line-height: 12px;
}

@media screen and (max-width: 1279px){

  .leftCol{
    width: 40%;
  }

}

@media screen and (max-width: 767px){

  .leftCol{
    position: absolute;
    width: 95%;
    left:50%;
    top:70%;
    transform:translate(-50%,-40px);
    z-index: 99;
    background-color: white;
    padding-top: 25px;
    padding-bottom: 50px;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
  }

  .leftCol.close{
    top:100%;
  }

  .leftCol.open{
    top:10%;
    overflow: scroll;
  }

  .leftColOpener{
    display: block;
    font-size: 25px;
    height: 40px;
    position: absolute;
    padding-top:10px;
    top:0;
    left:50%;
    transform:translate(-50%,0);
    width: 100%;
    text-align: center;
  }

  .leftColOpener span{
    position: relative;
    top:0;
  }

  .leftCol.open .leftColOpener{
    transform:translate(-50%,0) rotate(180deg);
  }

  
}


</style>