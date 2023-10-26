<template>
  <div class="fr-table">
    <table ref="table" @scroll="handleScroll($event)">
      <thead id="tabhead">
        <tr>
          <th 
            scope="col"
            class="header sticky-bar"
            v-for="field in fields" 
            :key="'header-'+field.key"
          >
            <div 
              class="fr-grid-row fr-grid-row--middle no-wrap" 
            >
              <button
                class="fr-col-auto fr-mr-2w"
                data-fr-opened="false"
                :aria-controls="'fr-modal-' + field.key"
              >
              </button>
              <div class="fr-col style-header-col">
                {{ field.label }}
              </div>
            </div>
            <FieldModal :id="'fr-modal-' + field.key" :field="field" />
          </th>
        </tr>
      </thead>
      <tbody id="body">
        <tr
          v-for="(row, index) in rows" 
          :key="row[0]"
        >
          <td 
            v-for="field in fields"
            :key="'row-' + index + '-' + field.key"
          >
            <div class="cell">
              <span 
              >
                {{ row[field.key] }}
              </span>
            </div>
          </td>
        </tr> 
      </tbody>
      <button v-if="rows.length >= 10" class="fr-tag fr-tag--sm" @click="forceUserChangePage()">Charger plus de données</button>
      <div v-if="rows.length < 10" class="messageNoResults"></div>
      <tfoot class="fr-p-2w">
        <div class="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
          <div class="fr-col-auto">
          </div>
          <div class="fr-col-auto">
            <a
              download 
              :href="exportData()"
              class="fr-btn fr-btn--sm fr-btn--secondary fr-btn--icon-left fr-icon-download-line"
            >
              Télécharger les données filtrées
            </a>
          </div>
        </div>
      </tfoot>
    </table>
  </div>
</template>

<script>
import Filters from '../../../components/Filters.vue'
import Histogram from '../../../components/Histogram.vue'
import Tooltip from '../../../components/Tooltip.vue'
import Input from '../../../components/Input.vue'
import FieldModal from '../../../components/FieldModal.vue'
import appStore from "@/apps/dvf/store";
import {filtersEnabled} from '@/config'


export default {
  name: 'Table',
  components: { Filters, Histogram, Tooltip, Input, FieldModal },
  data () {
    return {
      filtersEnabled,
      lastBiggerScroll:0
    }
  },
  computed: {
    rows () {
      return appStore.state.rows
    },
    fields () {
      return appStore.state.fields
    },
    
    page () {
      return appStore.state.page;
    },
    tableLevel () {
        return appStore.state.tableLevel;
    },
    tableCode () {
        return appStore.state.tableCode;
    }
  },
  methods: {
    exportData() {
      return process.env.VUE_APP_DVF_API + "/dvf/csv/?" + this.tableLevel + "=" + this.tableCode

    },
    changePage () {
      fetch(process.env.VUE_APP_DVF_API + "/dvf?" + this.tableLevel + "=" + this.tableCode + "&page=" + (this.page + 1).toString())
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            appStore.commit('updatePage', this.page + 1)
            appStore.commit('updateRows', data["data"])
        });
    },
    handleScroll (event) {
    if(event.target.scrollTop>this.lastBiggerScroll){
        this.lastBiggerScroll = event.target.scrollTop+(event.target.offsetHeight/2)
        this.userChangePage()
      }
    },
    forceUserChangePage(){
      this.lastBiggerScroll = 0
      this.userChangePage()
    },
    userChangePage(){
      this.changePage()
    },
  },
  created () {
  },
  destroyed () {
    
  },
  watch: {
  }

}
</script>

<style scoped>
html {
    height: 100%;
    overflow: hidden;
}

.fr-table {
  overflow: auto;
  height: 100vh;
  margin-bottom: 0;
}

.fr-table.padding{
  padding-bottom: 285px;
}

.fr-table table {
  height: 100%;
}

.fr-table thead {
  background-color: white;
  background-image: none;
  position: sticky;
  top:0;
  z-index: 999;
}

.fr-table tbody {
  height: auto;
}

tfoot {
  position: fixed;
  bottom: 0;
  background-color: var(--background-flat-grey);
  color: var(--text-inverted-grey);
  width: 100%;
  z-index: 6;
  overflow: hidden;
  padding: 0.5rem!important;
}

tfoot .fr-btn--secondary {
  --border-action-high-blue-france: var(--text-inverted-grey);
  --border-active-blue-france: var(--text-inverted-grey);
  --text-action-high-blue-france: var(--text-inverted-grey);
  --hover-tint: var(--grey-425-625);
}

tfoot .fr-grid-row {
  justify-content: space-between;
}

tfoot .fr-col-auto{
  font-size: 0.850rem;
}

tfoot .fr-col-auto a{
  font-size: 0.850rem;
}

th {
  vertical-align: middle;
}

th, td {
  position: relative;
}

.titleColumn:hover {
  cursor: pointer;
}

.fr-table tbody tr:hover {
  background-color: var(--background-alt-blue-cumulus-hover);
}

.fr-table tbody td:hover {
  background-color: var(--background-contrast-blue-cumulus-hover);
}

.header, .filter {
  border-bottom: 2px solid var(--border-plain-grey);
}

.header--sorted, .filter--filled  {
  border-color: var(--border-plain-blue-cumulus);
}

.header {
  min-width: 150px;
}

.header.sticky-bar{
  padding: 0.45rem 1rem 0.4rem 1rem;
  font-size: 0.8rem;
}

.header.sticky-bar div{
  max-height: 80px;
  overflow: auto;
  line-height: 16px;
}

.filter {
  border-width: 1px;
}

.cell {
  max-height: 7.5rem;
  overflow: auto;
  overflow-x: hidden;
} 

.style-header-col {
  cursor: pointer;
  white-space: nowrap;
}

.messageNoResults{
  min-height: 400px;
}

@media (min-width: 48em){

  .fr-table td{
    padding:0.75rem;
  }

  .fr-table.padding{
    padding-bottom: 169px;
  }

  .style-header-col {
    white-space: normal;
  }

  tfoot{
    padding: 1rem!important;
  }

  tfoot .fr-col-auto{
    font-size: 1rem;
  }

  tfoot .fr-col-auto a{
    font-size: 1rem;
  }

}

</style>
