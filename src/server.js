const Hapi = require('@hapi/hapi');
const album = require('./api/albums');
const song = require('./api/songs');
const AlbumService = require('./services/inMemory/AlbumService');
const SongService = require('./services/inMemory/SongService');
const albumValidator = require('./validator/albums');
const songValidator = require('./validator/songs');

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();

  const server = Hapi.server({
    port: 5000,
    host: 'localhost',
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
