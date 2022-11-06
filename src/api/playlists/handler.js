class PlaylistHandler {
  constructor(playlistService, songService, validator) {
    this._playlistService = playlistService;
    this._songService = songService;
    this._validator = validator;
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);

    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._playlistService.addPlaylist({ name, owner: credentialId });

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    });

    response.code(201);
    return response;
  }

  async postSongIntoPlaylistHandler(request, h) {
    this._validator.validateSongInPlaylistPayload(request.payload);

    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;

    await this._playlistService.verifyPlaylistAccess(id, credentialId);
    await this._songService.verifySongId(songId);
    await this._playlistService.addSongIntoPlaylist(id, songId);
    await this._playlistService.addPlaylistActivities(id, songId, credentialId, 'add');

    const response = h.response({
      status: 'success',
      message: 'Song berhasil ditambahkan ke playlist',
    });

    response.code(201);
    return response;
  }

  async getAllPlaylistsHandler(request) {
    const { id: credentialId } = request.auth.credentials;

    const playlists = await this._playlistService.getAllPlaylists(credentialId);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async getAllSongsInPlaylistHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistService.verifyPlaylistAccess(id, credentialId);

    const playlist = await this._playlistService.getPlaylist(id);
    const songs = await this._songService.getSongByPlaylistId(id);

    return {
      status: 'success',
      data: {
        playlist: {
          ...playlist,
          songs: [...songs],
        },
      },
    };
  }

  async deleteSongInPlaylistHandler(request) {
    this._validator.validateSongInPlaylistPayload(request.payload);

    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;

    await this._playlistService.verifyPlaylistAccess(id, credentialId);
    await this._songService.verifySongId(songId);
    await this._playlistService.deleteSongInPlaylist(id, songId);
    await this._playlistService.addPlaylistActivities(id, songId, credentialId, 'delete');

    return {
      status: 'success',
      message: 'Song berhasil dihapus dari playlist',
    };
  }

  async deletePlaylistHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistService.verifyPlaylistOwner(id, credentialId);
    await this._playlistService.deletePlaylist(id);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async getPlaylistActivitiesHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistService.verifyPlaylistOwner(id, credentialId);

    const activities = await this._playlistService.getPlaylistActivities(id);

    return {
      status: 'success',
      data: {
        playlistId: id,
        activities,
      },
    };
  }
}

module.exports = PlaylistHandler;
