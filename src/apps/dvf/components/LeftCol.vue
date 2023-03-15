<template>
    <div class="leftCol">
      <div class="ariane_container">
        <div><span>France</span></div>
        <div v-if="dep"><span>{{depLabel}} ({{dep}})</span></div>
        <div v-if="com"><span>{{comLabel}}</span></div>
        <div v-if="section"><span>section {{section}}</span></div>
      </div>

      <div class="location_container">

        <div v-if="level === 'fra'">
         <div><span class="location_title">PAYS</span></div>
         <div><span class="location_label">France entière</span></div>
        </div>

        <div v-if="level === 'departement'">
         <div><span class="location_title">DÉPARTEMENT</span></div>
         <div><span class="location_label">{{depLabel}} ({{dep}})</span></div>
        </div>

        <div v-if="level === 'commune'">
         <div><span class="location_title">COMMUNE</span></div>
         <div><span class="location_label">{{comLabel}}</span></div>
        </div>

        <div v-if="level === 'section'">
         <div><span class="location_title">SECTION</span></div>
         <div><span class="location_label">{{section}}</span></div>
        </div>

      </div>

      <div class="global_numbers_container">
        <div class="global_number_wrapper">
          <div class="global_number_title">Nombre total de ventes</div>
          <div class="global_number_value">{{clientData["totalVentes"]}}</div>
        </div>
        <div class="global_number_wrapper">
          <div class="global_number_title">Prix de vente moyen au m2</div>
          <div class="global_number_value">{{clientData["totalAverage"]}}</div>
        </div>
      </div>

      <div class="tab_container">
        <table>
          <tr>
            <th></th>
            <th>Appt.</th>
            <th>Maisons</th>
            <th>Locaux</th>
          </tr>
          <tr>
            <th class='left'>Ventes :</th>
            <td>{{clientData["appVentes"]}}</td>
            <td>{{clientData["houseVentes"]}}</td>
            <td>{{clientData["localVentes"]}}</td>
          </tr>
          <tr>
            <th class='left'>Prix moyen m2 :</th>
            <td>{{clientData["appPrice"]}}</td>
            <td>{{clientData["housePrice"]}}</td>
            <td>{{clientData["localPrice"]}}</td>
          </tr>
        </table>
      </div>

      <div class="chart_container">
        <span class="chart_title">Evolution du prix de vente moyen au m2</span>
        <line-chart></line-chart>
      </div>

      <div class="chart_container">
        <span class="chart_title">Distribution du prix de vente au m2</span>
        <bar-chart></bar-chart>
      </div>

      <!-- 
      current zoom level : {{zoomLevel}}
      <br/>
      current dep : {{dep}}
      <br/>
      current com : {{com}}
      <br/>
      current section : {{section}}
      <br/>
      current parcelle : {{parcelle}}
        
      <br /><br />
      Resultat API {{ apiLevel }}
      <br />
      {{ apiResult }} -->
    </div>
</template>

<script>

import appStore from '@/apps/dvf/store'
import LineChart from '@/apps/dvf/components/LineChart'
import BarChart from '@/apps/dvf/components/BarChart'

export default {
  name: 'LeftCol',
  components: {LineChart, BarChart},
  data() {
    return {
      apiLevel: null,
      apiResult: null,
      clientData:{
        totalVentes:0,
        totalAverage:0,
        appVentes:0,
        appPrice:0,
        houseVentes:0,
        housePrice:0,
        localVentes:0,
        localPrice:0
      }
    }
  },
  computed: {
    zoomLevel:function(){
      return appStore.state.map.zoomLevel
    },
    dep:function(){
      return appStore.state.location.dep
    },
    com:function(){
      return appStore.state.location.com
    },
    section:function(){
      return appStore.state.location.section
    },
    parcelle:function(){
      return appStore.state.location.parcelle
    },
    level:function(){
      return appStore.state.location.level
    },
    depLabel:function(){
      return appStore.state.locationLabels.dep
    },
    comLabel:function(){
      return appStore.state.locationLabels.com
    }
  },
  mounted() {
      fetch("http://dvf.dataeng.etalab.studio/nation")
      .then((response) => {
          return response.json()
      })
      .then((data) => {
       this.apiResult = data
       this.apiLevel = "nation"
      });
  },
  methods: {
    fetchHistoricalData(level){
      let code = null
      if (level === "departement"){
        code = this.dep
      }
      if (level === "commune"){
        code = this.com
      }
      if (level === "section"){
        code = this.section
      }
      fetch("http://dvf.dataeng.etalab.studio/" + level + "/" + code)
      .then((response) => {
          return response.json()
      })
      .then((data) => {
       this.apiResult = data
       this.apiLevel = level
      });
    },
    storeApiData(){
      appStore.commit("updateApiData",this.apiResult)
    },
    buildClientData(){
      var data = this.apiResult["data"]
      var lastDataPoint = data[data.length-1]

      console.log(lastDataPoint)
      
      this.clientData.totalVentes = (lastDataPoint["nb_ventes_appartement"] + lastDataPoint["nb_ventes_local"] + lastDataPoint["nb_ventes_maison"]).toLocaleString()

      this.clientData.totalAverage = Math.round((lastDataPoint["moy_prix_m2_appartement"] + lastDataPoint["moy_prix_m2_local"] + lastDataPoint["moy_prix_m2_maison"] / 3)).toLocaleString()+" €"

      if(lastDataPoint["nb_ventes_appartement"] == null){
        this.clientData.appVentes = 0
        this.clientData.appPrice = "N/A"
      }else{
        this.clientData.appVentes = lastDataPoint["nb_ventes_appartement"].toLocaleString()
        this.clientData.appPrice = lastDataPoint["moy_prix_m2_appartement"].toLocaleString()+" €"
      }

      if(lastDataPoint["nb_ventes_local"] == null){
        this.clientData.localVentes = 0
        this.clientData.localPrice = "N/A"
      }else{
        this.clientData.localVentes = lastDataPoint["nb_ventes_local"].toLocaleString()
        this.clientData.localPrice = lastDataPoint["moy_prix_m2_local"].toLocaleString()+" €"
      }

      if(lastDataPoint["nb_ventes_maison"] == null){
        this.clientData.houseVentes = 0
        this.clientData.housePrice = "N/A"
      }else{
        this.clientData.houseVentes = lastDataPoint["nb_ventes_maison"].toLocaleString()
        this.clientData.housePrice = lastDataPoint["moy_prix_m2_maison"].toLocaleString()+" €"
      }

    }
  },
  watch: {
    level: {
      handler(value) {
        this.fetchHistoricalData(value)
      }
    },
    apiResult(){
      this.buildClientData()
      this.storeApiData()
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

.ariane_container{
  width: 100%;
  margin-top: 20px;
}

.ariane_container div{
  display: inline-block;
  font-size: 12px;
  color:#666666;
  cursor: pointer;
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
  padding-bottom: 20px;
  border-bottom: 1px solid #E5E5E5;
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
}

.global_number_wrapper{
  width: 50%;
  display: inline-block;
}

.global_number_title{
  font-weight: 700;
  font-size: 12px;
  color:#3A3A3A;
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
  width: 80%;
  text-align: center;
  margin:0 auto;
}

.tab_container table th{
  font-size: 12px;
  font-weight: 400;
}

.tab_container table th.left{
  text-align: left;
}

.tab_container table td{
  font-size: 12px;
  font-weight: 700;
}

.chart_container{
  padding-top: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #E5E5E5;
}

.chart_title{
  font-size: 12px;
  font-weight: 700;
}




</style>