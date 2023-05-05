<template>
    <div class="mainView" id="tableauView">
        <div class="filtersTable">
          <div class="filterTable">
            Département
            <select class="fr-select dgvSelector" v-model="selectedResource" @change="redirectToResource">
              <option
                v-for="option in resources"
                :key="option.id"
                :value="option.id"
                :disabled="!option.preview_url"
                :selected="option == resource.id"
              >
                {{ option.title || 'Ressource sans nom' }}
              </option>
            </select>
          </div>
          <div class="filterTable" v-if="this.$route.query.level && this.$route.query.level == 'commune'">
            Commune<br />
            {{ userLocation.comName }}
          </div>
          <div class="filterTable" v-if="this.$route.query.level && this.$route.query.level == 'section'">
            Section cadastrale<br />
            {{ userLocation.section }}
          </div>
          <div class="filterTable" v-if="this.$route.query.level && this.$route.query.level == 'parcelle'">
            Parcelle cadastrale<br />
            {{ userLocation.parcelle }}
          </div>
          <div class="filterTable" v-if="this.$route.query.filtre">
            Type de locaux<br />
            <span v-if="this.$route.query.filtre == 'tous'">Appartement / Maison</span>
            <span v-if="this.$route.query.filtre == 'appartement'">Appartement</span>
            <span v-if="this.$route.query.filtre == 'maison'">Maison</span>
            <span v-if="this.$route.query.filtre == 'local'">Locaux</span>
          </div>
        </div>


        <Table class="fr-pt-0"></Table>
    </div>

</template>

<script>

import appStore from '@/apps/dvf/store'
import exploreStore from '@/store.js'
import Table from '../../../components/Table.vue'

export default {
  name: 'TableauView',
  components: {Table},
  data() {
    return {
      selectedResource: '',
      csvUrl: '',
      csvUrlFieldValue: '',
      resources: null,
      resource: {
        id: '',
        code: '',
      }
    }
  },
  computed: {
    userLocation:function(){
      return appStore.state.userLocation
    },
    
  },
  created() {
    this.$store.dispatch('apify', this.csvUrl).finally(() => {
    })
    fetch('https://www.data.gouv.fr/api/1/datasets/642205e1f2a0d0428a738699')
    .then((response) => {
        return response.json()
    })
    .then((data) => {
      this.resources = data["resources"]
      if (this.$route.query.code) {
        this.resources.forEach((item) =>{
          if (item["title"].includes(this.$route.query.code.substring(0,2))){
            console.log(item["id"])
            this.selectedResource = item["id"]
            if (this.$route.query.level == "commune"){
              let code = this.$route.query.code
              while(code.charAt(0) === '0')
              {
                code = code.substring(1);
              }
              this.$router.push({path: this.$route.path, query: { ...this.$route.query, code_commune__exact: code }}).catch(()=>{})
            }
            if (this.$route.query.level == "section" || this.$route.query.level == "parcelle"){
              let code = this.$route.query.code
              this.$router.push({path: this.$route.path, query: { ...this.$route.query, id_parcelle__contains: code }}).catch(()=>{})
            }
            if (this.$route.query.filtre && this.$route.query.filtre != "tous"){
              this.$router.push({path: this.$route.path, query: { ...this.$route.query, type_local__contains: this.$route.query.filtre }}).catch(()=>{})
            }
            if (this.$route.query.filtre && this.$route.query.filtre == "tous") { 
              this.$router.push({path: this.$route.path, query: { ...this.$route.query, logement__exact: 1 }}).catch(()=>{})
            }
            this.redirectToResource()
          }
        })
      } else {
        if (this.$route.query.filtre && this.$route.query.filtre != "tous"){
          this.$router.push({path: this.$route.path, query: { ...this.$route.query, type_local__contains: this.$route.query.filtre }}).catch(()=>{})
        }
        this.redirectToResource()
      }
    })
  },
  methods: {
    changeLocation(commitFunction, level, code, name){
      let obj = {}
      if (level == "fra") {
        obj.level = "fra"
        obj.dep = null
        obj.depName = null
        obj.com = null
        obj.comName = null
        obj.section = null
        obj.sectionName = null
        obj.parcelle = null
        obj.parcelleName = null
      }
      if (level == "departement") {
        obj.level = "departement"
        obj.dep = code
        obj.depName = name
        obj.com = null
        obj.comName = null
        obj.section = null
        obj.sectionName = null
        obj.parcelle = null
        obj.parcelleName = null
      }
      if (level == "commune") {
        obj.level = "commune"
        obj.dep = code.substring(0,2)
        obj.depName = CenterDeps[code.substring(0,2)]["nom"]
        obj.com = code
        obj.comName = name
        obj.section = null
        obj.sectionName = null
        obj.parcelle = null
        obj.parcelleName = null
      }
      if (level == "section") {
        obj.level = "section"
        obj.dep = code.substring(0,2)
        obj.depName = CenterDeps[code.substring(0,2)]["nom"]
        obj.com = code.substring(0,5)
        obj.comName = this.userLocation.comName
        obj.section = code
        obj.sectionName = name.slice(5)
        while(obj.sectionName.charAt(0) === '0')
        {
          obj.sectionName = obj.sectionName.substring(1);
        }
        obj.parcelle = null
        obj.parcelleName = null
      }
      if (level == "parcelle") {
        obj.level = "parcelle"
        obj.dep = code.substring(0,2)
        obj.depName = CenterDeps[code.substring(0,2)]["nom"]
        obj.com = code.substring(0,5)
        obj.comName = this.userLocation.comName
        obj.section = code.substring(0,10)
        obj.sectionName = code.substring(5,10)
        while(obj.sectionName.charAt(0) === '0')
        {
          obj.sectionName = obj.sectionName.substring(1);
        }
        obj.parcelle = code
        obj.parcelleName = name.slice(10)
        while(obj.parcelleName.charAt(0) === '0')
        {
          obj.parcelleName = obj.parcelleName.substring(1);
        }
      }
      appStore.commit(commitFunction, obj)
    },
    redirectToResource(){
      this.csvUrl = 'https://www.data.gouv.fr/fr/datasets/r/' + this.selectedResource
      this.$store.dispatch('apify', this.csvUrl).finally(() => {
      })
      this.resource.id = this.selectedResource
      this.setFiltersFromQueryString(this.$route.query)

      this.resources.forEach((item) => {
        if(item.id == this.resource.id) {
          this.changeLocation("changeUserLocation", "departement", item.title.split(" - ")[0], item.title.split(" - ")[1])
        }
      })

    },
    setFiltersFromQueryString (params) {
      for (const [key, value] of Object.entries(params)) {
        if (key.includes("__")){
          this.$store.commit('addFilter', {
            field: key.split('__')[0],
            value: value,
            comp: key.split('__')[1],
          })
        }
      }
    },
    changePage (page) {
      this.$store.dispatch('changePage')
    },
    sort (ctx) {
      this.$store.dispatch('sort', ctx)
    },
    apify(url) {
      this.$store.dispatch('apify', url)
    },
  },
  watch: {
  }
}

</script>

<style scoped>

.filtersTable{
    display: flex;
    padding-left: 15px;
    padding-right: 15px;
}

.filterTable{
    margin: 15px;
    padding: 5px;
    background-color: #E5EEFD;
    border-radius: 15px;

}

</style>