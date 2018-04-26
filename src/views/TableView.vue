<template>
    <div>
        <b-alert variant="danger" :show="hasError">{{ error }}</b-alert>
        <b-table v-if="rows.length" hover small :items="rows" :fields="fields"></b-table>
    </div>
</template>

<script>
export default {
    name: 'TableView',
    components: {},
    data() {
      return {
          apiBaseUrl: process.env.VUE_APP_API_BASE_URL,
          loader: this.$loading.show(),
          csvUrl: undefined,
          rows: [],
          columns: [],
          error: undefined,
          hasError: false,
      }
    },
    created() {
        this.csvUrl = this.$route.query.url
        if (!this.csvUrl) {
            console.error('Missing url query param.')
            return
        }
        this.apify()
    },
    computed: {
        fields() {
            return this.columns.map(c => {
                return {
                    key: c,
                    label: c
                }
            })
        }
    },
    methods: {
        showError(res) {
            this.hasError = true
            this.error = `Error: ${res.body.error}`;
            if (res.body.details) {
                this.error += `(${res.body.details})`
            }
            this.loader.hide()
        },
        getData(endpoint) {
            this.$http.get(`${endpoint}?_shape=objects&_norowid=1`).then(res => {
                if (res.body.ok) {
                    this.rows = res.body.rows
                    this.columns = res.body.columns
                    this.loader.hide()
                } else {
                    this.showError(res)
                }
            }).catch(this.showError)
        },
        apify() {
            this.$http.get(`${this.apiBaseUrl}/apify?url=${this.csvUrl}`).then(res => {
                if (res.body.ok && res.body.endpoint) {
                    this.getData(res.body.endpoint)
                } else {
                    this.showError(res)
                }
            }).catch(this.showError)
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
