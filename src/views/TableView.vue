<template>
    <div>
        <b-form v-if="!csvUrl" class="m-4">
            <b-input
                class="mb-2 mt-2"
                placeholder="URL of the CSV to apify"
                v-model="csvUrlFieldValue"
            ></b-input>
            <b-button variant="primary" @click="redirect">Go 🚀</b-button>
        </b-form>
        <b-alert variant="danger" :show="hasError">{{ error }}</b-alert>
        <b-table v-if="rows.length" hover small :items="rows" :fields="fields" :no-local-sorting="true" @sort-changed="sort"></b-table>
        <b-pagination v-if="rows.length" align="center" size="lg" :total-rows="totalRows" v-model="page" :per-page="pageSize" @input="changePage"></b-pagination>
    </div>
</template>

<script>
import {csvapiUrl, pageSize} from '../config'

export default {
    name: 'TableView',
    components: {},
    data() {
      return {
          sortBy: undefined,
          sortDesc: undefined,
          pageSize,
          dataEndpoint: undefined,
          page: 1,
          totalRows: 0,
          loader: undefined,
          rows: [],
          columns: [],
          error: undefined,
          hasError: false,
          csvUrl: '',
          csvUrlFieldValue: ''
      }
    },
    computed: {
        fields() {
            return this.columns.map(c => {
                return {
                    key: c,
                    label: c,
                    sortable: true,
                }
            })
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
        showError(res) {
            console.error(res)
            this.hasError = true
            this.error = `Error: ${res.body.error}`
            if (res.body.details) {
                this.error += `(${res.body.details})`
            }
            this.loader.hide()
        },
        changePage(page) {
            this.loader = this.$loading.show()
            this.getData()
        },
        sort(ctx) {
            this.loader = this.$loading.show()
            this.sortBy = ctx.sortBy
            this.sortDesc = ctx.sortDesc
            this.getData()
        },
        getData() {
            const offset = this.pageSize * (this.page - 1)
            const dataUrl = new URL(this.dataEndpoint)
            dataUrl.searchParams.set('_shape', 'objects')
            dataUrl.searchParams.set('_rowid', 'hide')
            dataUrl.searchParams.set('_size', this.pageSize)
            dataUrl.searchParams.set('_offset', offset)
            if (this.sortBy) {
                const param = this.sortDesc ? '_sort_desc' : '_sort'
                dataUrl.searchParams.set(param, this.sortBy)
            }
            this.$http.get(dataUrl.toString()).then(res => {
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
            this.loader = this.$loading.show()
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
        },
        redirect() {
            const csvUrl = this.csvUrlFieldValue
            document.location = `${document.location.protocol}//${document.location.host}/?url=${csvUrl}`
        }
    },
    watch: {
        csvUrl(value) {
            if (!value) return
            this.apify(this.csvUrl)
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
