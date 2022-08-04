<template>
  <div>
    <div v-if="dgvInfos.resource" class="infosRes">
     <div>
      <select class="selectResource" v-model="dgvInfos.resource.id">
        <option v-bind:key="dgvInfos.resource.id" v-bind:value="dgvInfos.resource.id">
          {{ dgvInfos.resource.title }}
        </option>
        <option v-for="option in dgvInfos.other_resources" v-bind:key="option.resource_id" v-bind:value="option.resource_id">
          {{ option.resource_title }}
        </option>
      </select>
      <span class="compInfos">
        &nbsp;Mis à jour le date {{ toFrDate(dgvInfos.resource.last_modified) }}
        &nbsp;&nbsp;{{ dgvInfos.resource.format }} ({{ bytesToSize(dgvInfos.resource.filesize) }})
        &nbsp;&nbsp;{{ dgvInfos.resource.metrics.views }} téléchargements
      </span>
     </div>
     <div class="actionCalls">
      <span class="reinitFilters">
        <img src="../static/images/marque-x.png" width="15" /> Réinitialiser les filtres
      </span>
      &nbsp;
      <span>
        <input class="globalSearch" v-model="globalSearch" placeholder="Rechercher">
      </span>
     </div>
    </div>
  </div>
</template>


<script>

export default {
  name: 'DgvInfos',
  components: {},
  data() {
    return {
      globalSearch: ''
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
    toFrDate(date){
      return date.substr(8,2) + "/" + date.substr(5,2) + "/" + date.substr(0,4)
    },
    bytesToSize(bytes) {
      var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      if (bytes == 0) return '0 Byte';
      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }
  },
  watch: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.infosRes{
  line-height: 70px;
  border-bottom: 1px solid #ebebeb;
  font-size: 15px;
  padding-left: 15px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.selectResource{
  line-height: 100%;
  background-color: #F3F3F3;
  padding: 10px;
  font-size: 13px;
  border: none;
  border-bottom: 2px solid black;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  font-family: Marianne-Bold;
}

.compInfos{
  font-size: 13px;
  color: #898989;
}

.actionCalls{
    margin-left: auto;
}

.reinitFilters{
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  border: 1px solid #37529A;
  color: #37529A;
  border-radius: 30px;
  font-size: 13px;
}

.globalSearch{
  border: none;
  border-bottom: 1px solid black;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  padding: 5px;
  height: 40px;
  margin-right: 10px;
  background-color: #F3F3F3;
}


</style>
