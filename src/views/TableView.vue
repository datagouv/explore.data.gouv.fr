<template>
  <div>
    <!-- url field if no url provided -->
    <b-form v-if="!csvUrl" class="m-4">
      <b-input
        class="mb-2 mt-2"
        placeholder="URL du fichier à visualiser (CSV ou XLS)"
        v-model="csvUrlFieldValue"
      ></b-input>
      <b-button variant="primary" @click="redirect">Lancer la conversion 🚀</b-button>
    </b-form>
    <!-- error block -->
    <Error v-if="hasError" :error="error"></Error>
    <!-- table block, fed by store -->
    <Table class="table" v-if="csvUrl && !hasError"></Table>
  </div>
</template>

<script>
import Table from '@/components/Table'
import Error from '@/components/Error'

export default {
  name: 'TableView',
  components: {Table, Error},
  data() {
    return {
      csvUrl: '',
      csvUrlFieldValue: ''
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
    if (url) {
      this.csvUrl = url
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
    apify(url) {
      this.$store.dispatch('apify', url)
    },
    redirect() {
      this.csvUrl = this.csvUrlFieldValue
      history.pushState(null, '', `/?url=${this.csvUrl}`)
    }
  },
  watch: {
    csvUrl (value) {
      if (!value) return
      const loader = this.$loading.show()
      this.$store.dispatch('apify', this.csvUrl).finally(() => {
        loader.hide()
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.table{
  width: 100%;
  overflow-x: auto;
  font-size: 15px;
}

</style>
