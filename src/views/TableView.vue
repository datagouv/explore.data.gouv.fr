<template>
    <div>
        <b-alert variant="danger" :show="hasError">{{ error }}</b-alert>
        <b-table v-if="rows.length" hover small :items="rows" :fields="fields"></b-table>
    </div>
</template>

<script>
import {csvapiUrl} from '../config'

export default {
    name: 'TableView',
    components: {},
    data() {
      return {
          loader: this.$loading.show(),
          rows: [],
          columns: [],
          error: undefined,
          hasError: false,
      }
    },
    created() {
        if (!this.csvUrl) {
            return this.showError({
                body: {
                    error: 'No url provided.'
                }
            })
        }
        this.apify(this.csvUrl)
    },
    computed: {
        csvUrl() {
            const params = new URLSearchParams(document.location.search);
            return params.get('url');
        },
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
        apify(url) {
            const apiUrl = new URL(csvapiUrl);
            apiUrl.pathname = '/apify'
            apiUrl.searchParams.set('url', url)
            this.$http.get(apiUrl.toString()).then(res => {
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
