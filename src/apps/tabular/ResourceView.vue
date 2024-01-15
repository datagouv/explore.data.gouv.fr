<template>
    <div>
        <header-apps
            :formHref="formHref()"
            appName="Explorateur de données"
            appLink="/test"
        ></header-apps>
        <infos-dgv></infos-dgv>
        <infos-resources></infos-resources>
        <Table v-if="dgvInfos && dgvInfos.resource" scrollable="scrollable" display="display"></Table>
    </div>
</template>

<script>
import HeaderApps from '@/views/HeaderApps.vue'
import InfosDgv from '@/apps/tabular/views/InfosDgv.vue'
import InfosResources from '@/apps/tabular/views/InfosResources.vue'
import Table from '@/apps/tabular/views/Table.vue'
import storeTabular from './store/storeTabular'

export default {
    name: 'DatasetView',
    components: {HeaderApps, InfosDgv, InfosResources, Table},
    store: storeTabular,
    data() {
        return {
        }
    },
    props:{
    },
    computed: {
      dgvInfos() {
        return this.$store.state.dgv_infos
      },
    },
    methods: {
        formHref() {
            return "https://tally.so/r/nr5BML";
        },
    },
    mounted () {
    },
    watch: {
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