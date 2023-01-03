<template>
    <div class="pa-6">
      <article class="prose max-w-none">
        <h1>Konnichiwa {{ data?.user?.name }}!</h1>
      </article>
      <div class="divider"></div> 
      

      <div class="mockup-code">
        <pre><div class="px-6"><code>{{data}}</code></div></pre>
      </div>
    </div>
</template>

<script setup lang="ts">
  definePageMeta({ middleware: 'auth' })
  const { data } = useSession()
</script>