'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('welcome')
// Route.get('/anime', 'AnimeController.index')
// Route.get('/anime/:id', 'AnimeController.detail')
// Route.post('/anime', 'AnimeController.store')

// Route.get('/genre', 'GenreController.index')
// Route.get('/genre/:id', 'GenreController.index')

// Route.get('/series', 'SeriesController.index')
// Route.get('/series/:id', 'AnimeController.select_series')

Route.group( () => {
    Route. get('anime/', 'AnimeController.index')
}).prefix('api/v1') 