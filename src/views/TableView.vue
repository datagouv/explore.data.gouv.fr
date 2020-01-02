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
    <Table v-if="csvUrl"></Table>
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
    const url = params.get('url')
    if (url) {
      this.csvUrl = url
    }
  },
  methods: {
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
      const csvUrl = this.csvUrlFieldValue
      document.location = `${document.location.protocol}//${document.location.host}/?url=${csvUrl}`
    }
  },
  watch: {
    csvUrl (value) {
      if (!value) return
      this.$store.dispatch('apify', this.csvUrl)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
