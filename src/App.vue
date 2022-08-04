<template>
  <div class='csvapi'>
    <div id="app">
      <header-app></header-app>
      <infos-dgv></infos-dgv>
      <infos-resource></infos-resource>
      <table-view></table-view>
    </div>
  </div>
</template>

<script>
import HeaderApp from './views/HeaderApp.vue'
import InfosDgv from './views/InfosDgv.vue'
import InfosResource from './views/InfosResource.vue'
import TableView from './views/TableView.vue'

export default {
  name: 'app',
  components: {
    HeaderApp,
    InfosDgv,
    InfosResource,
    TableView,
  },
}
</script>

<style>
@font-face {
  font-family: "Marianne";
  src: local("Marianne"),
   url(../public/fonts/Marianne-Regular.woff2) format("woff2");
}
@font-face {
  font-family: "Marianne-Bold";
  src: local("Marianne-Bold"),
   url(../public/fonts/Marianne-Bold.woff2) format("woff2");
}

.text-mention-grey {
  color: var(--text-mention-grey);
}

.csvapi {
  font-family: Marianne, Roboto, 'Helvetica Neue', Arial;
  --border-action-high-blue-france: var(--border-plain-blue-cumulus);
  --border-active-blue-france: var(--border-plain-blue-cumulus);
  --text-action-high-blue-france: var(--text-label-blue-cumulus);
}

.csvapi .fr-btn {
  border-radius: 30px;
}

.csvapi .fr-input-wrap.fr-input-wrap--icon-left .fr-input {
  padding-left: 2.5rem;
  padding-right: 1rem;
}
.csvapi .fr-input-wrap.fr-input-wrap--icon-left[class*=" fr-fi-"]::before,
.csvapi .fr-input-wrap.fr-input-wrap--icon-left[class*=" fr-icon-"]::before,
.csvapi .fr-input-wrap.fr-input-wrap--icon-left[class^=fr-fi-]::before,
.csvapi .fr-input-wrap.fr-input-wrap--icon-left[class^=fr-icon-]::before {
  left: 0.75rem;
  right: auto;
}

.csvapi .fr-input.fr-input--empty,
.csvapi .fr-input-wrap.fr-input-wrap--empty[class*=" fr-fi-"]::before,
.csvapi .fr-input-wrap.fr-input-wrap--empty[class*=" fr-icon-"]::before,
.csvapi .fr-input-wrap.fr-input-wrap--empty[class^=fr-fi-]::before,
.csvapi .fr-input-wrap.fr-input-wrap--empty[class^=fr-icon-]::before {
  color: var(--text-mention-grey);
}

.csvapi .fr-input.fr-input--empty {
  box-shadow: inset 0 -2px 0 0 var(--text-mention-grey);
}

.csvapi .fr-input.fr-input--filled,
.csvapi .fr-input-wrap.fr-input-wrap--filled[class*=" fr-fi-"]::before,
.csvapi .fr-input-wrap.fr-input-wrap--filled[class*=" fr-icon-"]::before,
.csvapi .fr-input-wrap.fr-input-wrap--filled[class^=fr-fi-]::before,
.csvapi .fr-input-wrap.fr-input-wrap--filled[class^=fr-icon-]::before {
  color: var(--text-label-blue-cumulus);
}

.csvapi .fr-input.fr-input--filled {
  box-shadow: inset 0 -2px 0 0 var(--border-plain-blue-cumulus);
}
</style>