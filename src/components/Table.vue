<template>
  <div>
    <Filters v-if="filtersEnabled"></Filters>
    <div class="table-responsive">
      <b-table class="m-2" hover small :items="rows" :fields="fields" :no-local-sorting="true" @sort-changed="sort"></b-table>
    </div>
    <b-pagination align="center" :total-rows="totalRows" v-model="page" :per-page="pageSize" @input="changePage"></b-pagination>
  </div>
</template>

<script>
import {pageSize, filtersEnabled} from '@/config'
import Filters from '@/components/Filters'

export default {
  name: 'Table',
  components: {Filters},
  data () {
    return {
      filtersEnabled
    }
  },
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
    sort (ctx) {
      return this.$store.dispatch('sort', ctx)
    },
    changePage () {
      return this.$store.dispatch('changePage')
    }
  }
}
</script>

<style>

</style>
