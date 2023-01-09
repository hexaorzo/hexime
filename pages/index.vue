<template>
    <div class="py-12 px-10">
      <article class="prose max-w-none">
        <h4>Trending Animes</h4>
      </article>
      <div class="divider"></div> 
      <div class="carousel max-w-none p-4 space-x-4 bg-neutral rounded-box">
        <div v-for="item in trending.results" class="card w-96 bg-base-100 shadow-xl" >
          
          <a :href="'/info/'+item.id+'/'" class="w-36 transform p-2 transition duration-300 ease-out hover:scale-105">
            <div class="aspect-w-7 aspect-h-9 relative w-30">
              <img
                alt="Cover Image"
                :src=item.image
                layout="fill"
                objectFit="cover"
                objectPosition="center"
                className="rounded-md"
              />
            </div>
          
            <div>
              <p class="mt-2 h-9 text-sm font-bold text-white line-clamp-2 truncate">
                {{item.title.romaji}}
              </p>
            </div>
          </a>
        </div>
      </div>

      <article class="prose max-w-none pt-10">
        <h4>Popular Animes</h4>
      </article>
      <div class="divider"></div> 
      <div class="carousel max-w-none p-4 space-x-4 bg-neutral rounded-box">
        <div v-for="item in popular.results" class="card w-96 bg-base-100 shadow-xl" >
          
          <a :href="'/info/'+item.id+'/'" class="w-36 transform p-2 transition duration-300 ease-out hover:scale-105">
            <div class="aspect-w-7 aspect-h-9 relative w-30">
              <img
                alt="Cover Image"
                :src=item.image
                layout="fill"
                objectFit="cover"
                objectPosition="center"
                className="rounded-md"
              />
            </div>
          
            <div>
              <p class="mt-2 h-9 text-sm font-bold text-white line-clamp-2 truncate">
                {{item.title.romaji}}
              </p>
            </div>
          </a>
        </div>
      </div>

    </div>
</template>

<script setup>
  const { META } = require("@consumet/extensions");
  const anilist = new META.Anilist();
  var trending
  try {trending = await anilist.fetchTrendingAnime(1,35)} catch (error) {console.error(error)}
  var popular
  try {popular = await anilist.fetchPopularAnime(1,35)} catch (error) {console.error(error)}
</script>