<template>
  <div class="m-2">
    <a href="" @click.prevent="filtersVisible = !filtersVisible">{{ filtersVisible ? 'Masquer' : 'Afficher' }} les filtres</a>
    <b-collapse v-model="filtersVisible">
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
    getCompLabel (comp) {
      if (!comp) return
      return this.comparators.find(c => c.value == comp).text
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
