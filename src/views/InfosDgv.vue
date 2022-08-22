<template>
  <div>
    <h2 v-if="display" class="fr-pl-2w fr-py-2w fr-m-0 infosdgv">
      Exploration du jeu de données 
      <a 
        :href="getDataGouvUrl('datasets/'+dgvInfos.dataset_id)"
        class="text-label-blue-cumulus"
        target="_blank"
      >
        {{ dgvInfos.dataset_title }}
      </a>
      publié par 
      <a
        :href="getDataGouvUrl('organizations/'+dgvInfos.organization_id)"
        class="text-label-blue-cumulus"
        target="_blank"
      >
        {{ dgvInfos.organization_name}}
      </a>
    </h2>
  </div>
</template>


<script>
import {getDataGouvUrl} from '../config'
export default {
  name: 'DgvInfos',
  components: {},
  data() {
    return {
        display: false
    }
  },
  mounted() {
    let uri = window.location.search.substring(1); 
    let params = new URLSearchParams(uri);
    let obj = {}
    let url = params.get('url')
    if (url && url.includes('data.gouv.fr')) {
        let rid = url.split('/')[url.split('/').length - 1]
        fetch(('https://www.data.gouv.fr/api/2/datasets/resources/' + rid))
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            obj.resource = data.resource
            obj.dataset_id = data.dataset_id
            fetch(('https://www.data.gouv.fr/api/1/datasets/' + data.dataset_id))
            .then((response) => {
                return response.json()
            })
            .then((data2) => {
                obj.dataset_title = data2.title
                if (data2.organization) {
                    obj.organization_id = data2.organization.id
                    obj.organization_name = data2.organization.name
                }
                let obj2 = []
                data2.resources.forEach((res) => {
                  if(res.id != rid) {
                    obj2.push({ resource_id: res.id, resource_title: res.title, preview_url: res.preview_url })
                  }
                });
                obj.other_resources = obj2
                this.$store.commit('setDgvInfos', obj)
            })
            .catch((err) => {
                // Do something for an error here
            })
        })
        .catch((err) => {
            // Do something for an error here
        })
        this.display = true
    }
  },
  computed: {
    dgvInfos () {
      return this.$store.state.dgv_infos
    },
  },
  created() {
  },
  methods: {
    /**
    * @param {string} path
    */
    getDataGouvUrl(path){
      return getDataGouvUrl(path)
    }
  },
  watch: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.infosdgv {
  font-size: 1rem;
  font-weight: normal;
  line-height: 1;
  background-color: #F3F3F3;
  border-bottom: 2px solid #ebebeb;
}
</style>
