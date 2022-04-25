require('dotenv').config();

const Hapi = require('@hapi/hapi');
const album = require('./api/albums');
const song = require('./api/songs');
// const AlbumService = require('./services/inMemory/AlbumService');
// const SongService = require('./services/inMemory/SongService');
const AlbumService = require('./services/inDatabase/AlbumService');
const SongService = require('./services/inDatabase/SongService');
const albumValidator = require('./validator/albums');
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
        service: albumService,
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
  console.log(`Server berjalan pada: ${server.info.uri}`);
};

init();
