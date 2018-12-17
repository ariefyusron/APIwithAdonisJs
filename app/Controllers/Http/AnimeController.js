'use strict'
const Anime = use('App/Models/Anime')
const Database = use('Database')
const Query = use('Query')
const Route= use('Route')
const base_url = 'http://localhost:3333/api/v1/'

class AnimeController {
    
    async index({ request, response }) {
        const limit = parseInt(request.params.content)
        const page = parseInt(request.params.page)
        const offset = (page-1)*limit
        const nextPage = page+1
        
        const animes = await Database.select('*')
                        .from('animes')
                        .orderBy('title')
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

    async anime_abjad({request, response}){
        const alpha = request.params.abjad
        const limit = parseInt(request.params.content)
        const page = parseInt(request.params.page)
        const offset = (page-1)*limit
        const nextPage = page+1
        const year = new Date().getFullYear();

        const animes = await Database.select('*')
                        .from('animes')
                        .where('title','LIKE',alpha+'%')
                        .orderBy('title')
                        .limit(limit)
                        .offset(offset)
        return response.json({
            url: base_url+'anime/alphabet/'+alpha+'/'+limit+'/'+nextPage,
            data: animes
        })
    }

    async anime_popular({request, response}) {
        const limit = parseInt(request.params.content)
        const page = parseInt(request.params.page)
        const offset = (page-1)*limit
        const nextPage = page+1

        const animes = await Database.select('*')
                        .from('animes')
                        .orderBy('view','desc')
                        .limit(limit)
                        .offset(offset)
        return response.json({
            url: base_url+'anime/popular/'+limit+'/'+nextPage,
            data: animes
        })
    }

    async anime_search({request, response}) {
        animes = await Database.raw('select * from animes where title="One Piece"')
        // const query = new Query(request, {order: 'id', limit: 10}) 
        // const order = query.order()

        // const animes = await Anime.query()
        // .where(query.search([
        //     'title'
        // ]))
        // .orderBy(order.column, order.direction)
        // .paginate(query.page(), query.limit())
        response.json(animes)
    }

    async anime_trending({request, response}) {
        const limit = parseInt(request.params.content)
        const page = parseInt(request.params.page)
        const offset = (page-1)*limit
        const nextPage = page+1
        const year = new Date().getFullYear();

        const animes = await Database.select('*')
                        .from('animes')
                        .where({
                            tahun: year,
                            status: 'Ongoing'
                        })
                        .orderBy('view','desc')
                        .limit(limit)
                        .offset(offset)
        return response.json({
            url: base_url+'anime/trending/'+limit+'/'+nextPage,
            data: animes
        })
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
