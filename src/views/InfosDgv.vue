<template>
  <div>
    <div v-if="display" class="infosdgv">
        Exploration du jeu de données 
        <span @click="goto('datasets/'+dgvInfos.dataset_id)" class="titles">{{ dgvInfos.dataset_title }}  <img src="../static/images/exit-top-right.png" width="14" /></span>
        &nbsp;
        publié par 
        <span @click="goto('organizations/'+dgvInfos.organization_id)" class="titles">{{ dgvInfos.organization_name}}  <img src="../static/images/exit-top-right.png" width="14" /></span>
    </div>
  </div>
</template>


<script>
import {openDataGouv} from '../config'
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
                data2.resources.forEach((/** @type {{ id: string; title: string; }} */ res) => {
                  if(res.id != rid) {
                    obj2.push({ resource_id: res.id, resource_title: res.title})
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
    goto(path){
      openDataGouv(path)
    }
  },
  watch: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.titles{
    color: #37529A;
    font-family: Marianne;
    font-size: 15px;
    margin-left: auto;
    line-height: 40px;
}

.infosdgv{
  line-height: 50px;
  background-color: #F3F3F3;
  border-bottom: 2px solid #ebebeb;
  font-size: 15px;
  padding-left: 15px;
}
.titles:hover{
  cursor: pointer;
}

</style>
