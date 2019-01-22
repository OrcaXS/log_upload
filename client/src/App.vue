<template>
  <div class="container">
    <Upload type="iOS"/>
    <Upload type="Android"/>
    <Upload type="PC"/>
  </div>
</template>

<script>
import Upload from './components/Upload.vue';

export default {
  name: 'app',
  components: {
    Upload,
  },
};
</script>

<style scoped>
@import '~@mdi/font/css/materialdesignicons.css';

.container {
  padding-top: 1em;
  width: 100%;
}
</style>
