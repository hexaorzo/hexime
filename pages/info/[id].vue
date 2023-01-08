<script setup>
const route = useRoute();
const { id } = route.params;
const { META } = require("@consumet/extensions");
const anilist = new META.Anilist();
var aniInfo;
try {
  aniInfo = await anilist.fetchAnimeInfo(id);
} catch (error) {
  console.error(error);
}
const mal = new META.Myanimelist();
var MALinfo;
try {
  MALinfo = await mal.fetchAnimeInfo(aniInfo.malId);
} catch (error) {
  console.error(error);
}

function toMon(monthNumber) {
  if (monthNumber == null) {
    return null;
  }

  const date = new Date();
  date.setMonth(monthNumber - 1);

  return date.toLocaleString("en-US", {
    month: "short",
  });
}
const startMonth = toMon(aniInfo.startDate.month);
const endMonth = toMon(aniInfo.endDate.month);
</script>

<template>
  <div class="pa-6">
    <div class="card bg-base-100">
      <figure><img :src="aniInfo.cover" alt="Cover" /></figure>
      <div class="card-body">
        <div class="hero bg-base-200">
          <div class="hero-content items-start flex-col lg:flex-row">
            <div class="card card-compact bg-base-100 shadow-xl">
              <figure><img :src="MALinfo.image" /></figure>
              <div class="card-body">
                <p>{{ aniInfo.title.english }}</p>
                <p>{{ aniInfo.title.native }}</p>
                <p>{{ aniInfo.title.romaji }}</p>
                <v-divider></v-divider>
                <p style="text-align: center">Information</p>
                <v-divider></v-divider>
                <p>Score: &#11088; {{ MALinfo.rating }}</p>
                <p>Episodes: {{ aniInfo.totalEpisodes }} {{ aniInfo.type }}</p>
                <p>Status: {{ aniInfo.status }}</p>
                <p>
                  Aired from: {{ startMonth }} {{ aniInfo.startDate.day }},
                  {{ aniInfo.startDate.year }}
                </p>
                <p v-if="endMonth != null">
                  Aired till: {{ endMonth }} {{ aniInfo.endDate.day }},
                  {{ aniInfo.endDate.year }}
                </p>
                <p v-else>Aired till: Not Available</p>
                <p>Studios: 
                  <span v-for="(item, index) in aniInfo.studios">
                    <span v-if="index != 0">, </span><a>{{ item }}</a>
                  </span>
                </p>
              </div>
            </div>

            <div class="lg:w-3/4">
              <h3 class="text-3xl font-bold py-2">
                {{ aniInfo.title.romaji }}
              </h3>
              <p class="pb-3">
                Genres:
                <span v-for="(item, index) in MALinfo.genres">
                  <span v-if="index != 0">, </span><a>{{ item }}</a>
                </span>
              </p>
              <v-divider></v-divider>
              <h3 class="text-2xl font-bold py-3">Description</h3>
              <p class="py-3">
                {{ MALinfo.description }}
              </p>

              <div
                tabindex="0"
                class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box"
              >
                <div class="collapse-title text-xl font-medium">Episodes</div>
                <div class="collapse-content">
                  <p>
                    <div class="py-3" v-for="episode in aniInfo.episodes">
                      <div class="card card-side bg-base-200 shadow-xl">
                        <div class="card-body">
                          <h2 class="card-title">
                            {{ episode.number }}. {{ episode.title }}
                          </h2>
                          <div class="card-actions justify-end">
                            <button class="btn btn-primary">Watch</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </p>
                </div>
              </div>

              


            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mockup-code">
      <pre><div class="px-6"><code>{{ MALinfo }}</code></div></pre>
    </div>
    <div class="mockup-code">
      <pre><div class="px-6"><code>{{ aniInfo }}</code></div></pre>
    </div>
  </div>
</template>
