'use strict'
const Anime = use('App/Models/Anime')
const Database = use('Database')
const Query = use('Query')
const Route= use('Route')
const base_url = 'http://localhost:3333/api/v1/'

class AnimeController {
    // index() {
    //     return 'this is index'
    // }

    // detail(req) {
    //     return req.params.id
    // }
    async index({ request, response }) {
        const limit = parseInt(request.params.content)
        const page = parseInt(request.params.page)
        const offset = (page-1)*limit
        const nextPage = page+1
        const animes = await Database.select('*')
                        .from('animes')
                        .limit(limit)
                        .offset(offset)
        return response.json({
            url: base_url+'anime/'+limit+'/'+nextPage,
            data: animes
        })
    }

    async detail({ params, res }) {
        const anime = await Anime.find(params.id)
        return res.json(anime)
    }

    async anime_abjad({request}){
        return await Database.raw('select * from animes where title like "'+request.params.abjad+'%"')
    }

    async anime_popular(request, response) {
        return await Database.select('*')
        .from('animes')
        .orderBy('view', 'desc')
        .limit(20)
    }

    async anime_search({request, response}) {
        const query = new Query(request, {order: 'title', limit: 10, page: request.params.jumlah_page}) 
        const order = query.order()

        const animes = await Anime.query()
        .where(query.search([
            'title'
        ]))
        .orderBy(order.column, order.direction)
        .paginate(query.page(), query.limit())
        response.json(animes)
    }

    async anime_trending(request, response) {
        return await Database.select('*')
        .from('animes')
        .orderBy('view', 'desc')
        .limit(20)
    }



    async anime_pagination(){
        try {
            
        } catch (error) {
            
        }
    }

    async store({ request, response }) {
        const title = request.input('title')
        const description = request.input('description')
        const status = request.input('status')
        const tahun = request.input('tahun')
        const rating = request.input('rating')
        // const score = request.input('score')
        const studio = request.input('studio')
        const durasi = request.input('durasi')
        const view = request.input('view')
        const thumbnail = request.input('thumbnail')
        const id_series = request.input('id_series')

        const anime = new Anime()
        anime.title = title
        anime.description = description
        anime.status = status
        anime.tahun = tahun
        // anime.score = score
        anime.rating = rating
        anime.studio = studio
        anime.durasi = durasi
        anime.view = view
        anime.thumbnail = thumbnail
        anime.id_series = id_series

        await anime.save()
        return response.json
    }

    async select_series({ params, response }) {
        a = await Database.select('*')
            .from('animes')
            .innerJoin('series', 'animes.id_series', 'series.id')
            .where('animes.id_series', params.id)

        return response.json(a)
    }

}

module.exports = AnimeController
