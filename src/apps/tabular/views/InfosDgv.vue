<template>
  <div style="background-color: #3558A2; padding-bottom: 10px;">
     <div class="fr-pl-5v fr-py-1v fr-py-m-2w fr-m-0 infosdgv">        
      <div
        class="links-infosdgv"
        @click="getDataGouvUrl('datasets/'+dgvInfos.dataset_id)"
      >
        <span class="icon-dgvinfos">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.66674 7.28557C2.66674 7.4411 2.88626 7.71155 3.39553 7.97689C4.05438 8.32019 4.98901 8.52618 6.00007 8.52618C7.01112 8.52618 7.94574 8.32019 8.60459 7.97689C9.11388 7.71155 9.3334 7.4411 9.3334 7.28557V6.20809C8.54769 6.714 7.3464 7.03745 6.00007 7.03745C4.65375 7.03745 3.45243 6.714 2.66674 6.20809V7.28557ZM9.3334 8.68929C8.54769 9.19521 7.3464 9.51866 6.00007 9.51866C4.65375 9.51866 3.45243 9.19521 2.66674 8.68929V9.76678C2.66674 9.9223 2.88626 10.1928 3.39553 10.4581C4.05438 10.8014 4.98901 11.0074 6.00007 11.0074C7.01112 11.0074 7.94574 10.8014 8.60459 10.4581C9.11388 10.1928 9.3334 9.9223 9.3334 9.76678V8.68929ZM1.71436 9.76678V4.80437C1.71436 3.57107 3.63314 2.57129 6.00007 2.57129C8.36702 2.57129 10.2858 3.57107 10.2858 4.80437V9.76678C10.2858 11.0001 8.36702 11.9999 6.00007 11.9999C3.63314 11.9999 1.71436 11.0001 1.71436 9.76678ZM6.00007 6.04497C7.01112 6.04497 7.94574 5.83899 8.60459 5.4957C9.11388 5.23035 9.3334 4.9599 9.3334 4.80437C9.3334 4.64884 9.11388 4.3784 8.60459 4.11304C7.94574 3.76975 7.01112 3.56377 6.00007 3.56377C4.98901 3.56377 4.05438 3.76975 3.39553 4.11304C2.88626 4.3784 2.66674 4.64884 2.66674 4.80437C2.66674 4.9599 2.88626 5.23035 3.39553 5.4957C4.05438 5.83899 4.98901 6.04497 6.00007 6.04497Z" fill="white"/>
          </svg>
        </span>
        <span class="text-dgvinfos">{{ prune(dgvInfos.dataset_title) }}</span>
      </div>
      <div class="sep-dgvinfos">-</div>
      <div
        v-if="dgvInfos.organization_id"
        class="links-infosdgv"
        @click="getDataGouvUrl('organizations/'+dgvInfos.organization_id)"
      >
        <span class="icon-dgvinfos">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 9H10V10H0V9ZM1 5H2V8.5H1V5ZM3.5 5H4.5V8.5H3.5V5ZM5.5 5H6.5V8.5H5.5V5ZM8 5H9V8.5H8V5ZM0 2.5L5 0L10 2.5V4.5H0V2.5ZM1 3.11803V3.5H9V3.11803L5 1.11804L1 3.11803ZM5 3C4.72385 3 4.5 2.77614 4.5 2.5C4.5 2.22386 4.72385 2 5 2C5.27615 2 5.5 2.22386 5.5 2.5C5.5 2.77614 5.27615 3 5 3Z" fill="white"/>
          </svg>
        </span>
        <span class="text-dgvinfos">{{ prune(dgvInfos.organization_name) }}</span>
      </div>
    </div>
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
      window.open(process.env.VUE_APP_DATAGOUV_URL + "/fr/" + path, "_blank")
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
  color: white;
}

.links-infosdgv{
  background-image: none;
  color: white;
}

.icon-dgvinfos{
  margin-right: 5px;
}

.links-infosdgv:hover{
  cursor: pointer;
  font-weight: bold;
}

.text-dgvinfos{
  text-decoration: underline;
  font-style: italic;
  font-size: 11px;
}


@media (min-width: 48em){
  .infosdgv {
    display: flex;
  }
}

.sep-dgvinfos{
  margin-left: 10px;
  margin-right: 10px;
}

@media (max-width: 48em){
  .sep-dgvinfos{
    display: none;
  }
}

</style>
