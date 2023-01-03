<template>
    <div class="py-6 px-4">
      <article class="prose max-w-none">
        <h4>Trending Animes</h4>
      </article>
      <div class="divider"></div> 
      <div class="carousel max-w-none p-4 space-x-4 bg-neutral rounded-box">
        <div v-for="item in trending.results" class="card w-96 bg-base-100 shadow-xl" >
          
          <a class="w-36 transform p-2 transition duration-300 ease-out hover:scale-105">
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
                {{item.title.english}}
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
  try {trending = await anilist.fetchTrendingAnime(1,20)} catch (error) {console.error(error)}
</script>