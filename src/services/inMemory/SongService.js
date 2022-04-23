const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongService {
  constructor() {
    this._song = [];
  }

  addSong({
    title, year, genre, performer, duration, albumId,
  }) {
    const id = nanoid(16);
    const newSong = {
      id, title, year, genre, performer, duration, albumId,
    };

    this._song.push(newSong);

    const isSuccess = this._song.filter((s) => s.id === id).length > 0;

    if (!isSuccess) {
      throw new InvariantError('Song gagal ditambahkan');
    }

    return id;
  }

  getAllSongs() {
    const songs = this._song.map(({ id, title, performer }) => ({ id, title, performer }));
    return songs;
  }

  getSongById(id) {
    const song = this._song.filter((s) => s.id === id)[0];

    if (!song) {
      throw new NotFoundError('Song tidak ditemukan');
    }

    return song;
  }

  editSongById(id, {
    title, year, genre, performer, duration,
  }) {
    const i = this._song.findIndex((s) => s.id === id);

    if (i === -1) {
      throw new NotFoundError('Gagal memperbarui song. Id tidak ditemukan');
    }

    this._song[i] = {
      ...this._song[i],
      title,
      year,
      genre,
      performer,
      duration,
    };
  }

  deleteSongById(id) {
    const i = this._song.findIndex((s) => s.id === id);

    if (i === -1) {
      throw new NotFoundError('Song gagal dihapus. Id tidak ditemukan');
    }

    this._song.splice(i, 1);
  }
}

module.exports = SongService;
