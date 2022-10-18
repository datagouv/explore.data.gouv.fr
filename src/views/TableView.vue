<template>
  <!-- url field if no url provided -->
  <div>
  <header-app></header-app>
  <infos-dgv></infos-dgv>
  <infos-resource></infos-resource>
  <div class="fr-mt-4w fr-container" v-if="!csvUrl">
    <h2>Bienvenue sur le prototype d'exploration des données de data.gouv.fr</h2>
    <p>Ce prototype vise à permettre d’explorer plus facilement les données référencées sur data.gouv.fr.<br />
      Sélectionnez un fichier de moins de 100Mo qui vous intéresse sur data.gouv.fr et collez le lien dans la barre ci-dessous pour l’explorer.</p>
    <!-- <div class="fr-callout">
      <h3 class="fr-callout__title">Précautions d'usages</h3>
      <p class="fr-callout__text">
        Si l'explorateur est utilisé sur un jeu de données pour la première fois, le chargement peut prendre un certain temps.
        Ce prototype ne permet pas d’explorer les fichiers de plus de 100 Mo.
      </p>
    </div> -->
    <form class="fr-mt-4w">
      <label class="fr-label" for="text-input-text">URL du fichier à visualiser au format CSV
        <span class="fr-hint-text">Il s’agit du lien vers un fichier et non d’une page de jeu de données</span>
      </label>
      <input class="fr-input fr-mb-2w" type="text" v-model="csvUrlFieldValue" id="text-input-text" name="text-input-text" />
      <div class="fr-grid-row fr-grid-row--center">
        <button class="fr-btn fr-btn--icon-left fr-icon-test-tube-line" @click="redirect">
          Explorer les données
        </button>
      </div>
    </form>
    <br /><br />
    <p>Si vous ne savez pas par quoi commencer à explorer, nous vous proposons ci-dessous une sélection de quelques jeux de données.</p>
    <CardLink v-for="item in listResources" :key="item.resource_id" :did="item.dataset_id" :rid="item.resource_id"></CardLink>
    <br /><br />
  </div>
  <!-- error block -->
  <Error v-else-if="hasError" :error="error" :csvUrl="csvUrl"></Error>
  <!-- loader block -->
  <Loader v-else-if="!hasLoaded"></Loader>
  <!-- table block, fed by store -->
  <Table class="fr-pt-0" v-else-if="csvUrl && !hasError"></Table>
  </div>
</template>

<script>
import Table from '@/components/Table'
import Error from '@/components/Error'
import Loader from '@/components/Loader'
import CardLink from '@/components/CardLink'
import HeaderApp from '@/views/HeaderApp'
import InfosDgv from '@/views/InfosDgv'
import InfosResource from '@/views/InfosResource'

export default {
  name: 'TableView',
  components: {Table, Error, Loader, CardLink, HeaderApp, InfosDgv, InfosResource},
  data() {
    return {
      csvUrl: '',
      csvUrlFieldValue: '',
      listResources: [
        {
          'dataset_id': '6311c164ebfb165ddc828ded',
          'resource_id': '1c5075ec-7ce1-49cb-ab89-94f507812daf',
        },
        {
          'dataset_id': '60190d00a7273a8100dd4d38',
          'resource_id': '5c4e1452-3850-4b59-b11c-3dd51d7fb8b5'
        },
        {
          'dataset_id': '5448d3e0c751df01f85d0572',
          'resource_id': '8d9398ae-3037-48b2-be19-412c24561fbb',
        },
      ]
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
      window.location.href = window.location.origin + '/?url=' + this.csvUrl
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
