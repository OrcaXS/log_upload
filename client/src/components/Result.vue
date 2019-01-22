<template>
  <div>
    <div>Result</div>
    <div class="Result-area">
      <p
        v-for="result in results"
        :key="result"
        class="Result-line">
        {{ result.filename }}
      </p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'result',
  props: {
    results: Array,
  },
};
</script>
<style scoped>
.Result-area {
  max-width: 60vw;
  max-height: 6em;
  overflow: auto;
  background-color: #EEEEEE;
}

.Result-line {
  padding: .2em;
  font-family: monospace;
}
</style>
