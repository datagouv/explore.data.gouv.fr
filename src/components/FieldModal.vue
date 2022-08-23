<template>
  <dialog :aria-labelledby="'fr-modal-title-modal-' + field.key" role="dialog" :id="id"
    class="fr-modal fr-modal--popover">
    <div class="fr-container--fluid">
      <div class="fr-grid-row fr-grid-row--right">
        <div class="fr-col-12 fr-col-sm-7 fr-col-md-5 fr-col-lg-4 fr-col-xl-3">
          <div class="fr-modal__body">
            <div class="fr-modal__header">
              <button class="fr-link--close fr-link" title="Fermer la fenêtre modale"
                :aria-controls="id">Fermer</button>
            </div>
            <div class="fr-modal__content fr-text--regular">
              <h1 :id="'fr-modal-title-modal-' + field.key" class="fr-modal__title">{{ field.label }}</h1>
              <dl>
                <dt>Type de données</dt>
                <dd>{{ columnInfos.type }}</dd>
              </dl>
              <h2 class="fr-text--sm">Analyse des données</h2>
              <dl>
                <dt>Format</dt>
                <dd>{{ columnInfos.format }}</dd>
                <dt>Nombre</dt>
                <dd>{{ columnInfos.count }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script>
export default {
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
  }
}
</script>

<style scoped>
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
</style>