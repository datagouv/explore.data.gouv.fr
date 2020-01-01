<template>
  <div>
    <b-table hover small :items="rows" :fields="fields" :no-local-sorting="true" @sort-changed="sort"></b-table>
    <b-pagination align="center" size="lg" :total-rows="totalRows" v-model="page" :per-page="pageSize" @input="changePage"></b-pagination>
  </div>
</template>

<script>
import {pageSize} from '@/config'

export default {
  'name': 'Table',
  computed: {
    rows () {
      return this.$store.state.rows
    },
    totalRows () {
      return this.$store.state.totalRows
    },
    fields () {
      return this.$store.getters.fields
    },
    pageSize () {
      return this.$store.state.pageSize
    },
    page: {
      get() {
        return this.$store.state.page;
      },
      set (newValue) {
        this.$store.commit('setPage', newValue)
      }
    }
  },
  methods: {
    sort () {
      return this.$store.dispatch('sort')
    },
    changePage () {
      return this.$store.dispatch('changePage')
    }
  }
}
</script>

<style>

</style>
