<template>
  <div class="headerapp fr-grid-row fr-grid-row--middle">
    <div class="fr-enlarge-link">
        <a :href="home"><img
          src="/explore-light.svg"
          alt="explore.data.gouv.fr"
          class="logotype"
          width="200"
          height="18"
        /></a>
    </div>
    <div>
      <a
        :href="formHref"
        class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-btn--icon-left fr-icon-lightbulb-line"
      >
        <span>Donnez nous votre avis sur l'explorateur</span>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "HeaderApp",
  computed: {
    formHref() {
      return "https://tally.so/r/nr5BML";
    },
    home() {
      return window.location.origin;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.headerapp {
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: #e6eefe;
  justify-content: space-between;
  width: 100%;
  overflow: hidden;
}

.fr-enlarge-link {
  background-color: transparent;
  --hover: transparent;
}

.subtitle {
  font-family: "Spectral";
  font-style: italic;
  font-weight: 400;
  font-size: 18px;
  line-height: 18px;
  cursor: pointer;
  display: inline-block;
}


.fr-badge {
  font-size: 0.75rem;
}

@media (max-width: 48em) {
  .headerapp {
    padding-top: 5px;
    padding-bottom: 5px;
  }

  .fr-btn {
    padding: 0.25rem 0.2rem 0.25rem 0.75rem;
  }

  .fr-btn span {
    display: none;
  }
}
</style>
