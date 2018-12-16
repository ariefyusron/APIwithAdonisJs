'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Anime = use('App/Models/Anime')

class Video extends Model {
    anime() {
        return this.belongsTo(Anime, 'id', 'id_anime')
    }
    static get table() {
        return 'videos'
    }

    static get primaryKey() {
        return 'id'
    }
}

module.exports = Video
