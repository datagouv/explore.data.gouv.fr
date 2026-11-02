<template>
  <div class="fr-table">
    <div class="table_scroll" @scroll="handleScroll($event)">
      <table>
        <thead id="tabhead">
          <tr>
            <th
              scope="col"
              class="header sticky-bar"
              v-for="field in fields"
              :key="'header-' + field.key"
            >
              <div class="fr-col style-header-col">
                {{ field.label }}
              </div>
            </th>
          </tr>
        </thead>
        <tbody id="body">
          <tr v-for="(row, index) in rows" :key="index">
            <td
              v-for="field in fields"
              :key="'row-' + index + '-' + field.key"
            >
              <div class="cell">
                <span>{{ row[field.key] }}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="table_more" v-if="rows.length">
        <button
          v-if="hasMore"
          class="fr-tag fr-tag--sm"
          :disabled="loadingPage"
          @click="loadNextPage()"
        >
          {{ loadingPage ? "Chargement…" : "Charger plus de données" }}
        </button>
        <span v-else class="table_end">
          {{ rows.length.toLocaleString() }} ventes affichées, c'est tout ce que
          DVF contient pour cette sélection.
        </span>
      </div>
    </div>

    <div class="table_footer">
      <a
        download
        :href="exportUrl"
        class="fr-btn fr-btn--sm fr-btn--secondary fr-btn--icon-left fr-icon-download-line"
      >
        Télécharger les données filtrées
      </a>
    </div>
  </div>
</template>

<script>
import appStore from "@/apps/dvf/store";

export default {
  name: 'Table',
  data () {
    return {
      loadingPage: false
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
    hasMore () {
      return appStore.state.hasMore;
    },
    tableLevel () {
      return appStore.state.tableLevel;
    },
    tableCode () {
      return appStore.state.tableCode;
    },
    exportUrl () {
      return process.env.VUE_APP_DVF_API + "/dvf/csv/?" + this.tableLevel + "=" + this.tableCode
    }
  },
  methods: {
    handleScroll (event) {
      const el = event.target
      // On charge la suite quand il reste moins d'un écran à faire défiler,
      // pour que les lignes arrivent avant que l'utilisateur touche le fond.
      if (el.scrollHeight - el.scrollTop - el.clientHeight < el.clientHeight) {
        this.loadNextPage()
      }
    },
    loadNextPage () {
      if (this.loadingPage || !this.hasMore || !this.tableCode) {
        return
      }
      this.loadingPage = true
      const nextPage = this.page + 1
      fetch(process.env.VUE_APP_DVF_API + "/dvf?" + this.tableLevel + "=" + this.tableCode + "&page=" + nextPage)
        .then((response) => response.json())
        .then((data) => {
          appStore.commit('updatePage', nextPage)
          appStore.commit('updateRows', data["data"])
        })
        .catch(() => {})
        .then(() => {
          this.loadingPage = false
        })
    }
  }
}
</script>

<style scoped>
.fr-table {
  display: flex;
  flex-direction: column;
  /* `height: 100%` vaudrait la hauteur du parent sans retrancher le fil d'Ariane
     qui le précède : le bas du tableau passerait sous le pied de page. */
  flex: 1;
  min-height: 0;
  margin-bottom: 0;
}

/* C'est ce conteneur qui défile, et lui seul : une hauteur imposée à la table
   l'empêcherait de dépasser, donc de produire une barre de défilement. */
.table_scroll {
  flex: 1;
  min-height: 0;
  overflow: auto;
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

.table_more {
  padding: 1rem;
  text-align: center;
}

.table_end {
  font-size: 0.875rem;
  color: var(--text-mention-grey);
}

.table_footer {
  background-color: var(--background-flat-grey);
  color: var(--text-inverted-grey);
  width: 100%;
  padding: 0.5rem;
  text-align: right;
}

.table_footer .fr-btn--secondary {
  --border-action-high-blue-france: var(--text-inverted-grey);
  --border-active-blue-france: var(--text-inverted-grey);
  --text-action-high-blue-france: var(--text-inverted-grey);
  --hover-tint: var(--grey-425-625);
  font-size: 0.850rem;
}

th {
  vertical-align: middle;
}

th, td {
  position: relative;
}

.fr-table tbody tr:hover {
  background-color: var(--background-alt-blue-cumulus-hover);
}

.fr-table tbody td:hover {
  background-color: var(--background-contrast-blue-cumulus-hover);
}

.header {
  border-bottom: 2px solid var(--border-plain-grey);
  min-width: 150px;
}

.header.sticky-bar {
  padding: 0.45rem 1rem 0.4rem 0.6rem;
  font-size: 0.8rem;
}

.header.sticky-bar div {
  max-height: 80px;
  overflow: auto;
  line-height: 16px;
}

.cell {
  max-height: 7.5rem;
  overflow: auto;
  overflow-x: hidden;
}

.style-header-col {
  white-space: nowrap;
}

@media (min-width: 48em){

  .fr-table td{
    padding:0.75rem;
  }

  .style-header-col {
    white-space: normal;
  }

  .table_footer{
    padding: 1rem;
  }

  .table_footer .fr-btn--secondary{
    font-size: 1rem;
  }

}

</style>
