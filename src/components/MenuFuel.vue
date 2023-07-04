<template>
  <div class="input-adresse">
    <label class="fr-label" for="text-input-text"
      >Rechercher via une adresse</label
    >
    <input
      class="fr-input fr-mb-2w"
      type="text"
      v-model="searchAdress"
      id="text-input-text"
      name="text-input-text"
    />
    <div class="fr-grid-row fr-grid-row--center">
      <button class="fr-btn" @click="getAdresses()">Rechercher</button>
    </div>
    {{ results }}
  </div>
</template>


<script>
export default {
  name: "MenuFuel",
  props: [],
  data() {
    return {
      searchAdress: null,
      results: null,
    };
  },
  computed: {},
  async created() {},
  methods: {
    getAdresses() {
      fetch(
        "https://api-adresse.data.gouv.fr/search/?q=" + this.searchAdress
      ).then((response) => {
        this.results = response.json();
      });
    },
  },
};
</script>

<style scoped>
.input-adresse {
  width: 350px;
}
</style>
