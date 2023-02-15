<template>
    <div class="leftCol">LeftCol</div>
</template>

<script>

import appStore from '@/apps/dvf/store'

export default {
  name: 'LeftCol',
  components: {},
  data() {
    return {
    }
  },
  computed: {
  },
  mounted() {

  },
  methods: {
  },
  watch: {
  }
}

</script>

<style scoped>

.leftCol{
    display: inline-block;
    width: 25%;
    min-height: 100%;
    border:1px solid green;
    box-sizing: border-box;
}

</style>