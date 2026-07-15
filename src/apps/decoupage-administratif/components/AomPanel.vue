<template>
  <aside v-if="aom" class="aom-panel">
    <button class="close-btn fr-btn fr-btn--tertiary-no-outline fr-icon-close-line" @click="$emit('close')" title="Fermer"></button>

    <h2 class="aom-name">{{ aom.nom }}</h2>
    <p class="aom-code">SIREN <siren-link :value="aom.code" /></p>

    <dl class="info-list">
      <template v-if="aom.nbCommunes != null">
        <dt>Communes couvertes</dt>
        <dd>{{ aom.nbCommunes }}</dd>
      </template>

      <template v-if="totalPopulation != null">
        <dt>Population totale</dt>
        <dd>{{ formatPopulation(totalPopulation) }} hab.</dd>
      </template>

      <template v-if="aom.codesDepartements && aom.codesDepartements.length">
        <dt>Département{{ aom.codesDepartements.length > 1 ? 's' : '' }}</dt>
        <dd>{{ aom.codesDepartements.join(', ') }}</dd>
      </template>

      <template v-if="aom.codesRegions && aom.codesRegions.length">
        <dt>Région{{ aom.codesRegions.length > 1 ? 's' : '' }}</dt>
        <dd>{{ aom.codesRegions.join(', ') }}</dd>
      </template>
    </dl>

    <section v-if="communes.length" class="communes-section">
      <h3>Communes associées</h3>

      <div
        v-for="commune in communesSorted"
        :key="commune.code"
        class="commune-card"
      >
        <strong>{{ commune.nom }}</strong>
        <p class="commune-meta">
          {{ commune.code }}
          <span v-if="commune.siren"> · SIREN <siren-link :value="commune.siren" /></span>
          <span v-if="commune.codeDepartement"> · {{ commune.codeDepartement }}</span>
          <span v-if="commune.population != null"> · {{ formatPopulation(commune.population) }} hab.</span>
        </p>
        <p v-if="commune.codesPostaux && commune.codesPostaux.length" class="commune-meta">
          {{ commune.codesPostaux.join(', ') }}
        </p>
      </div>
    </section>
  </aside>
</template>

<script>
import SirenLink from './SirenLink.vue';

export default {
  name: 'AomPanel',
  components: { SirenLink },
  props: {
    aom: {
      type: Object,
      default: null,
    },
  },
  computed: {
    communes() {
      return this.aom?.communes || [];
    },
    communesSorted() {
      return [...this.communes].sort((a, b) => a.nom.localeCompare(b.nom, 'fr'));
    },
    totalPopulation() {
      if (!this.communes.length) return null;
      return this.communes.reduce((sum, c) => sum + (c.population || 0), 0);
    },
  },
  methods: {
    formatPopulation(value) {
      return new Intl.NumberFormat('fr-FR').format(Math.round(value));
    },
  },
};
</script>

<style scoped lang="scss">
.aom-panel {
  position: absolute;
  top: 0;
  left: 0;
  width: 380px;
  max-width: 100%;
  height: 100%;
  background: #fff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.12);
  overflow-y: auto;
  padding: 24px 20px 32px;
  z-index: 2;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
}

.aom-name {
  font-size: 1.375rem;
  margin: 0 32px 4px 0;
  line-height: 1.3;
}

.aom-code {
  color: #666;
  margin: 0 0 20px;
  font-size: 0.875rem;
}

.info-list {
  margin: 0 0 24px;

  dt {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    color: #666;
    margin-top: 12px;

    &:first-child {
      margin-top: 0;
    }
  }

  dd {
    margin: 2px 0 0;
    font-size: 0.9375rem;
  }
}

.communes-section {
  border-top: 1px solid #e5e5e5;
  padding-top: 16px;

  h3 {
    font-size: 1rem;
    margin: 0 0 12px;
  }
}

.commune-card {
  background: #f6f6f6;
  border-radius: 4px;
  padding: 10px 12px;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }

  strong {
    font-size: 0.9375rem;
    line-height: 1.3;
  }
}

.commune-meta {
  margin: 4px 0 0;
  font-size: 0.8125rem;
  color: #666;
}
</style>
