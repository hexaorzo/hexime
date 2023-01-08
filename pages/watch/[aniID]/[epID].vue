<template>
  <div class="pa-6">
    <article class="prose max-w-none">
      <h1>Konnichiwa!</h1>
    </article>
    <div class="divider"></div>

    <div class="mockup-code">
      <pre><div class="px-6"><code>{{aniID}}</code></div></pre>
      <pre><div class="px-6"><code>{{epID}}</code></div></pre>
      <pre><div class="px-6"><code>{{epInfo}}</code></div></pre>
      <pre><div class="px-6"><code>{{streamURL}}</code></div></pre>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const aniID = route.params.aniID;
const epID = route.params.epID;
const { META } = require("@consumet/extensions");
const anilist = new META.Anilist();
var aniInfo;
try {
  aniInfo = await anilist.fetchAnimeInfo(aniID);
} catch (error) {
  console.error(error);
}

var epList;
try {
  epList = await anilist.fetchEpisodesListById(aniID);
} catch (error) {
  console.error(error);
}

var epInfo;
var streamURL;

if (epList.length < epID) 
{
  epInfo = "null";
} 
else 
{
  epInfo = epList[epID - 1];
  try {
    streamURL = await anilist.fetchEpisodeSources(epInfo.id);
    streamURL = streamURL.sources.find((item) => item.quality === "default");
    streamURL = streamURL.url;
  } 
  catch (error) 
  {
    console.error(error);
  }
}

let option = { url: streamURL, autoSize: true }
let style = {width: '600px',
        height: '400px',
        margin: '60px auto 0',}
</script>
