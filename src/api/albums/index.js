const AlbumHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'album',
  version: '1.0.1',
  register: async (server, {
    albumService,
    songService,
    storageService,
    validator,
  }) => {
    const albumHandler = new AlbumHandler(
      albumService,
      songService,
      storageService,
      validator,
    );
    server.route(routes(albumHandler));
  },
};
