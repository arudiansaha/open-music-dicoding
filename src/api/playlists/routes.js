const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: (request, h) => handler.postPlaylistHandler(request, h),
    options: {
      auth: 'playlist_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: (request, h) => handler.getAllPlaylistsHandler(request, h),
    options: {
      auth: 'playlist_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}',
    handler: (request, h) => handler.deletePlaylistByIdHandler(request, h),
    options: {
      auth: 'playlist_jwt',
    },
  },
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: (request, h) => handler.postSongIntoPlaylistHandler(request, h),
    options: {
      auth: 'playlist_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: (request, h) => handler.getAllSongsInPlaylistHandler(request, h),
    options: {
      auth: 'playlist_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: (request, h) => handler.deleteSongInPlaylistHandler(request, h),
    options: {
      auth: 'playlist_jwt',
    },
  },
];

module.exports = routes;
