<template>
  <div>
    <nav class="navbar navbar-light bg-light">
      <a class="navbar-brand" href="/"><span class="mr-2">🦄</span> explore.etalab.studio <sup>alpha</sup></a>
    </nav>
    <div id="app">
      <table-view></table-view>
    </div>
  </div>
</template>

<script>
import TableView from './views/TableView.vue'

export default {
  name: 'app',
  components: {TableView},
}
</script>
