<template>
    <div class="leftCol">

      <div class="ariane_container">
        <div><span>France</span></div>
        <div><span>Hérault (34)</span></div>
        <div><span>EPCI (130025265)</span></div>
      </div>

      <div class="location_container">
       <div><span class="location_title">DÉPARTEMENT</span></div>
       <div><span class="location_label">Hérault (34)</span></div>
      </div>

      <div class="global_numbers_container">
        <div class="global_number_wrapper">
          <div class="global_number_title">Nombre total de ventes</div>
          <div class="global_number_value">123 984</div>
        </div>
        <div class="global_number_wrapper">
          <div class="global_number_title">Prix de vente moyen au m2</div>
          <div class="global_number_value">22 341€</div>
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
            <td>42 394</td>
            <td>18 984</td>
            <td>2 983</td>
          </tr>
          <tr>
            <th class='left'>Prix moyen m2 :</th>
            <td>22 334€</td>
            <td>22 314€</td>
            <td>22 344€</td>
          </tr>
        </table>
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

export default {
  name: 'LeftCol',
  components: {},
  data() {
    return {
      apiLevel: null,
      apiResult: null
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

    }
  },
  watch: {
    level: {
      handler(value) {
        this.fetchHistoricalData(value)
      }
    },
  }
}

</script>

<style scoped>

.leftCol{
    display: inline-block;
    width: 25%;
    min-height: 100%;
    float:left;
    padding-left: 20px;
    padding-right: 20px;
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

.ariane_container div:after{
  content: ">";
  margin:0 5px 0 5px;
  text-decoration: none;
}

.ariane_container div:last-child:after{
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




</style>