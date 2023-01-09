<template>
  <iframe
    class="w-full h-full"
    :src="
      'https://hexaorzo-fantastic-space-palm-tree-p9p54prrvj9f9r95-3000.preview.app.github.dev/player.html#' +
      streamHash
    "
    frameborder="0"
    allowfullscreen
  ></iframe>
</template>

<script>
export default defineComponent({
  props: {
    streamHash: {
      type: String,
      required: true
    }
  }
})
</script>