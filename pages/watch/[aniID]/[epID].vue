<template>
  <div class="py-6 px-2">
    <div class="flex justify-center">
      <div class="flex pb-4 w-3/4 aspect-video">
        <iframe
          class="w-full h-full"
          :src="
            'https://hexaorzo-fantastic-space-palm-tree-p9p54prrvj9f9r95-3000.preview.app.github.dev/player.html#' +
            streamHash
          "
          frameborder="0"
          allowfullscreen
        ></iframe>
      </div>
    </div>
    <div class="flex justify-center">
      <div class="flex pb-4 w-3/4 gap-2">
        <a :href="'/watch/'+aniID+'/1'" class="flex-none w-12 h-10 btn btn-secondary btn-sm">&lt;&lt;</a>
        <a class="grow h-10 btn btn-secondary btn-sm" :href="'/watch/'+aniID+'/'+(parseInt(epID)-1)" v-if="epID>1">&lt; Prev. Ep.</a>
        <a class="grow h-10 btn btn-secondary btn-sm btn-disabled" v-else >&lt; Prev. Ep.</a>

        <a class="grow h-10 btn btn-secondary btn-sm" :href="'/watch/'+aniID+'/'+(parseInt(epID)+1)" v-if="epList.length > epID">Next Ep. ></a>
        <a class="grow h-10 btn btn-secondary btn-sm btn-disabled" v-else >Next Ep. ></a>
        <a class="flex-none w-12 h-10 btn btn-secondary btn-sm" :href="'/watch/'+aniID+'/'+epList.length">>></a>
      </div>
    </div>
    <div class="md:px-24">
      <div class="text-sm breadcrumbs">
        <ul>
          <li>
            <a :href="'/info/' + aniID">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="w-4 h-4 mr-2 stroke-current"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                ></path>
              </svg>
              {{ aniInfo.title.english }}
            </a>
          </li>
          <li>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="w-4 h-4 mr-2 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
              />
            </svg>

            Episode {{ epID }}
          </li>
        </ul>
      </div>

      <article class="prose max-w-none">
        <h1>{{ epInfo.title }}</h1>
      </article>
      <div class="divider"></div>

      <h3 class="text-2xl font-bold py-3">Description</h3>
      <p class="py-3 pb-6">
        {{ epInfo.description }}
      </p>
      <div class="grid grid-cols-5 md:grid-cols-10 lg:grid-cols-20 gap-2">
          <a :href="'/watch/'+aniID+'/' + episode.number" v-for="episode in aniInfo.episodes" class="grow h-10 btn btn-primary btn-sm">{{episode.number}}</a>
      </div>



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
var streamHash;

if (epList.length < epID) {
  epInfo = "null";
} else {
  epInfo = epList[epID - 1];
  try {
    streamURL = await anilist.fetchEpisodeSources(epInfo.id);
    streamURL = streamURL.sources.find((item) => item.quality === "default");
    streamURL = streamURL.url;
    streamHash = Buffer.from(streamURL, "utf8").toString("base64");
  } catch (error) {
    console.error(error);
  }
}
</script>
