<template>
  <div class="Upload-container">
    <section class="Upload-area">
      <h3 class="header">{{ this.type }}</h3>
      <b-field>
        <b-upload
          v-model="dropFiles"
          :name="typeName"
          multiple
          drag-drop
          accept="text/plain,.log,.zip">
          <section class="section">
            <div class="content has-text-centered">
              <p>
                <b-icon
                  icon="upload"
                  size="is-large">
                </b-icon>
              </p>
              <p>拖拽或点击以上传</p>
            </div>
          </section>
        </b-upload>
      </b-field>

      <div class="Upload-tags">
        <span v-for="(file, index) in dropFiles"
          :key="index"
          class="Upload-tags-span tag is-primary">
          {{file.name}}
          <button class="delete is-small"
            type="button"
            @click="deleteDropFile(index)">
          </button>
        </span>
      </div>
      <button
        class="button is-primary"
        :disabled="disableBtn"
        @click="upload()">
        <b-icon icon="upload"></b-icon>
        <span>Click to upload</span>
      </button>
    </section>
    <Result :results="results"/>
  </div>
</template>

<script>
import Result from './Result.vue';

export default {
  name: 'upload',
  components: {
    Result,
  },
  data() {
    return {
      results: [],
      dropFiles: [],
    };
  },
  props: {
    type: String,
  },
  computed: {
    typeName() {
      return this.type.toLowerCase();
    },
    disableBtn() {
      return this.dropFiles.length < 1;
    },
  },
  methods: {
    deleteDropFile(index) {
      this.dropFiles.splice(index, 1);
    },
    upload() {
      const formData = new FormData();
      this.dropFiles.forEach((file) => {
        formData.append(this.typeName, file);
      });
      const baseUrl = `http://${process.env.VUE_APP_API_DOMAIN}:${process.env.VUE_APP_API_PORT}/upload`;
      console.log(baseUrl);
      this.$axios
        .post(baseUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((result) => {
          if (Array.isArray(result.data)) {
            this.results = result.data;
          } else {
            this.results = [result.data];
          }
          this.dropFiles = [];
        })
        .catch((e) => {
          console.error(e);
        });
    },
  },
};
</script>

<style scoped>
.header {
  font-size: 2em;
  margin-top: .5em;
}

.Upload-container {
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
}

.Upload-area {
  padding-right: 1em;
}

.Upload-tags {
  max-width: 10em;
  display: flex;
  flex-flow: row wrap;
}

.Upload-tags-span {
  margin: .25em 0;
}
</style>
