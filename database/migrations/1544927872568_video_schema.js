'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class VideoSchema extends Schema {
  up () {
    this.create('videos', (table) => {
      table.increments()
      table.string('episode', 10)
      table.string('video_embeded', 255)
      table.integer('id_anime')
      table.timestamps()
    })
  }

  down () {
    this.drop('videos')
  }
}

module.exports = VideoSchema
