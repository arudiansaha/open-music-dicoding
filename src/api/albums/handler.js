class AlbumHandler {
  constructor(albumService, songService, storageService, validator) {
    this._albumService = albumService;
    this._songService = songService;
    this._storageService = storageService;
    this._validator = validator;
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);

    const { name, year } = request.payload;
    const albumId = await this._albumService.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    });

    response.code(201);
    return response;
  }

  async postUploadImageHandler(request, h) {
    const { cover } = request.payload;
    const { id } = request.params;

    this._validator.validateImageHeader(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/albums/${id}/images/${filename}`;

    await this._albumService.addAlbumCover(id, coverUrl);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });

    response.code(201);
    return response;
  }

  async getAlbumHandler(request) {
    const { id } = request.params;
    const album = await this._albumService.getAlbum(id);
    const songs = await this._songService.getSongByAlbumId(id);

    return {
      status: 'success',
      data: {
        album: {
          ...album,
          songs: [...songs],
        },
      },
    };
  }

  async putAlbumHandler(request) {
    this._validator.validateAlbumPayload(request.payload);

    const { id } = request.params;
    await this._albumService.editAlbum(id, request.payload);

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumHandler(request) {
    const { id } = request.params;
    await this._albumService.deleteAlbum(id);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }
}

module.exports = AlbumHandler;
