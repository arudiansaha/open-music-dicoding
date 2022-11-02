const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: handler.postPlaylistHandler,
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: handler.getAllPlaylistsHandler,
  },
  {
    method: 'DELETE',
    path: '/playlists',
    handler: handler.deletePlaylistByIdHandler,
  },
];

module.exports = routes;
