<template>
  <div>
    <!-- url field if no url provided -->
    <b-form v-if="!csvUrl && !hasUploadedFile" class="m-4">
      <b-input
        class="mb-2 mt-2"
        placeholder="URL du fichier à visualiser (CSV ou XLS)"
        v-model="csvUrlFieldValue"
      ></b-input>
      <b-button variant="primary" @click="redirect">Lancer la conversion 🚀</b-button>
      <file-pond class="mb-2 mt-2" :server="uploadServer" accepted-file-types="text/csv" label-idle="Glisser un fichier CSV ici pour démarrer la conversion"></file-pond>
    </b-form>
    <!-- error block -->
    <Error v-if="hasError" :error="error"></Error>
    <!-- table block, fed by store -->
    <Table v-if="(csvUrl || hasUploadedFile) && !hasError"></Table>
  </div>
</template>

<script>
import Table from '@/components/Table'
import Error from '@/components/Error'

import vueFilePond from 'vue-filepond'
import 'filepond/dist/filepond.min.css'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'

import {csvapiUrl} from '@/config'

const FilePond = vueFilePond(FilePondPluginFileValidateType)

export default {
  name: 'TableView',
  components: {Table, Error, FilePond},
  data() {
    return {
      csvUrl: '',
      endpoint: '',
      csvUrlFieldValue: '',
      hasUploadedFile: false,
      uploadServer: {
        process: {
          url: `${csvapiUrl}/upload`,
          onload: this.onUploadSuccess,
          onerror: this.onUploadError
        },
        // fetch: null,
        // revert: null,
        // restore: null,
        // load: null
      }
    }
  },
  computed: {
    error () {
      return this.$store.state.error
    },
    hasError () {
      return this.$store.state.hasError
    }
  },
  created() {
    const params = new URLSearchParams(document.location.search)
    // set filters from query string (before setting url and fetching data)
    this.setFiltersFromQueryString(params)
    const url = params.get('url')
    const endpoint = params.get('endpoint')
    if (url) {
      this.csvUrl = url
    } else if (endpoint) {
      this.endpoint = endpoint
    }
  },
  methods: {
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
    apify (url) {
      this.$store.dispatch('apify', url)
    },
    redirect () {
      this.csvUrl = this.csvUrlFieldValue
      history.pushState(null, '', `/?url=${this.csvUrl}`)
    },
    onUploadSuccess (res) {
      res = JSON.parse(res)
      this.endpoint = res.endpoint
      history.pushState(null, '', `/?endpoint=${this.endpoint}`)
    },
    onUploadError (error) {
      error = JSON.parse(error)
      this.$store.dispatch('handleUploadError', error)
    }
  },
  watch: {
    csvUrl (value) {
      if (!value) return
      const loader = this.$loading.show()
      this.$store.dispatch('apify', this.csvUrl).finally(() => {
        loader.hide()
      })
    },
    endpoint (value) {
      if (!value) return
      this.$store.commit('setDataEndpoint', value)
      const loader = this.$loading.show()
      this.$store.dispatch('getData').finally(() => {
        loader.hide()
        this.hasUploadedFile = true
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
