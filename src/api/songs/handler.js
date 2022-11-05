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
    const params = request.query;

    const hasProperty = Object.prototype.hasOwnProperty;

    const isTitleParams = hasProperty.call(params, 'title');
    const isPerformerParams = hasProperty.call(params, 'performer');

    if (isTitleParams && isPerformerParams) {
      const sortByTwoParams = await this._service
        .getSongByTitleAndPerformer(params.title, params.performer);

      return {
        status: 'success',
        data: {
          songs: sortByTwoParams,
        },
      };
    }

    if (isTitleParams) {
      const songSortByTitle = await this._service.getSongByTitle(params.title);

      return {
        status: 'success',
        data: {
          songs: songSortByTitle,
        },
      };
    }

    if (isPerformerParams) {
      const songSortByPerformer = await this._service.getSongByPerformer(params.performer);

      return {
        status: 'success',
        data: {
          songs: songSortByPerformer,
        },
      };
    }

    const songs = await this._service.getAllSongs();

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

    await this._service.editSongById(id, request.payload);

    return {
      status: 'success',
      message: 'Song berhasil diperbarui',
    };
  }

  async deleteSongHandler(request) {
    const { id } = request.params;

    await this._service.deleteSongById(id);

    return {
      status: 'success',
      message: 'Song berhasil dihapus',
    };
  }
}

module.exports = SongHandler;
