<template>
  <div class="commune-search">
    <label class="fr-label" for="commune-search-input">Rechercher une commune</label>
    <div class="search-input-wrapper">
      <input
        id="commune-search-input"
        v-model="query"
        type="search"
        class="fr-input"
        placeholder="Nom de la commune…"
        autocomplete="off"
        @input="onInput"
        @keydown.down.prevent="moveHighlight(1)"
        @keydown.up.prevent="moveHighlight(-1)"
        @keydown.enter.prevent="selectHighlighted"
        @keydown.esc="clearResults"
      />
      <span v-if="loading" class="search-spinner">…</span>
    </div>

    <ul v-if="results.length" class="search-results">
      <li
        v-for="(result, index) in results"
        :key="result.code"
        :class="{ highlighted: index === highlightedIndex }"
        @click="selectResult(result)"
        @mouseenter="highlightedIndex = index"
      >
        <strong>{{ result.nom }}</strong>
        <span class="result-meta">
          {{ result.code }}
          <span v-if="result.siren"> · SIREN <siren-link :value="result.siren" /></span>
          <span v-if="result.codeDepartement"> · {{ result.codeDepartement }}</span>
          <span v-if="result.population != null"> · {{ formatPopulation(result.population) }} hab.</span>
        </span>
      </li>
    </ul>

    <p v-else-if="query.length >= 2 && !loading && searched" class="no-results">
      Aucune commune trouvée
    </p>
  </div>
</template>

<script>
import { API_BASE, COMMUNE_SEARCH_FIELDS } from '../config';
import SirenLink from './SirenLink.vue';

export default {
  name: 'CommuneSearch',
  components: { SirenLink },
  data() {
    return {
      query: '',
      results: [],
      loading: false,
      searched: false,
      highlightedIndex: -1,
      debounceTimer: null,
    };
  },
  methods: {
    onInput() {
      clearTimeout(this.debounceTimer);
      this.highlightedIndex = -1;

      if (this.query.trim().length < 2) {
        this.results = [];
        this.searched = false;
        return;
      }

      this.debounceTimer = setTimeout(() => this.search(), 300);
    },
    async search() {
      const nom = this.query.trim();
      if (nom.length < 2) return;

      this.loading = true;
      this.searched = false;

      try {
        const response = await fetch(
          `${API_BASE}/communes?nom=${encodeURIComponent(nom)}&fields=${COMMUNE_SEARCH_FIELDS}`
        );
        this.results = await response.json();
      } catch (error) {
        console.error('Erreur recherche communes:', error);
        this.results = [];
      } finally {
        this.loading = false;
        this.searched = true;
      }
    },
    selectResult(result) {
      this.$emit('select', result);
      this.query = result.nom;
      this.results = [];
      this.searched = false;
    },
    selectHighlighted() {
      if (this.highlightedIndex >= 0 && this.results[this.highlightedIndex]) {
        this.selectResult(this.results[this.highlightedIndex]);
      }
    },
    moveHighlight(delta) {
      if (!this.results.length) return;
      const next = this.highlightedIndex + delta;
      if (next < 0) {
        this.highlightedIndex = this.results.length - 1;
      } else if (next >= this.results.length) {
        this.highlightedIndex = 0;
      } else {
        this.highlightedIndex = next;
      }
    },
    clearResults() {
      this.results = [];
      this.searched = false;
    },
    formatPopulation(value) {
      if (value == null) return '—';
      return new Intl.NumberFormat('fr-FR').format(Math.round(value));
    },
  },
};
</script>

<style scoped lang="scss">
.commune-search {
  position: relative;
  width: 360px;
  max-width: calc(100vw - 32px);
}

.search-input-wrapper {
  position: relative;
}

.search-spinner {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.search-results {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  max-height: 320px;
  overflow-y: auto;
  z-index: 10;

  li {
    padding: 10px 12px;
    cursor: pointer;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    &:hover,
    &.highlighted {
      background: #f6f6f6;
    }

    strong {
      display: block;
      font-size: 0.9375rem;
    }
  }
}

.result-meta {
  font-size: 0.8125rem;
  color: #666;
}

.no-results {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  margin: 0;
  padding: 10px 12px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #666;
  z-index: 10;
}
</style>
