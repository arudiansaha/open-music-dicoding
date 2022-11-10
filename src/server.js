require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');

const album = require('./api/albums');
const AlbumService = require('./services/inDatabase/AlbumService');
const StorageService = require('./services/storage/StorageService');
const CacheService = require('./services/cache/CacheService');
const albumValidator = require('./validator/albums');

const song = require('./api/songs');
const SongService = require('./services/inDatabase/SongService');
const songValidator = require('./validator/songs');

const playlist = require('./api/playlists');
const PlaylistService = require('./services/inDatabase/PlaylistService');
const playlistValidator = require('./validator/playlists');

const collaboration = require('./api/collaborations');
const CollaborationService = require('./services/inDatabase/CollaborationService');
const collaborationValidator = require('./validator/collaborations');

const user = require('./api/users');
const UserService = require('./services/inDatabase/UserService');
const userValidator = require('./validator/users');

const authentication = require('./api/authentications');
const AuthenticationService = require('./services/inDatabase/AuthenticationService');
const TokenManager = require('./tokenize/TokenManager');
const authenticationValidator = require('./validator/authentications');

const _export = require('./api/exports');
const ProducerService = require('./services/mesageBroker/ProducerService');
const exportValidator = require('./validator/exports');

const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const cacheService = new CacheService();
  const albumService = new AlbumService(cacheService);
  const storageService = new StorageService(path.resolve(__dirname, 'api/albums/file/images'));
  const songService = new SongService();
  const collaborationService = new CollaborationService();
  const playlistService = new PlaylistService(collaborationService);
  const userService = new UserService();
  const authenticationService = new AuthenticationService();

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
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy('playlist_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: album,
      options: {
        albumService,
        songService,
        storageService,
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
        playlistService,
        songService,
        validator: playlistValidator,
      },
    },
    {
      plugin: collaboration,
      options: {
        collaborationService,
        playlistService,
        userService,
        validator: collaborationValidator,
      },
    },
    {
      plugin: user,
      options: {
        service: userService,
        validator: userValidator,
      },
    },
    {
      plugin: authentication,
      options: {
        authenticationService,
        userService,
        tokenManager: TokenManager,
        validator: authenticationValidator,
      },
    },
    {
      plugin: _export,
      options: {
        exportService: ProducerService,
        playlistService,
        validator: exportValidator,
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
      console.log(newResponse);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada: ${server.info.uri}`);
};

init();
