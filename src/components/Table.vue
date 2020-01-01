<template>
  <div>
    <b-form inline>
      <!-- TODO: make this a [] of components -->
      <b-form-select value-field="key" text-field="label" v-model="filterField" :options="fields"></b-form-select>
      <b-form-select v-model="filterComp" :options="comparators"></b-form-select>
      <b-input v-model="filterValue"></b-input>
      <b-button variant="primary">Filtrer</b-button>
    </b-form>
    <b-table hover small :items="rows" :fields="fields" :no-local-sorting="true" @sort-changed="sort"></b-table>
    <b-pagination align="center" size="lg" :total-rows="totalRows" v-model="page" :per-page="pageSize" @input="changePage"></b-pagination>
  </div>
</template>

<script>
import {pageSize} from '@/config'

export default {
  'name': 'Table',
  data () {
    return {
      comparators: [
        {value: '', text: 'est égal à'},
        {value: 'contains', text: 'contient'}
      ],
      filterField: '',
      filterComp: '',
      filterValue: ''
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
