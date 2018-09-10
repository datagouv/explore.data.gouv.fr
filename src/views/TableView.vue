<template>
    <div>
        <b-alert variant="danger" :show="hasError">{{ error }}</b-alert>
        <b-table v-if="rows.length" hover small :items="rows" :fields="fields"></b-table>
        <b-pagination align="center" size="lg" :total-rows="totalRows" v-model="page" :per-page="pageSize" @input="changePage"></b-pagination>
    </div>
</template>

<script>
import {csvapiUrl, pageSize} from '../config'

export default {
    name: 'TableView',
    components: {},
    data() {
      return {
          pageSize: pageSize,
          dataEndpoint: undefined,
          page: 1,
          totalRows: 0,
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
        changePage(page) {
            this.loader = this.$loading.show()
            this.getData()
        },
        getData() {
            const offset = this.pageSize * (this.page - 1);
            this.$http.get(`${this.dataEndpoint}?_shape=objects&_rowid=hide&_size=${this.pageSize}&_offset=${offset}`).then(res => {
                if (res.body.ok) {
                    this.rows = res.body.rows
                    if (!this.columns.length) {
                        this.columns = res.body.columns
                    }
                    if (!this.totalRows) {
                        this.totalRows = res.body.total
                    }
                    this.loader.hide()
                } else {
                    this.showError(res)
                }
            }).catch(this.showError)
        },
        apify(url) {
            const apiUrl = new URL(csvapiUrl)
            apiUrl.pathname = '/apify'
            apiUrl.searchParams.set('url', url)
            this.$http.get(apiUrl.toString()).then(res => {
                if (res.body.ok && res.body.endpoint) {
                    this.dataEndpoint = res.body.endpoint
                    this.getData()
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
