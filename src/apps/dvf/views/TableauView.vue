<template>
    <div class="mainView" id="tableauView">
        Choisissez les données :
        <!-- <div v-bind:key="res" v-for="res in resources">{{ res.title }}</div> -->
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
      selectedResource: '963db3d9-670e-4910-b660-6451e71efde6',
      csvUrl: 'https://www.data.gouv.fr/fr/datasets/r/963db3d9-670e-4910-b660-6451e71efde6',
      csvUrlFieldValue: '',
      resources: null,
      resource: {
        id: '963db3d9-670e-4910-b660-6451e71efde6',
      }
    }
  },
  computed: {
    
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
            this.selectedResource = item["id"]
            if (this.$route.query.level == "commune"){
              let code = this.$route.query.code
              while(code.charAt(0) === '0')
              {
                code = code.substring(1);
              }
              this.$router.push({path: this.$route.path, query: { ...this.$route.query, code_commune__exact: code }})
            }
            if (this.$route.query.level == "section" || this.$route.query.level == "parcelle"){
              let code = this.$route.query.code
              this.$router.push({path: this.$route.path, query: { ...this.$route.query, id_parcelle__contains: code }})
            }
            if (this.$route.query.filtre && this.$route.query.filtre != "tous"){
              this.$router.push({path: this.$route.path, query: { ...this.$route.query, type_local__contains: this.$route.query.filtre }})
            }
            this.redirectToResource()
          }
        })
      } else {
        if (this.$route.query.filtre && this.$route.query.filtre != "tous"){
          this.$router.push({path: this.$route.path, query: { ...this.$route.query, type_local__contains: this.$route.query.filtre }})
        }
        this.redirectToResource()
      }
    })
  },
  methods: {
    redirectToResource(){
      this.csvUrl = 'https://www.data.gouv.fr/api/1/datasets/r/' + this.selectedResource
      this.$store.dispatch('apify', this.csvUrl).finally(() => {
      })
      this.resource.id = this.selectedResource
      console.log(this.$route.query)
      this.coucou(this.$route.query)
      this.setFiltersFromQueryString(this.$route.query)
    },
    coucou(params){
      console.log(params)
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

</style>