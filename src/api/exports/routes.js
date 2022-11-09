const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/playlists/{playlistId}',
    handler: (request, h) => handler.postExportPlaylistHanlder(request, h),
    options: {
      auth: 'playlist_jwt',
    },
  },
];

module.exports = routes;
