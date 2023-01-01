<template>
  <v-app>
    <Navbar />
      <v-main>
        <v-sheet class="pa-2" color="dark">
          <Artplayer :option="option" :style="style" />
        </v-sheet>
      <Footer />
    </v-main>
  </v-app>
</template>

<script setup>
import { ANIME } from "@consumet/extensions"

const route = useRoute();
const { id } = route.params;
const main = async (watchID) => {
  const data = await $fetch("/api/stream/"+ watchID)
  return data.watchURL
}

var streamURL
try {streamURL = await main(id)} catch (error) {console.error(error)}

let option = { url: streamURL, autoSize: true }
let style = {width: '600px',
        height: '400px',
        margin: '60px auto 0',}
</script>

