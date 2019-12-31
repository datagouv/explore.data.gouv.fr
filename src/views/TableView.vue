<template>
    <div>
        <b-form v-if="!csvUrl" class="m-4">
            <b-input
                class="mb-2 mt-2"
                placeholder="URL du fichier à visualiser (CSV ou XLS)"
                v-model="csvUrlFieldValue"
            ></b-input>
            <b-button variant="primary" @click="redirect">Lancer la conversion 🚀</b-button>
        </b-form>
        <div v-if="hasError" class="m-4">
            <b-card
                header-bg-variant="danger"
                border-variant="danger"
                header="🤕 Nous n'avons pas pu convertir ce fichier"
                header-border-variant="danger"
                header-text-variant="white"
                align="center"
            >
                <b-card-text>
                    <dl>
                        <dt>Détails de l'erreur</dt>
                        <dd>
                            {{ error.error }}
                            <span v-if="error.details"> {{ error.details }}</span>
                        </dd>
                        <dt v-if="error.id">Identifiant de l'erreur</dt>
                        <dd v-if="error.id">{{ error.id }}</dd>
                    </dl>
                    <b-button @click="openIssue" variant="outline-danger" size="lg">Signaler cette erreur sur Github</b-button>
                </b-card-text>
            </b-card>
        </div>
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
            this.error = {
                error: res.body.error,
                details: res.body.details,
                id: res.body.error_id,
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
        },
        openIssue() {
            const title = `Impossible de convertir le fichier`
            const body = `
Impossible de convertir le fichier situé ici : ${this.csvUrl}%0A%0A
${this.error.error} ${this.error.details || ''}%0A%0A
Identifiant : ${this.error.id || ''}
`
            const githubLink = `https://github.com/etalab/csvapi/issues/new?labels=live-feedback&title=${title}&body=${body}`
            window.open(githubLink, '_blank')
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
