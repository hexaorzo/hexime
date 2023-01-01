export default  defineEventHandler(
    async (event) => {
        const watchID = event.context.params.id
        const data = await $fetch("https://api.consumet.org/anime/gogoanime/watch/" + watchID)
        const defaultStream = data.sources.find(item => item.quality === "default");
        return {
          watchURL: defaultStream.url
        }
    }
)
