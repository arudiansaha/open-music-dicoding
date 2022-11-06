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
    const id = `song-${nanoid(16)}`;
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

    if (!songs) {
      throw new NotFoundError('Song tidak ditemukan');
    }

    return songs;
  }

  getSongByTitle(titleParams) {
    const titleToLowerCase = titleParams.toString().toLowerCase();

    const songs = this._song.filter((s) => (
      s.title.toString().toLowerCase().includes(titleToLowerCase)
    ));

    if (!songs) {
      throw new NotFoundError('Song tidak ditemukan');
    }

    const slicedSongs = songs.slice(0, songs.length);

    return slicedSongs.map(({ id, title, performer }) => ({ id, title, performer }));
  }

  getSongByPerformer(performerParams) {
    const performerToLowerCase = performerParams.toString().toLowerCase();

    const songs = this._song.filter((s) => (
      s.performer.toString().toLowerCase().includes(performerToLowerCase)
    ));

    if (!songs) {
      throw new NotFoundError('Song tidak ditemukan');
    }

    const slicedSongs = songs.slice(0, songs.length);

    return slicedSongs.map(({ id, title, performer }) => ({ id, title, performer }));
  }

  getSongByTitleAndPerformer(titleParams, performerParams) {
    const titleToLowerCase = titleParams.toString().toLowerCase();
    const performerToLowerCase = performerParams.toString().toLowerCase();

    const songs = this._song.filter((s) => (
      s.title.toString().toLowerCase().includes(titleToLowerCase)
      && s.performer.toString().toLowerCase().includes(performerToLowerCase)
    )).map(({ id, title, performer }) => ({ id, title, performer }));

    if (!songs) {
      throw new NotFoundError('Song tidak ditemukan');
    }

    return songs.slice(0, songs.length);
  }

  getSongByAlbumId(idParams) {
    const songs = this._song.filter((s) => s.albumId === idParams);

    if (!songs) {
      throw new NotFoundError('Song tidak ditemukan');
    }

    return songs.map(({ id, title, performer }) => ({ id, title, performer }));
  }

  getSongById(id) {
    const songs = this._song.filter((s) => s.id === id)[0];

    if (!songs) {
      throw new NotFoundError('Song tidak ditemukan');
    }

    return songs;
  }

  editSong(id, {
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

  deleteSong(id) {
    const i = this._song.findIndex((s) => s.id === id);

    if (i === -1) {
      throw new NotFoundError('Song gagal dihapus. Id tidak ditemukan');
    }

    this._song.splice(i, 1);
  }
}

module.exports = SongService;
