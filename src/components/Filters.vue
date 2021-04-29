<template>
  <div class="m-2">
    <b-button variant="primary"@click.prevent="filtersVisible = !filtersVisible">
      🔎 {{ filtersVisible ? 'Masquer' : 'Afficher' }} les filtres <span v-if="filters.length">({{ filters.length }})</span>
    </b-button>
    <b-button class="ml-sm-2 mt-2 mt-sm-0" variant="primary" target="_blank" rel="noopener noreferrer" :href="$store.state.profileEndpoint">🕵️ Explorer les données</b-button>
    <b-collapse class="mt-2" v-model="filtersVisible">
      <b-card no-body>
        <b-list-group flush v-if="filters.length">
          <b-list-group-item v-for="(f, idx) in filters" v-bind:key="idx">
            {{ `"${f.field}" ${getCompLabel(f.comp)} "${f.value}"` }}
            <a href="" @click.prevent="deleteFilter(idx)" class="float-right">Supprimer le filtre</a>
          </b-list-group-item>
        </b-list-group>
        <b-form inline @submit.prevent class="m-2">
          <b-form-select class="mr-1" value-field="key" text-field="label" v-model="filter.field" :options="fields"></b-form-select>
          <b-form-select class="mr-1" v-model="filter.comp" :options="comparators"></b-form-select>
          <b-input class="mr-1" v-model="filter.value"></b-input>
          <b-button variant="primary" @click="addFilter">Filtrer</b-button>
        </b-form>
      </b-card>
    </b-collapse>
  </div>
</template>

<script>
export default {
  name: 'Filters',
  data () {
    return {
      comparators: [
        {value: 'exact', text: 'est égal à'},
        {value: 'contains', text: 'contient'}
      ],
      filtersVisible: false,
      filter: {
        field: '',
        value: '',
        comp: ''
      },
    }
  },
  computed: {
    filters () {
      return this.$store.state.filters
    },
    fields () {
      return this.$store.getters.fields
    },
  },
  methods: {
    getSearchParams () {
      return new URLSearchParams(document.location.search)
    },
    setSearchParams (params) {
      window.history.pushState(null, '', `/?${params.toString()}`)
    },
    addToQueryString (key, value) {
      const params = this.getSearchParams()
      params.set(key, value)
      this.setSearchParams(params)
    },
    removeFromQueryString (key) {
      const params = this.getSearchParams()
      params.delete(key)
      this.setSearchParams(params)
    },
    getCompLabel (comp) {
      if (!comp) return
      return this.comparators.find(c => c.value == comp).text
    },
    addFilter () {
      this.$store.commit('addFilter', this.filter)
      this.addToQueryString(`${this.filter.field}__${this.filter.comp}`, this.filter.value)
      this.filter = {field: '', value: '', comp: ''}
      this.$store.dispatch('getData')
    },
    deleteFilter (index) {
      const filter = this.filters[index]
      this.removeFromQueryString(`${filter.field}__${filter.comp}`)
      this.$store.commit('deleteFilter', index)
      this.$store.dispatch('getData')
    }
  }
}
</script>

<style>

</style>
