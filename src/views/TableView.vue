<template>
  <!-- url field if no url provided -->
  <div class="fr-mt-4w fr-container" v-if="!csvUrl">
    <h2>Bienvenue sur le prototype d'exploration des données de data.gouv.fr</h2>
    <p>Ce prototype vise à permettre d’explorer plus facilement les données référencées sur data.gouv.fr.<br />
      Sélectionnez un fichier qui vous intéresse sur data.gouv.fr et collez le lien dans la barre ci-dessous pour l’explorer.</p>
    <div class="fr-callout">
      <h3 class="fr-callout__title">Précautions d'usages</h3>
      <p class="fr-callout__text">
        Si l'explorateur est utilisé sur un jeu de données pour la première fois, le chargement peut prendre un certain temps.
        Ce prototype ne permet pas d’explorer les fichiers de plus de 100 Mo.
      </p>
    </div>
    <form class="fr-mt-4w">
      <label class="fr-label" for="text-input-text">URL du fichier à visualiser au format CSV ou XLS
        <span class="fr-hint-text">Il s’agit du lien vers un fichier et non d’une page de jeu de données</span>
      </label>
      <input class="fr-input fr-mb-2w" type="text" v-model="csvUrlFieldValue" id="text-input-text" name="text-input-text" />
      <div class="fr-grid-row fr-grid-row--center">
        <button class="fr-btn fr-btn--icon-left fr-icon-test-tube-line" @click="redirect">
          Explorer les données
        </button>
      </div>
    </form>
  </div>
  <!-- error block -->
  <Error v-else-if="hasError" :error="error"></Error>
  <!-- loader block -->
  <Loader v-else-if="!hasLoaded"></Loader>
  <!-- table block, fed by store -->
  <Table class="fr-pt-0" v-else-if="csvUrl && !hasError"></Table>
</template>

<script>
import Table from '@/components/Table'
import Error from '@/components/Error'
import Loader from '@/components/Loader'

export default {
  name: 'TableView',
  components: {Table, Error, Loader},
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
    },
    hasLoaded () {
      return this.$store.state.hasLoaded
    },
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
      this.$store.dispatch('apify', this.csvUrl).finally(() => {
      })
    }
  }
}
</script>
