'use strict'
const Anime = use('App/Models/Anime')
const Database = use('Database')
const Query = use('Query')
const Route = use('Route')
const base_url = 'http://192.168.0.37:3333/api'

class AnimeController {

    async index({ request, response }) {

        //get request
        const get = request.get()

        //for pagination
        const limit = parseInt(get.content)
        const page = parseInt(get.page)
        const offset = (page - 1) * limit
        const nextPage = page + 1

        // sort
        const paramsSort = get.sort

        //search
        const paramsSearch = get.search


        if (paramsSearch) {
            const convertSearch = paramsSearch.split('%20')
            const search = convertSearch.join(' ')
            const animes = await Database.select('*')
                .from('animes')
                .where('title', 'LIKE', '%' + search + '%')
                .orderBy('title')
                .limit(limit)
                .offset(offset)

            return response.json({
                url: base_url + '?search=' + search + '&content=' + limit + '&page=' + nextPage,
                data: animes
            })

        } else {
            const year = new Date().getFullYear();
            let anime = ''
            switch (paramsSort) {
                case 'Movie':
                anime = await Database
                        .select('*')
                        .from('animes')
                        .where('id_series', '5')
                        .orderBy('animes.title')
                        .limit(limit)
                        .offset(offset)
                    break

                case 'All':
                anime = await Database.select('*')
                        .from('animes')
                        .orderBy('title', 'asc')
                        .limit(limit)
                        .offset(offset)
                    break

                case 'Popular':
                anime = await Database.select('*')
                        .from('animes')
                        .orderBy('view', 'desc')
                        .limit(limit)
                        .offset(offset)
                    break

                case 'Trending':
                anime = await Database.select('*')
                        .from('animes')
                        .where({
                            tahun: year,
                            status: 'Ongoing'
                        })
                        .orderBy('view', 'desc')
                        .limit(limit)
                        .offset(offset)
                    break

                case 'TopAll':
                anime = await Database.select('*')
                        .from('animes')
                        .orderBy('score', 'desc')
                        .limit(limit)
                        .offset(offset)
                    break
                default:
                    return response.json('Error 404. Route not found')
            }

            return response.json({
                url: base_url + '?sort=' + paramsSort + '&content=' + limit + '&page=' + nextPage,
                data: anime
            })
        }
    }

    async anime_detail({ request, response }) {
        const animeId = request.params.id

        const anime = await Database.select('*')
            .from('animes')
            .where('id', animeId)

        const animeVideo = await Database.select('videos.id', 'videos.episode', 'videos.video_embeded')
            .from('videos')
            .innerJoin('animes', 'videos.id_anime', 'animes.id')
            .where('animes.id', animeId)
            .orderBy('videos.created_at', 'desc')

        return response.json({ anime, animeVideo })
    }

    async anime_abjad({ request, response }) {
        //get request
        const get = request.get()
        const alpha = request.params.alphabet

        //for pagination
        const limit = parseInt(get.content)
        const page = parseInt(get.page)
        const offset = (page - 1) * limit
        const nextPage = page + 1

        const animes = await Database.select('*')
            .from('animes')
            .where('title', 'LIKE', alpha + '%')
            .orderBy('title')
            .limit(limit)
            .offset(offset)

        return response.json({
            url: base_url + '/' + alpha + '?content=' + limit + '&page=' + nextPage,
            data: animes
        })
    }

    // async anime_popular({ request, response }) {
    //     //get request
    //     const get = request.get()

    //     //for pagination
    //     const limit = parseInt(get.content)
    //     const page = parseInt(get.page)
    //     const offset = (page - 1) * limit
    //     const nextPage = page + 1

    //     const animes = await Database.select('*')
    //         .from('animes')
    //         .orderBy('view', 'desc')
    //         .limit(limit)
    //         .offset(offset)
    //     return response.json({
    //         url: base_url + '/popular?content=' + limit + '&page=' + nextPage,
    //         data: animes
    //     })
    // }

    // async anime_trending({ request, response }) {
    //     //get request
    //     const get = request.get()

    //     //for pagination
    //     const limit = parseInt(get.content)
    //     const page = parseInt(get.page)
    //     const offset = (page - 1) * limit
    //     const nextPage = page + 1

    //     const year = new Date().getFullYear();

    //     const animes = await Database.select('*')
    //         .from('animes')
    //         .where({
    //             tahun: year,
    //             status: 'Ongoing'
    //         })
    //         .orderBy('view', 'desc')
    //         .limit(limit)
    //         .offset(offset)
    //     return response.json({
    //         url: base_url + '/trending?content=' + limit + '&page=' + nextPage,
    //         data: animes
    //     })
    // }

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
