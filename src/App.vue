<template>
  <div id="app">
    <Top />
    <Index />
  </div>
</template>

<script>
import Top from "./components/Top.vue";
import Index from "./components/Index.vue";

export default {
  name: "app",
  data() {
    return {};
  },
  methods: {},
  components: {
    Top,
    Index,
  },
};
</script>

<style lang="less"></style>
