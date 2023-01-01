<template>
    <div ref="artRef"></div>
  </template>
  
  <script>
  import Hls from 'hls.js';
  import Artplayer from 'artplayer';
  import artplayerPluginHlsQuality from 'artplayer-plugin-hls-quality';
  
  export default {
    data() {
      return {
        instance: null,
      };
    },
    props: {
      option: {
        type: Object,
        required: true,
      },
    },
    mounted() {
      this.instance = new Artplayer({
        ...this.option,
        container: this.$refs.artRef,
        customType: {
          m3u8: function (video, url, art) {
            art.hls = new Hls();
            art.hls.loadSource(url);
            art.hls.attachMedia(video);
          },
        },
        plugins: [
          artplayerPluginHlsQuality({
            control: true,
            setting: true,
            title: 'Quality',
            auto: 'Auto',
          }),
        ],
      });
  
      this.$nextTick(() => {
        this.$emit('get-instance', this.instance);
      });
    },
    beforeUnmount() {
      if (this.instance && this.instance.destroy) {
        this.instance.destroy(false);
      }
    },
  };
  </script>
  