<template>
  <div style="background-color: #E7EEFE">
     <h2 class="fr-pl-2w fr-py-1v fr-py-m-2w fr-m-0 infosdgv">
      <span>
        Jeux de données
        <a 
          :href="getDataGouvUrl('datasets/'+dgvInfos.dataset_id)"
          class="text-label-blue-cumulus"
          target="_blank"
        >
          {{ prune(dgvInfos.dataset_title) }}
        </a>
      </span>
      <span v-if="dgvInfos.organization_id">
        publié par 
        <a
          :href="getDataGouvUrl('organizations/'+dgvInfos.organization_id)"
          class="text-label-blue-cumulus"
          target="_blank"
        >
          {{ prune(dgvInfos.organization_name) }}
        </a>
      </span>
    </h2>
  </div>
</template>

<script>
import storeTabular from '@/apps/tabular/store/storeTabular'

export default {
  name: 'DgvInfos',
  components: {},
  store: storeTabular,
  data() {
    return {
    }
  },
  mounted() {
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
      return process.env.VUE_APP_DATAGOUV_URL + "/fr/" + path
    },
    prune(string){
      var lim = Math.round(window.innerWidth/15)
      if(string){
        var pruned
        if(string.length<lim){
          pruned = string
        }else{
          pruned = string.substring(0,lim)+"..."
        }
        return pruned
      }
    }
  },
  watch: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.infosdgv {
  font-size: 0.8rem;
  font-weight: normal;
  line-height: 1.4;
}

.infosdgv a{
  font-weight: 700;
  background-image: none;
}

@media (max-width: 48em){
  .infosdgv span{
    width: 100%;
    display: block;
  }
}

</style>
