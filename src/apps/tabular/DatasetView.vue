<template>
    <div>
        <span v-if="dgvInfos.resource">
            <resource-view></resource-view>
        </span>
    </div>
</template>

<script>
import ResourceView from '@/apps/tabular/ResourceView.vue'
import storeTabular from './store/storeTabular'
import config from '@/config.js'

export default {
    name: 'DatasetView',
    components: {ResourceView},
    store: storeTabular,
    props:{
    },
    computed: {
        dgvInfos () {
          return this.$store.state.dgv_infos
        },
    },
    methods: {
        formHref() {
            return "https://tally.so/r/nr5BML";
        },
        setFiltersFromQueryString (params) {
          params.forEach((item) => {
            this.$store.commit("addFilter", { field: item.split("=")[0].split("__")[0], value: item.split("=")[1], comp: item.split("=")[0].split("__")[1] })
          })
        },
        retrieveInfos(did){
          let url_dgv = process.env.VUE_APP_DATAGOUV_URL
          let params_complements = null
          let obj = {}
          let rid = null
          if (this.$route.hash && this.$route.hash.startsWith("#/resources/")){
              let url_complement = this.$route.hash.replace("#/resources/", "").split("?")
              rid = url_complement[0].replace("/", "")
              if (url_complement.length > 1) {
                params_complements = this.$route.hash.replace("#/resources/", "").split("?")[1].split("&")
                this.setFiltersFromQueryString(params_complements)
              }
          }
          fetch(url_dgv + '/api/1/datasets/' + did)
              .then((response) => {
                  return response.json();
              })
              .then((data) => {
                  if (data.resources.length > 0){
                      obj.dataset_title = data.title
                      obj.resource = null
                      obj.dataset_id = data.id
                      if (data.organization) {
                          obj.organization_id = data.organization.id
                          obj.organization_name = data.organization.name
                      }

                      let obj2 = []
                      data.resources.forEach((res) => {
                          obj2.push({ resource_id: res.id, resource_title: res.title, preview_url: res.preview_url, format: res.format })
                          if (res.id == rid){
                              obj.resource = res
                          }
                          if (!rid && res.format == 'csv') {
                              obj.resource = res
                          }
                      })
                      if (obj.resource) {
                          if (params_complements) {
                            let complement = params_complements.join('&')
                            if (this.$route.hash != '#/resources/' + obj.resource.id + '?' + complement) {
                              this.$router.push({ hash: '#/resources/' + obj.resource.id + '?' + complement});
                            }
                          } else {
                            if (this.$router.hash != '#/resources/' + obj.resource.id) {
                              this.$router.push({ hash: '#/resources/' + obj.resource.id });
                            }
                          }
                      }
                      obj.other_resources = obj2
                      //this.$store.commit('setDgvInfos', obj)
                      this.$store.dispatch("manageDgvInfos", obj);
                  }
              }
          );
        }
    },
    mounted () {
        let url_dgv = process.env.VUE_APP_DATAGOUV_URL        
        if (this.$route.name == "resources") {
            fetch(url_dgv + '/api/2/datasets/resources/' + this.$route.params.id)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
              window.location.href = "/fr/datasets/" + data["dataset_id"] + "/#/resources/" + this.$route.params.id              
            })
        } else {
          this.retrieveInfos(this.$route.params.id)
        }
    }
}
</script>

<style scoped>
.subheader{
  background-color:#E6EEFE;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}

.subheader.excel{
  display: block;
}

.inforessource{
  flex-grow: 99;
}


.sticky-bar {
  z-index: 1;
  padding-top: 0.5rem!important;
  padding-bottom: 0.5rem!important;
}

.fr-text--sm, .fr-btn--sm{
  font-size: 0.8rem!important;
}

.dgvSelector{
  line-height: 0.9rem;
  max-width: 320px;
  font-size: 0.8rem;
  font-weight: 700;
}

.preventExcel{
  margin:1px 0 0 0!important;
}

.preventExcel div{
  background-color: #FBCB04;
  padding-left: 30px;
  color: #1353B5;
}

@media (max-width: 48em){
  .fr-col-auto{
    padding: 0.2rem 0.5rem 0.2rem 0.5rem!important;
  }
}

</style>