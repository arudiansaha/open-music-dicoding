const { nanoid } = require('nanoid');
const MusicService = require('./MusicService');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongService extends MusicService {
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

  getSongByTitle(params) {
    const lowerParams = params.toString().toLowerCase();
    const songsTitle = this._song.filter((s) => s.title.toString()
      .toLowerCase()
      .includes(lowerParams));

    return songsTitle.slice(0, songsTitle.length)
      .map(({ id, title, performer }) => ({ id, title, performer }));
  }

  getSongByPerformer(params) {
    const lowerParams = params.toString().toLowerCase();
    const songsPerformer = this._song.filter((s) => s.performer.toString()
      .toLowerCase()
      .includes(lowerParams));

    return songsPerformer.slice(0, songsPerformer.length)
      .map(({ id, title, performer }) => ({ id, title, performer }));
  }

  getSongByTwoParams(paramsOne, paramsTwo) {
    const lowerTitle = paramsOne.toString().toLowerCase();
    const lowerPerformer = paramsTwo.toString().toLowerCase();
    const params = this._song.filter((s) => s.title.toString()
      .toLowerCase()
      .includes(lowerTitle)
      && s.performer.toString()
        .toLowerCase()
        .includes(lowerPerformer)).map(({ id, title, performer }) => ({ id, title, performer }));

    return params.slice(0, params.length);
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
