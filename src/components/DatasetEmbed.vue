<template>
  <div>
    <div :data-udata-dataset="dataset"></div>
    <component
      is="script"
      data-udata="https://www.data.gouv.fr/"
      src="https://static.data.gouv.fr/static/oembed.js"
      async
      defer
    ></component>
  </div>
</template>

<script>
export default {
  name: "DatasetEmbed",
  data() {
    return {};
  },
  props: {
    dataset: String,
  },
  computed: {},
  methods: {},
  created() {},
};
</script>

<style scoped lang="scss">
</style>