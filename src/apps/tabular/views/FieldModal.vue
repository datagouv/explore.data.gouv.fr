<template>
  <dialog :aria-labelledby="'fr-modal-title-modal-' + field.key" role="dialog" :id="id"
    class="fr-modal fr-modal--popover">
    <div class="fr-container--fluid modal-position">
      <div class="fr-grid-row fr-grid-row--center">
        <div class="fr-col-12 fr-col-sm-7 fr-col-md-6">
          <div class="fr-modal__body">
            <div class="fr-modal__header">
              Paramètre de colonne
              <button class="fr-link--close fr-link" title="Fermer la fenêtre modale"
                :aria-controls="id"></button>
            </div>
            <div class="fr-modal__content fr-text--regular">
              <h1 :id="'fr-modal-title-modal-' + field.key" class="fr-modal__title">{{ field.label }}</h1>
              <!-- <h2 class="fr-text--sm">Analyse des données</h2> -->
              <b>Filtres</b>
              <Input :field="field" />
              <!-- <dl>
                <dt>Format détecté</dt>
                <dd>{{ columnInfos.format }}</dd>
                <dt>Nombre de valeurs distinctes</dt>
                <dd>{{ columnInfos.nb_distinct }}</dd>
                <span v-if="columnInfos.python_type == 'float' || columnInfos.python_type == 'int'">
                  <dt>Valeur minimale</dt>
                  <dd>{{ columnInfos.min }}</dd>
                  <dt>Valeur maximale</dt>
                  <dd>{{ columnInfos.max }}</dd>
                  <dt>Valeur moyenne</dt>
                  <dd>{{ columnInfos.mean }}</dd>
                  <dt>Ecart-type</dt>
                  <dd>{{ columnInfos.std }}</dd>
                </span>
              </dl> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script>
import Histogram from '@/apps/tabular/views/Histogram.vue'
import storeTabular from '@/apps/tabular/store/storeTabular'
import Input from "@/apps/tabular/views/Input.vue";

export default {
  components: {Histogram, Input},
  store: storeTabular,
  props: {
    field: {
      type: Object,
      required: true,
    },
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    columnsInfos() {
      return this.$store.state.columnsInfos
    },
    columnInfos() {
      return this.columnsInfos[this.field.key] ? this.columnsInfos[this.field.key] : {}
    },
    numericPlotInfos() {
      return this.columnInfos['numeric_plot_infos'] ? this.columnInfos['numeric_plot_infos'] : {}
    },
  }
}
</script>

<style scoped>

.fr-modal__header{
  border-bottom: 1px solid #DDDDDD;
  padding-bottom: 0px;
  padding-top: 0px;
  margin-bottom: 10px;
}

.fr-link--close{
  border-left: 1px solid #DDDDDD;
  min-height: 0rem;
  padding-left: 0rem;
  padding-right: 0rem;
}

.fr-modal__title{
  font-size: 16px;
}


h2 {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

dl {
  margin: 0
}

dt {
  font-size: 0.8rem;
  color: var(--text-mention-grey);
}

dd {
  margin-left: 0;
  margin-top: 0.25rem;
  margin-bottom: 0.75rem;
  font-weight: bold;
}

.modal-position{
  margin-top: 150px;
}

</style>
