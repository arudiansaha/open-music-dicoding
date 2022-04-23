const Hapi = require('@hapi/hapi');
const album = require('./api/albums');
const AlbumService = require('./services/inMemory/AlbumService');
const albumValidator = require('./validator/albums');

const init = async () => {
  const albumService = new AlbumService();

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
  ]);

  await server.start();
  console.log(`Server berjalan pada: ${server.info.uri}`);
};

init();
