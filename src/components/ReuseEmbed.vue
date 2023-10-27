<template>
  <div>
    <div :data-udata-reuse="reuse"></div>
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
  name: "ReuseEmbed",
  data() {
    return {};
  },
  props: {
    reuse: String,
  },
  computed: {},
  methods: {},
  created() {},
};
</script>

<style scoped lang="scss">
</style>