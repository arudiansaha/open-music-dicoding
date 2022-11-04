class PlaylistHandler {
  constructor(playlistService, userService, songService, validator) {
    this._playlistService = playlistService;
    this._userService = userService;
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

    await this._playlistService.verifyPlaylistOwner(id, credentialId);
    await this._songService.verifySongById(songId);
    await this._playlistService.addSongIntoPlaylist(id, songId);

    const response = h.response({
      status: 'success',
      message: 'Song berhasil ditambahkan ke playlist',
    });

    response.code(201);
    return response;
  }

  async getAllPlaylistsHandler(request) {
    const { id: credentialId } = request.auth.credentials;

    const username = await this._userService.getUsernameById(credentialId);
    const playlists = await this._playlistService.getAllPlaylists(credentialId, username);

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

    await this._playlistService.verifyPlaylistOwner(id, credentialId);

    const username = await this._userService.getUsernameById(credentialId);
    const playlist = await this._playlistService.getPlaylistById(id, username);
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

    await this._playlistService.verifyPlaylistOwner(id, credentialId);
    await this._songService.verifySongById(songId);
    await this._playlistService.deleteSongInPlaylist(id, songId);

    return {
      status: 'success',
      message: 'Song berhasil dihapus dari playlist',
    };
  }

  async deletePlaylistByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistService.verifyPlaylistOwner(id, credentialId);
    await this._playlistService.deletePlaylistById(id);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }
}

module.exports = PlaylistHandler;
