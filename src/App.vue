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

.csvapi {
  font-family: Marianne, Roboto, 'Helvetica Neue', Arial;
  --border-action-high-blue-france: #146bb8;
  --text-action-high-blue-france: #146bb8;
}

.csvapi .fr-btn {
  border-radius: 30px;
}
</style>