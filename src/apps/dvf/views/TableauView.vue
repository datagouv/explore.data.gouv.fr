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
    })
  },
  methods: {
    redirectToResource(){
      this.csvUrl = 'https://www.data.gouv.fr/api/1/datasets/r/' + this.selectedResource
      this.$store.dispatch('apify', this.csvUrl).finally(() => {
      })
      this.resource.id = this.selectedResource
    },
    setFiltersFromQueryString (params) {
      [...params.entries()].filter(([k, v]) => {
        return k.indexOf('__') !== -1 && k.indexOf('_') !== 0
      }).forEach(([k, v]) => {
        this.$store.commit('addFilter', {
          field: k.split('__')[0],
          value: v,
          comp: k.split('__')[1],
        })
      })
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