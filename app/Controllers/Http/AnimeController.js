'use strict'
const Anime = use('App/Models/Anime')
const Database = use('Database')
const Query = use('Query')
const Route = use('Route')
const base_url = 'http://192.168.0.37:3333/api'
// const base_url = 'http://localhost:3333/api'

class AnimeController {

    async index({ request, response }) {

        //get request
        const get = request.get()

        //for pagination
        const limit = parseInt(get.content)
        const page = parseInt(get.page)
        const offset = (page - 1) * limit
        const nextPage = page + 1
        const prevPage = page - 1

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
            const count = await Database.select('*')
                .from('animes')
                .where('title', 'LIKE', '%' + search + '%')
                .orderBy('title')

            return response.json({
                total: count.length,
                perPage: limit,
                page: page,
                lastPage: Math.ceil(count.length / limit),
                nextUrl: base_url + '?search=' + search + '&content=' + limit + '&page=' + nextPage,
                prevUrl: base_url + '?search=' + search + '&content=' + limit + '&page=' + prevPage,
                results: animes
            })

        } else {
            const year = new Date().getFullYear();
            let anime = ''
            let count = ''
            switch (paramsSort.toLowerCase()) {
                case 'movie':
                    anime = await Database
                        .select('*')
                        .from('animes')
                        .where('id_series', '5')
                        .orderBy('animes.title')
                        .limit(limit)
                        .offset(offset)
                    count = await Database
                        .select('*')
                        .from('animes')
                        .where('id_series', '5')
                        .orderBy('animes.title')
                    break

                case 'all':
                    anime = await Database.select('*')
                        .from('animes')
                        .orderBy('title', 'asc')
                        .limit(limit)
                        .offset(offset)
                    count = await Database.select('*')
                        .from('animes')
                        .orderBy('title', 'asc')
                    break

                case 'popular':
                    anime = await Database.select('*')
                        .from('animes')
                        .orderBy('view', 'desc')
                        .limit(limit)
                        .offset(offset)
                    count = await Database.select('*')
                        .from('animes')
                        .orderBy('view', 'desc')
                    break

                case 'trending':
                    anime = await Database.select('*')
                        .from('animes')
                        .where({
                            status: 'Ongoing'
                        })
                        .orderBy('view', 'desc')
                        .limit(limit)
                        .offset(offset)
                    count = await Database.select('*')
                        .from('animes')
                        .where({
                            status: 'Ongoing'
                        })
                        .orderBy('view', 'desc')
                    break

                case 'topall':
                    anime = await Database.select('*')
                        .from('animes')
                        .orderBy('score', 'desc')
                        .limit(limit)
                        .offset(offset)
                    count = await Database.select('*')
                        .from('animes')
                        .orderBy('score', 'desc')
                    break

                default:
                    return response.json('Error 404. Route not found')
            }

            return response.json({
                total: count.length,
                perPage: limit,
                page: page,
                lastPage: Math.ceil(count.length / limit),
                nextUrl: base_url + '?sort=' + paramsSort + '&content=' + limit + '&page=' + nextPage,
                prevUrl: base_url + '?sort=' + paramsSort + '&content=' + limit + '&page=' + prevPage,
                results: anime
            })
        }
    }

    async anime_genre({ request, response }) {
        const get = request.get()
        const genreName = request.params.genreName

        // pagination
        const limit = parseInt(get.content)
        const page = parseInt(get.page)
        const offset = (page - 1) * limit
        const nextPage = page + 1
        const prevPage = page - 1

        // sorting genre
        const anime = await Database
            // .raw("select * from anime_genres join animes on anime_genres.id_anime = animes.id join genres on anime_genres.id_genre = genres.id where genres.title = ?", [genreName])
            .select('animes.*')
            .from('anime_genres')
            .innerJoin('animes', 'anime_genres.id_anime', 'animes.id')
            .innerJoin('genres', 'anime_genres.id_genre', 'genres.id')
            .where('genres.title', genreName)
            .limit(limit)
            .offset(offset)

        const count = await Database
            // .raw("select * from anime_genres join animes on anime_genres.id_anime = animes.id join genres on anime_genres.id_genre = genres.id where genres.title = ?", [genreName])
            .select('animes.*')
            .from('anime_genres')
            .innerJoin('animes', 'anime_genres.id_anime', 'animes.id')
            .innerJoin('genres', 'anime_genres.id_genre', 'genres.id')
            .where('genres.title', genreName)
        return response.json({
            total: count.length,
            perPage: limit,
            page: page,
            lastPage: Math.ceil(count.length / limit),
            nextUrl: base_url + '/genre/' + genreName + '?content=' + limit + '&page=' + nextPage,
            prevUrl: base_url + '/genre/' + genreName + '?content=' + limit + '&page=' + prevPage,
            result: anime
        })
    }

    async anime_detail({ request, response }) {
        const animeId = request.params.id
        const get = request.get()


        const detail = await Database.select('animes.*', 'series.title as type')
            .from('animes')
            .innerJoin('series', 'animes.id_series', 'series.id')
            .where('animes.id', animeId)

        return response.json({
            results: {
                detailAnime: detail,
            }
        })
    }

    async anime_video({ request, response }) {
        const animeId = request.params.id
        const get = request.get()

        //for pagination
        const limit = parseInt(get.content)
        const page = parseInt(get.page)
        const offset = (page - 1) * limit
        const nextPage = page + 1
        const prevPage = page - 1

        const episode = await Database.select('videos.id', 'videos.episode', 'videos.video_embeded')
            .from('videos')
            .innerJoin('animes', 'videos.id_anime', 'animes.id')
            .where('animes.id', animeId)
            .orderBy('videos.created_at', 'desc')
            .limit(limit)
            .offset(offset)

        const count = await Database.select('videos.id', 'videos.episode', 'videos.video_embeded')
            .from('videos')
            .innerJoin('animes', 'videos.id_anime', 'animes.id')
            .where('animes.id', animeId)
            .orderBy('videos.created_at', 'desc')

        return response.json({
            total: count.length,
            perPage: limit,
            page: page,
            lastPage: Math.ceil(count.length / limit),
            nextUrl: base_url + '/anime/' + animeId + '/episode?content=' + limit + '&page=' + nextPage,
            prevUrl: base_url + '/anime/' + animeId + '/episode?content=' + limit + '&page=' + prevPage,
            results: {
                listVideo: episode
            }
        })
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
        const prevPage = page - 1

        const animes = await Database.select('*')
            .from('animes')
            .where('title', 'LIKE', alpha + '%')
            .orderBy('title')
            .limit(limit)
            .offset(offset)
        const count = await Database.select('*')
            .from('animes')
            .where('title', 'LIKE', alpha + '%')
            .orderBy('title')

        return response.json({
            total: count.length,
            perPage: limit,
            page: page,
            lastPage: Math.ceil(count.length / limit),
            nextUrl: base_url + '/' + alpha + '?content=' + limit + '&page=' + nextPage,
            prevUrl: base_url + '/' + alpha + '?content=' + limit + '&page=' + prevPage,
            results: animes
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
