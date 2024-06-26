<template>
  <!-- url field if no url provided -->
  <div>
    <header-apps
      :formHref="formHref()"
      appName="Explorateur de données"
      appLink="/tableau"
      :displayBanner="true"
    ></header-apps>
  <infos-resource></infos-resource>
  <div class="fr-mt-4w fr-container" v-if="!csvUrl">
    <h1 style="width: 100%; text-align: center;">Explorer facilement les données tabulaires <br/>présentes sur data.gouv.fr</h1>
    <p style="width: 100%; text-align: center;">A ce stade, seuls les fichiers tabulaires de moins <b>de 100Mo</b> sont disponibles.</p>

    <form class="fr-mt-4w">
      <label class="fr-label" for="text-input-text"><b>RECHERCHER UN FICHIER DU CATALOGUE DATA.GOUV.FR</b>
        <span class="fr-hint-text">Entrez des mots clés pour avoir des suggestions</span>
      </label>
      <input class="fr-input fr-mb-2w" type="text" v-model="searchWordsDataset" id="text-input-text" name="text-input-text" placeholder="exemple: élections" />
      <div class="fr-grid-row fr-grid-row--center">
      </div>
    </form>

    <div v-for="item in results" class="results" v-bind:key="item.resource_id">
      <div class="result-boxes">
        <div>
          <img :src="item.logo" width="100" />
        </div>
        <div>
          <b>{{ item.dataset_title  }}</b>
          <br />
          Fichier : <b>{{ item.resource_title }}</b>
        </div>
        <div class="result-box">
            <button class="fr-btn fr-btn--icon-left fr-icon-test-tube-line" @click="goto(item)">Explorer</button>
        </div>
      </div>
    </div>

  
    <br /><br />
    <h2>Quelques exemples</h2>
    <p>Si vous ne savez pas par quoi commencer à explorer, nous vous proposons ci-dessous une sélection de quelques jeux de données.</p>
    <CardLink v-for="item in listResources" :key="item.resource_id" :did="item.dataset_id" :rid="item.resource_id"></CardLink>
    <br /><br />
  </div>
  <footer-apps v-if="!csvUrl" scrollable="scrollable" display="display"></footer-apps>

  </div>

</template>

<script>
import HeaderApps from '@/views/HeaderApps.vue'
import Table from '@/components/Table'
import Loader from '@/components/Loader'
import CardLink from '@/components/CardLink'
import HeaderApp from '@/views/HeaderApp'
import dataGouvUrlApi from '@/config'
import FooterApps from './FooterApps.vue'


export default {
  name: 'ExploreTableView',
  components: {Table, Loader, CardLink, HeaderApps, FooterApps},
  metaInfo: {
    title: "Explorateur de données tabulaires",
    meta: [
      {
        name: "description",
        content: "Explorer et analyser plus facilement les jeux de données référencées sur data.gouv.fr",
      },
      // Ajoutez d'autres balises meta si nécessaire
    ],
  },
  data() {
    return {
      results: [],
      search: null,
      searchWordsDataset: null,
      csvUrl: '',
      objResource: '',
      listResources: [
        {
          'dataset_id': '6311c164ebfb165ddc828ded',
          'resource_id': '1c5075ec-7ce1-49cb-ab89-94f507812daf',
        },
        {
          'dataset_id': '64265b673eb38d94e6538672',
          'resource_id': 'df2cbcb3-da0a-4265-a24e-c36f2c787db2'
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
      if(url.includes('data.gouv.fr')){
        var urlProps = url.split('/')
        let rid = urlProps[urlProps.length - 1]
        let domaineName = urlProps[2]
        fetch(('https://'+domaineName+'/api/2/datasets/resources/' + rid + '/'))
        .then((response) => {
            return response.json()
        })
        .then((data) => {
          this.csvUrl = data.resource.url
        })
        .catch((err) => {
          this.csvUrl = url
        })
      } else {
        this.csvUrl = url  
      }
    }
  },
  methods: {
    formHref() {
      return "https://tally.so/r/nr5BML";
    },
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
    goto(item) {
      window.location.href = window.location.origin + '/' + this.$route.params.lang + '/datasets/' + item.dataset_id + "/#/resources/" + item.resource_id
    },
  },
  watch: {
    csvUrl (value) {
      if(value){ document.querySelectorAll('body')[0].style.overflow = 'hidden' }
      if (!value) return
      this.$store.dispatch('apify', this.csvUrl).finally(() => {
      })
    },
    searchWordsDataset (value) {
      this.search = value;

      let timer = setTimeout(() => {
          if (this.search === value) {
            fetch("https://www.data.gouv.fr/api/" + "2/datasets/search/?q=" + value).then((response) => {
                return response.json()
            })
            .then((data) => {
              let arr = []
              if (data["data"].length > 0) {
                data["data"].forEach((item) => {
                  fetch(item["resources"].href).then((response2) => {
                    return response2.json()
                  })
                  .then((data2) => {
                    if (data2["data"].length > 0 && arr.length < 10) {
                      data2["data"].forEach((item2) => {
                        if (item2.extras && item2.extras["analysis:parsing:finished_at"]) {
                          let obj = {}
                          obj["dataset_id"] = item.id
                          obj["dataset_title"] = item.title
                          obj["resource_id"] = item2.id
                          obj["resource_title"] = item2.title
                          if (!obj["resource_title"] || obj["resource_title"] == ""){
                            obj["resource_title"] = "Sans titre"
                          }
                          obj["resource_url"] = item2.latest
                          if(item.organization) {
                            obj["logo"] = item.organization.logo
                          } else {
                            obj["logo"] = null
                          }

                          if (arr.length < 10) {
                            arr.push(obj)
                          }
                        }
                      })
                    }
                  });
                  
                });
                this.results = arr
              }
            });
          }
      }, 1000)
    }
  }
}
</script>

<style scoped>
.results {
  border: 1px solid #ebebeb;
  padding: 15px;
  margin-bottom: 10px;
}

.result-boxes {
  display: flex;
  cursor: pointer;
}

.result-box {
  margin-left: auto;
  padding-left: 20px;
}
</style>