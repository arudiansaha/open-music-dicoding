const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const {
  mapDBToModel,
  mapDBToIDTitlePerformerModel,
} = require('../../utils/SongUtils');

class SongService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, year, genre, performer, duration, albumId,
  }) {
    const id = `song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Song gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAllSongs() {
    const result = await this._pool.query('SELECT * FROM songs');
    return result.rows.map(mapDBToIDTitlePerformerModel);
  }

  async getSongByTitle(titleParams) {
    const titleToLowerCase = titleParams.toString().toLowerCase();

    const result = await this._pool.query('SELECT * FROM songs');

    const songs = result.rows.filter((s) => (
      s.title.toString().toLowerCase().includes(titleToLowerCase)
    ));

    if (!result.rows.length) {
      throw new NotFoundError('Song tidak ditemukan');
    }

    const slicedSongs = songs.slice(0, songs.length);

    return slicedSongs.map(mapDBToIDTitlePerformerModel);
  }

  async getSongByPerformer(performerParams) {
    const performerToLowerCase = performerParams.toString().toLowerCase();

    const result = await this._pool.query('SELECT * FROM songs');

    const songs = result.rows.filter((s) => (
      s.performer.toString().toLowerCase().includes(performerToLowerCase)
    ));

    if (!result.rows.length) {
      throw new NotFoundError('Song tidak ditemukan');
    }

    const slicedSongs = songs.slice(0, songs.length);

    return slicedSongs.map(mapDBToIDTitlePerformerModel);
  }

  async getSongByTitleAndPerformer(titleParams, performerParams) {
    const titleToLowerCase = titleParams.toString().toLowerCase();
    const performerToLowerCase = performerParams.toString().toLowerCase();

    const result = await this._pool.query('SELECT * FROM songs');

    const songs = result.rows.filter((s) => (
      s.title.toString().toLowerCase().includes(titleToLowerCase)
      && s.performer.toString().toLowerCase().includes(performerToLowerCase)
    )).map(mapDBToIDTitlePerformerModel);

    if (!result.rows.length) {
      throw new NotFoundError('Song tidak ditemukan');
    }

    return songs.slice(0, songs.length);
  }

  async getSongByAlbumId(idParams) {
    const query = {
      text: 'SELECT * FROM songs WHERE album_id = $1',
      values: [idParams],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === undefined) {
      throw new NotFoundError('Song tidak ditemukan');
    }

    return result.rows.map(mapDBToIDTitlePerformerModel);
  }

  async getSongByPlaylistId(playlistId) {
    const query = {
      text: 'SELECT * FROM songs WHERE id IN (SELECT song_id FROM playlist_songs WHERE playlist_id = $1)',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Song tidak ditemukan');
    }

    return result.rows.map(mapDBToIDTitlePerformerModel);
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Song tidak ditemukan');
    }

    return result.rows.map(mapDBToModel)[0];
  }

  async editSongById(id, {
    title, year, genre, performer, duration, albumId,
  }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui song. Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Song gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifySongById(id) {
    const query = {
      text: 'SELECT id FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Song tidak ditemukan');
    }
  }
}

module.exports = SongService;
