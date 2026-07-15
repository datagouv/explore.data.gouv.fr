<template>
  <aside v-if="commune" class="commune-panel">
    <button class="close-btn fr-btn fr-btn--tertiary-no-outline fr-icon-close-line" @click="$emit('close')" title="Fermer"></button>

    <h2 class="commune-name">{{ commune.nom }}</h2>
    <p class="commune-code">Code INSEE {{ commune.code }}</p>

    <dl class="info-list">
      <template v-if="commune.population != null">
        <dt>Population</dt>
        <dd>{{ formatPopulation(commune.population) }}</dd>
      </template>

      <template v-if="commune.codesPostaux && commune.codesPostaux.length">
        <dt>Code{{ commune.codesPostaux.length > 1 ? 's' : '' }} postal{{ commune.codesPostaux.length > 1 ? 'aux' : '' }}</dt>
        <dd>{{ commune.codesPostaux.join(', ') }}</dd>
      </template>

      <template v-if="commune.siren">
        <dt>SIREN</dt>
        <dd><siren-link :value="commune.siren" /></dd>
      </template>

      <template v-if="commune.departement">
        <dt>Département</dt>
        <dd>{{ commune.departement.nom }} ({{ commune.departement.code }})</dd>
      </template>

      <template v-if="commune.region">
        <dt>Région</dt>
        <dd>{{ commune.region.nom }}</dd>
      </template>

      <template v-if="commune.aom">
        <dt>AOM</dt>
        <dd>
          {{ commune.aom.nom }}
          <span v-if="commune.aom.code"> (<siren-link :value="commune.aom.code" />)</span>
        </dd>
      </template>
    </dl>

    <section v-if="commune.intercommunalites && commune.intercommunalites.length" class="interco-section">
      <h3>Intercommunalités</h3>

      <div
        v-for="interco in commune.intercommunalites"
        :key="interco.siren"
        class="interco-card"
      >
        <div class="interco-header">
          <strong>{{ interco.nom }}</strong>
          <span v-if="interco.nature" class="interco-badge">{{ interco.nature }}</span>
        </div>
        <p v-if="interco.categorie" class="interco-meta">{{ interco.categorie }}</p>
        <p v-if="interco.siren" class="interco-meta">SIREN <siren-link :value="interco.siren" /></p>

        <div v-if="interco.competences && interco.competences.length" class="competences">
          <button
            type="button"
            class="competences-toggle"
            :aria-expanded="isCompetencesExpanded(interco.siren)"
            @click="toggleCompetences(interco.siren)"
          >
            <span>Compétences ({{ interco.competences.length }})</span>
            <span class="competences-chevron" :class="{ expanded: isCompetencesExpanded(interco.siren) }">›</span>
          </button>
          <ul v-show="isCompetencesExpanded(interco.siren)">
            <li v-for="(competence, index) in interco.competences" :key="index">
              {{ formatCompetence(competence) }}
            </li>
          </ul>
        </div>
      </div>
    </section>
  </aside>
</template>

<script>
import SirenLink from './SirenLink.vue';

export default {
  name: 'CommunePanel',
  components: { SirenLink },
  props: {
    commune: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      expandedCompetences: {},
    };
  },
  watch: {
    commune() {
      this.expandedCompetences = {};
    },
  },
  methods: {
    isCompetencesExpanded(siren) {
      return !!this.expandedCompetences[siren];
    },
    toggleCompetences(siren) {
      this.$set(this.expandedCompetences, siren, !this.expandedCompetences[siren]);
    },
    formatPopulation(value) {
      return new Intl.NumberFormat('fr-FR').format(Math.round(value));
    },
    formatCompetence(slug) {
      if (!slug) return '';
      const label = slug.replace(/_/g, ' ');
      return label.charAt(0).toUpperCase() + label.slice(1);
    },
  },
};
</script>

<style scoped lang="scss">
.commune-panel {
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

.commune-name {
  font-size: 1.375rem;
  margin: 0 32px 4px 0;
  line-height: 1.3;
}

.commune-code {
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

.interco-section {
  border-top: 1px solid #e5e5e5;
  padding-top: 16px;

  h3 {
    font-size: 1rem;
    margin: 0 0 12px;
  }
}

.interco-card {
  background: #f6f6f6;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
}

.interco-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;

  strong {
    font-size: 0.9375rem;
    line-height: 1.3;
  }
}

.interco-badge {
  flex-shrink: 0;
  font-size: 0.75rem;
  font-weight: 700;
  background: #e8edfe;
  color: #000091;
  padding: 2px 6px;
  border-radius: 4px;
}

.interco-meta {
  margin: 4px 0 0;
  font-size: 0.8125rem;
  color: #666;
}

.competences {
  margin-top: 10px;
}

.competences-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #161616;
  text-align: left;
}

.competences-chevron {
  font-size: 1.125rem;
  color: #000091;
  transform: rotate(0deg);
  transition: transform 0.15s;

  &.expanded {
    transform: rotate(90deg);
  }
}

.competences ul {
  margin: 8px 0 0;
  padding-left: 18px;
  font-size: 0.8125rem;
  line-height: 1.4;
  color: #3a3a3a;
}

.competences li {
  margin-bottom: 4px;

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
