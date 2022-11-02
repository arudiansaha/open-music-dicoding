require('dotenv').config();

const Hapi = require('@hapi/hapi');

const album = require('./api/albums');
const AlbumService = require('./services/inDatabase/AlbumService');
const albumValidator = require('./validator/albums');

const song = require('./api/songs');
const SongService = require('./services/inDatabase/SongService');
const songValidator = require('./validator/songs');

const playlist = require('./api/playlists');
const PlaylistService = require('./services/inDatabase/PlaylistService');
const playlistValidator = require('./validator/playlists');

const user = require('./api/users');
const UserService = require('./services/inDatabase/UserService');
const userValidator = require('./validator/users');

const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const albumService = new AlbumService();
  const songService = new SongService();
  const playlistService = new PlaylistService();
  const userService = new UserService();

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
    {
      plugin: playlist,
      options: {
        service: playlistService,
        validator: playlistValidator,
      },
    },
    {
      plugin: user,
      options: {
        service: userService,
        validator: userValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });

        newResponse.code(response.statusCode);
        return newResponse;
      }

      if (!response.isServer) {
        return h.continue;
      }

      const newResponse = h.response({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
      });

      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  /* eslint-disable */
  console.log(`Server berjalan pada: ${server.info.uri}`);
  /* eslint-disable */
};

init();
