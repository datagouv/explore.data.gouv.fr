<template>
  <div class="fr-alert fr-alert--warning map-unsupported">
    <h3 class="fr-alert__title">Votre navigateur ne permet pas d'afficher cette carte</h3>
    <p>
      Mettez-le à jour ou utilisez un navigateur récent
      (Safari 16.4, Firefox 114, Chrome 94 ou plus récent).
    </p>
  </div>
</template>

<script>
export default {
  name: 'MapUnsupported',
  mounted() {
    // maplibre makes its container position: relative and the map overlays
    // (legend, search) rely on it; do the same so the alert centres in the map area
    const container = this.$el.parentElement;
    if (getComputedStyle(container).position === 'static') {
      container.style.position = 'relative';
    }
  },
};
</script>

<style scoped>
.map-unsupported {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% - 2rem);
  max-width: 32rem;
  background-color: #fff;
  z-index: 1;
}
</style>
