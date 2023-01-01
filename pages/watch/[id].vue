<template>
  <v-app>
    <Navbar />
      <v-main>
        <v-sheet class="pa-2" color="dark">
          <Artplayer @get-instance="getInstance" :option="option" :style="style" />
            <div>
              Page visits: {{ watchID }}
            </div>
        </v-sheet>
      <Footer />
    </v-main>
  </v-app>
</template>

<script setup>

</script>

<script>
import Artplayer from './Artplayer.vue';

export default {
  data() {
    const route = useRoute()
    const watchID = route.params.id
    const {pending,data } = useFetch("api/stream/"+ watchID)
    console.log(data);
    
    return {
      option: {
        url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        autoSize: true,
      },
      style: {
        width: '600px',
        height: '400px',
        margin: '60px auto 0',
      },
      watchID: data
    };
  },
  components: {
    Artplayer,
  },
  methods: {
    getInstance(art) {
      console.log(art);
    },
  },
};
</script>
