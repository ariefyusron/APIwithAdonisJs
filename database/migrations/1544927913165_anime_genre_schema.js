'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AnimeGenreSchema extends Schema {
  up () {
    this.create('anime_genres', (table) => {
      table.increments()
      table.integer('id_genre')
      table.integer('id_anime')
      table.timestamps()
    })
  }

  down () {
    this.drop('anime_genres')
  }
}

module.exports = AnimeGenreSchema
