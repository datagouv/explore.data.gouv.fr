<template>
  <div>
    <div v-if="filtersEnabled">
      <ul v-if="filters.length">
        <li v-for="(f, idx) in filters" v-bind:key="idx">
          {{ `"${f.field}" ${getCompLabel(f.comp)} "${f.value}"` }}
          <a href="" @click.prevent="deleteFilter(idx)">Supprimer</a>
        </li>
      </ul>
      <b-form inline @submit.prevent>
        <b-form-select value-field="key" text-field="label" v-model="filter.field" :options="fields"></b-form-select>
        <b-form-select v-model="filter.comp" :options="comparators"></b-form-select>
        <b-input v-model="filter.value"></b-input>
        <b-button variant="primary" @click="addFilter">Filtrer</b-button>
      </b-form>
    </div>
    <b-table hover small :items="rows" :fields="fields" :no-local-sorting="true" @sort-changed="sort"></b-table>
    <b-pagination align="center" :total-rows="totalRows" v-model="page" :per-page="pageSize" @input="changePage"></b-pagination>
  </div>
</template>

<script>
import {pageSize, filtersEnabled} from '@/config'

export default {
  'name': 'Table',
  data () {
    return {
      comparators: [
        {value: 'exact', text: 'est égal à'},
        {value: 'contains', text: 'contient'}
      ],
      filter: {
        field: '',
        value: '',
        comp: ''
      },
      filtersEnabled
    }
  },
  computed: {
    rows () {
      return this.$store.state.rows
    },
    filters () {
      return this.$store.state.filters
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
    getCompLabel (comp) {
      if (!comp) return
      return this.comparators.find(c => c.value == comp).text
    },
    sort (ctx) {
      return this.$store.dispatch('sort', ctx)
    },
    changePage () {
      return this.$store.dispatch('changePage')
    },
    addFilter () {
      this.$store.dispatch('addFilter', this.filter).then(() => {
        this.filter = {field: '', value: '', comp: ''}
        this.$store.dispatch('getData')
      })
    },
    deleteFilter (index) {
      this.$store.dispatch('deleteFilter', index).then(() => {
        this.$store.dispatch('getData')
      })
    }
  }
}
</script>

<style>

</style>
