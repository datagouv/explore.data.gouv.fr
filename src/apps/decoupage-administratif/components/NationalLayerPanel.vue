<template>
  <aside class="national-panel">
    <h2 class="panel-title">Couches administratives</h2>
    <p class="panel-intro">
      Sélectionnez une couche pour l'afficher sur la carte. Survolez un territoire pour voir ses informations.
    </p>

    <div
      v-for="layer in topLayers"
      :key="layer.id"
      class="layer-btn"
      :class="{ active: activeLayerId === layer.id, loading: loadingLayerId === layer.id }"
      @click="selectLayer(layer)"
    >
      <span class="layer-label">{{ layer.label }}</span>
      <span class="layer-desc">{{ layer.description }}</span>
    </div>

    <div class="interco-group">
      <button
        type="button"
        class="interco-toggle"
        :aria-expanded="intercoExpanded"
        @click="intercoExpanded = !intercoExpanded"
      >
        <span class="interco-toggle-label">Groupements d'intercommunalités</span>
        <span class="interco-chevron" :class="{ expanded: intercoExpanded }">›</span>
      </button>
      <p class="interco-intro">
        Structures de coopération entre communes (EPCI, syndicats, pôles…) regroupant des compétences communes sur un territoire.
      </p>

      <div v-show="intercoExpanded" class="interco-children">
        <div
          v-for="layer in intercoLayers"
          :key="layer.id"
          class="layer-btn layer-btn--child"
          :class="{ active: activeLayerId === layer.id, loading: loadingLayerId === layer.id }"
          @click="selectLayer(layer)"
        >
          <span class="layer-label">{{ layer.label }}</span>
          <span class="layer-desc">{{ layer.description }}</span>
        </div>
      </div>
    </div>

    <p v-if="loadingLayerId" class="loading-hint">Chargement de la couche…</p>
  </aside>
</template>

<script>
import { NATIONAL_LAYERS, INTERCO_LAYERS } from '../config';

export default {
  name: 'NationalLayerPanel',
  props: {
    activeLayerId: {
      type: String,
      default: null,
    },
    loadingLayerId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      intercoExpanded: false,
      topLayers: Object.values(NATIONAL_LAYERS),
      intercoLayers: Object.values(INTERCO_LAYERS),
    };
  },
  methods: {
    selectLayer(layer) {
      this.$emit('select', layer);
    },
  },
};
</script>

<style scoped lang="scss">
.national-panel {
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

.panel-title {
  font-size: 1.125rem;
  margin: 0 0 8px;
}

.panel-intro {
  font-size: 0.8125rem;
  color: #666;
  margin: 0 0 20px;
  line-height: 1.4;
}

.layer-btn {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;

  &:hover {
    border-color: #000091;
    background: #f6f6fe;
  }

  &.active {
    border-color: #000091;
    background: #e8edfe;
  }

  &.loading {
    opacity: 0.7;
    pointer-events: none;
  }

  &--child {
    margin-left: 8px;
  }
}

.layer-label {
  display: block;
  font-weight: 700;
  font-size: 0.9375rem;
  margin-bottom: 4px;
}

.layer-desc {
  display: block;
  font-size: 0.8125rem;
  color: #666;
  line-height: 1.35;
}

.interco-group {
  margin-top: 8px;
  border-top: 1px solid #e5e5e5;
  padding-top: 16px;
}

.interco-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
}

.interco-toggle-label {
  font-weight: 700;
  font-size: 0.9375rem;
}

.interco-chevron {
  font-size: 1.25rem;
  color: #000091;
  transform: rotate(0deg);
  transition: transform 0.15s;

  &.expanded {
    transform: rotate(90deg);
  }
}

.interco-intro {
  font-size: 0.8125rem;
  color: #666;
  margin: 8px 0 12px;
  line-height: 1.35;
}

.interco-children {
  margin-top: 4px;
}

.loading-hint {
  font-size: 0.8125rem;
  color: #000091;
  margin: 12px 0 0;
}
</style>
