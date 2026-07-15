<template>
  <a
    v-if="value"
    :href="sirenEntrepriseUrl(value)"
    target="_blank"
    rel="noopener noreferrer"
    class="siren-link"
    @click.stop
  >{{ value }}</a>
</template>

<script>
import { sirenEntrepriseUrl } from '../config';

export default {
  name: 'SirenLink',
  props: {
    value: {
      type: [String, Number],
      default: null,
    },
  },
  methods: {
    sirenEntrepriseUrl,
  },
};
</script>

<style scoped>
.siren-link {
  color: #000091;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.siren-link:hover {
  color: #1212ff;
}
</style>
