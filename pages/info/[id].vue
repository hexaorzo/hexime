<script setup>
const route = useRoute();
const { id } = route.params;
const { META } = require("@consumet/extensions");
const anilist = new META.Anilist();
var aniInfo
try { aniInfo = await anilist.fetchAnimeInfo(id) } catch (error) { console.error(error) }
const mal = new META.Myanimelist();
var MALinfo
try { MALinfo = await mal.fetchAnimeInfo(aniInfo.malId) } catch (error) { console.error(error) }

function toMon(monthNumber) {
  if (monthNumber == null) { return null; }

  const date = new Date();
  date.setMonth(monthNumber - 1);

  return date.toLocaleString('en-US', {
    month: 'short',
  });
}
const startMonth = toMon(aniInfo.startDate.month)
const endMonth = toMon(aniInfo.endDate.month)
</script>

<script>
let tabs = ['Tab 1', 'Tab 2', 'Tab 3']
let activeTabIndex = 0
</script>

<template>
  <div class="pa-6">
    <div class="card bg-base-100 shadow-xl">
      <figure><img :src=aniInfo.cover alt="Cover" /></figure>
      <div class="card-body">

        <div class="hero bg-base-200">
          <div class="hero-content items-start flex-col lg:flex-row">


            <div class="card card-compact bg-base-100 shadow-xl">
              <figure><img :src=MALinfo.image /></figure>
              <div class="card-body">
                <p>{{ aniInfo.title.english }}</p>
                <p>{{ aniInfo.title.native }}</p>
                <p>{{ aniInfo.title.romaji }}</p>
                <v-divider></v-divider>
                <p style="text-align:center">Information</p>
                <v-divider></v-divider>
                <p>Rating: &#11088; {{ MALinfo.rating }}</p>
                <p>Episodes: {{ aniInfo.totalEpisodes }} {{ aniInfo.type }}</p>
                <p>Aired from: {{ startMonth }} {{ aniInfo.startDate.day }}, {{ aniInfo.startDate.year }}</p>
                <p v-if="endMonth != null">Aired till: {{ endMonth }} {{ aniInfo.endDate.day }}, {{
                  aniInfo.endDate.year
                }}
                </p>
                <p v-else>Aired till: Not Available</p>
              </div>
            </div>






            <div>
              <h3 class="text-3xl font-bold py-2">{{ aniInfo.title.romaji }}</h3>
              <p>Genres:
                <span v-for="(item, index) in MALinfo.genres">
                  <span v-if="index != 0">, </span><a>{{ item }}</a>

                </span>
              </p>
              <v-divider></v-divider>
              <div>
                
              </div>
              

              <p class="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi
                exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
              <button class="btn btn-primary">Get Started</button>
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