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
@import "~@gouvfr/dsfr/dist/dsfr/dsfr.css";

.text-mention-grey {
  color: var(--text-mention-grey);
}

.text-label-blue-cumulus {
  color: var(--text-label-blue-cumulus);
}

.no-wrap {
  flex-wrap: nowrap;
}

.csvapi {
  font-family: Marianne, Roboto, 'Helvetica Neue', Arial;
  --border-action-high-blue-france: var(--border-plain-blue-cumulus);
  --border-active-blue-france: var(--border-plain-blue-cumulus);
  --text-action-high-blue-france: var(--text-label-blue-cumulus);
  --background-action-low-blue-france-hover: var(--background-action-low-blue-cumulus-hover);
  --background-action-low-blue-france-active: var(--background-action-low-blue-cumulus-active);
  --background-action-low-blue-france: var(--background-action-low-blue-cumulus);
  --background-action-high-blue-france-hover: var(--background-action-high-blue-cumulus-hover);
  --background-action-high-blue-france-active: var(--background-action-high-blue-cumulus-active);
  --background-action-high-blue-france: var(--background-action-high-blue-cumulus);
  --border-default-blue-france: var(--border-default-blue-cumulus);
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

.fr-table__shadow:before {
  --table-offset: 0;
}

.fr-modal.fr-modal--popover .fr-container--fluid, .fr-modal.fr-modal--popover .fr-grid-row, .fr-modal.fr-modal--popover .fr-modal__body {
  height: 100%;
}

.fr-modal > .fr-container--fluid {
  pointer-events: none;
}

.cat1, .cat2, .cat3, .cat4, .cat5, .cat6, .cat7, .cat8, .cat9, .cat10, .topInfo {
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 4px;
  padding-bottom: 4px;
  border-radius: 8px;
  text-align: left;
}

.top {
  text-align: left;
}

.fr-tag.cat1 {
  --idle: transparent;
  --hover: var(--background-action-low-green-menthe-hover);
  --active: var(--background-action-low-green-menthe-active);
  background-color: var(--background-action-low-green-menthe);
  color: var(--text-action-high-green-menthe);
}

.fr-badge.cat1 {
  --idle: transparent;
  --hover: var(--background-contrast-green-menthe-hover);
  --active: var(--background-contrast-green-menthe-active);
  background-color: var(--background-contrast-green-menthe);
  color: var(--text-label-green-menthe);
}

.fr-tag.cat2 {
  --idle: transparent;
  --hover: var(--background-action-low-green-tilleul-verveine-hover);
  --active: var(--background-action-low-green-tilleul-verveine-active);
  background-color: var(--background-action-low-green-tilleul-verveine);
  color: var(--text-action-high-green-tilleul-verveine);
}

.fr-badge.cat2 {
  --idle: transparent;
  --hover: var(--background-contrast-green-tilleul-verveine-hover);
  --active: var(--background-contrast-green-tilleul-verveine-active);
  background-color: var(--background-contrast-green-tilleul-verveine);
  color: var(--text-label-green-tilleul-verveine);
}

.fr-tag.cat3 {
  --idle: transparent;
  --hover: var(--background-action-low-blue-ecume-hover);
  --active: var(--background-action-low-blue-ecume-active);
  background-color: var(--background-action-low-blue-ecume);
  color: var(--text-action-high-blue-ecume);
}

.fr-badge.cat3 {
  --idle: transparent;
  --hover: var(--background-contrast-blue-ecume-hover);
  --active: var(--background-contrast-blue-ecume-active);
  background-color: var(--background-contrast-blue-ecume);
  color: var(--text-label-blue-ecume);
}

.fr-tag.cat4 {
  --idle: transparent;
  --hover: var(--background-action-low-purple-glycine-hover);
  --active: var(--background-action-low-purple-glycine-active);
  background-color: var(--background-action-low-purple-glycine);
  color: var(--text-action-high-purple-glycine);
}

.fr-badge.cat4 {
  --idle: transparent;
  --hover: var(--background-contrast-purple-glycine-hover);
  --active: var(--background-contrast-purple-glycine-active);
  background-color: var(--background-contrast-purple-glycine);
  color: var(--text-label-purple-glycine);
}

.fr-tag.cat5 {
  --idle:transparent;
  --hover:var(--background-action-low-pink-macaron-hover);
  --active:var(--background-action-low-pink-macaron-active);
  background-color:var(--background-action-low-pink-macaron);
  color:var(--text-action-high-pink-macaron);
}

.fr-badge.cat5 {
  --idle:transparent;
  --hover:var(--background-contrast-pink-macaron-hover);
  --active:var(--background-contrast-pink-macaron-active);
  background-color:var(--background-contrast-pink-macaron);
  color:var(--text-label-pink-macaron);
}

.fr-tag.cat6 {
  --idle:transparent;
  --hover:var(--background-action-low-yellow-tournesol-hover);
  --active:var(--background-action-low-yellow-tournesol-active);
  background-color:var(--background-action-low-yellow-tournesol);
  color:var(--text-action-high-yellow-tournesol);
}

.fr-badge.cat6 {
  --idle:transparent;
  --hover:var(--background-contrast-yellow-tournesol-hover);
  --active:var(--background-contrast-yellow-tournesol-active);
  background-color:var(--background-contrast-yellow-tournesol);
  color:var(--text-label-yellow-tournesol);
}

.fr-tag.cat7 {
  --idle:transparent;
  --hover:var(--background-action-low-orange-terre-battue-hover);
  --active:var(--background-action-low-orange-terre-battue-active);
  background-color:var(--background-action-low-orange-terre-battue);
  color:var(--text-action-high-orange-terre-battue);
}

.fr-badge.cat7 {
  --idle:transparent;
  --hover:var(--background-contrast-orange-terre-battue-hover);
  --active:var(--background-contrast-orange-terre-battue-active);
  background-color:var(--background-contrast-orange-terre-battue);
  color:var(--text-label-orange-terre-battue);
}

.fr-tag.cat8 {
  --idle:transparent;
  --hover:var(--background-action-low-yellow-moutarde-hover);
  --active:var(--background-action-low-yellow-moutarde-active);
  background-color:var(--background-action-low-yellow-moutarde);
  color:var(--text-action-high-yellow-moutarde);
}

.fr-badge.cat8 {
  --idle:transparent;
  --hover:var(--background-contrast-yellow-moutarde-hover);
  --active:var(--background-contrast-yellow-moutarde-active);
  background-color:var(--background-contrast-yellow-moutarde);
  color:var(--text-label-yellow-moutarde);
}

.fr-tag.cat9 {
  --idle:transparent;
  --hover:var(--background-action-low-green-emeraude-hover);
  --active:var(--background-action-low-green-emeraude-active);
  background-color:var(--background-action-low-green-emeraude);
  color:var(--text-action-high-green-emeraude);
}

.fr-badge.cat9 {
  --idle:transparent;
  --hover:var(--background-contrast-green-emeraude-hover);
  --active:var(--background-contrast-green-emeraude-active);
  background-color:var(--background-contrast-green-emeraude);
  color:var(--text-label-green-emeraude);
}

.fr-tag.cat10 {
  --idle:transparent;
  --hover:var(--background-action-low-brown-opera-hover);
  --active:var(--background-action-low-brown-opera-active);
  background-color:var(--background-action-low-brown-opera);
  color:var(--text-action-high-brown-opera);
}

.fr-badge.cat10 {
  --idle:transparent;
  --hover:var(--background-contrast-brown-opera-hover);
  --active:var(--background-contrast-brown-opera-active);
  background-color:var(--background-contrast-brown-opera);
  color:var(--text-label-brown-opera);
}

</style>