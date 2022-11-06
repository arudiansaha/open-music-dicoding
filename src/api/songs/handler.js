class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);

    const {
      title, year, genre, performer, duration, albumId,
    } = request.payload;
    const songId = await this._service.addSong({
      title, year, genre, performer, duration, albumId,
    });

    const response = h.response({
      status: 'success',
      data: {
        songId,
      },
    });

    response.code(201);
    return response;
  }

  async getAllSongsHandler(request) {
    const { title, performer } = request.query;

    let songs;

    if (title && performer) {
      songs = await this._service.getSongByTitleAndPerformer(title, performer);
    } else if (title) {
      songs = await this._service.getSongByTitle(title);
    } else if (performer) {
      songs = await this._service.getSongByPerformer(performer);
    } else {
      songs = await this._service.getAllSongs();
    }

    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async getSongHandler(request) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);

    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  async putSongHandler(request) {
    this._validator.validateSongPayload(request.payload);

    const { id } = request.params;

    await this._service.editSong(id, request.payload);

    return {
      status: 'success',
      message: 'Song berhasil diperbarui',
    };
  }

  async deleteSongHandler(request) {
    const { id } = request.params;

    await this._service.deleteSong(id);

    return {
      status: 'success',
      message: 'Song berhasil dihapus',
    };
  }
}

module.exports = SongHandler;
