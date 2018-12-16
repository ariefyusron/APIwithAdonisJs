'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class AnimeGenre extends Model {
    anime() {
        return this.hasOne('./Anime.js', 'id', 'id_anime')
    }

    genre() {
        return this.hasOne('./Genre.js', 'id', 'id_genre')
    }

    static get table() {
        return 'anime_genres'
    }

    static get primaryKey() {
        return 'id'
    }
}

module.exports = AnimeGenre
