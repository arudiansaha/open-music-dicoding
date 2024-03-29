const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumService {
  constructor() {
    this._album = [];
  }

  addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const newAlbum = { id, name, year };

    this._album.push(newAlbum);

    const isSuccess = this._album.filter((a) => a.id === id).length > 0;

    if (!isSuccess) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return id;
  }

  getAlbum(id) {
    const album = this._album.filter((a) => a.id === id)[0];

    if (!album) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return album;
  }

  editAlbum(id, { name, year }) {
    const i = this._album.findIndex((a) => a.id === id);

    if (i === -1) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }

    this._album[i] = {
      ...this._album[i],
      name,
      year,
    };
  }

  deleteAlbum(id) {
    const i = this._album.findIndex((a) => a.id === id);

    if (i === -1) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }

    this._album.splice(i, 1);
  }
}

module.exports = AlbumService;
