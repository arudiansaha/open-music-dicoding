require('dotenv').config();

const Hapi = require('@hapi/hapi');

const album = require('./api/albums');
const AlbumService = require('./services/inDatabase/AlbumService');
const albumValidator = require('./validator/albums');

const song = require('./api/songs');
const SongService = require('./services/inDatabase/SongService');
const songValidator = require('./validator/songs');

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: album,
      options: {
        albumService,
        songService,
        validator: albumValidator,
      },
    },
    {
      plugin: song,
      options: {
        service: songService,
        validator: songValidator,
      },
    },
  ]);

  await server.start();
  /* eslint-disable */
  console.log(`Server berjalan pada: ${server.info.uri}`);
  /* eslint-disable */
};

init();
