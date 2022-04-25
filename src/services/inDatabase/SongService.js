const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const mapDBToModel = require('../../utils/SongUtils');

class SongService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, year, genre, performer, duration, albumId,
  }) {
    const id = nanoid(16);

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
    return result.rows.map(({ id, title, performer }) => ({ id, title, performer }));
  }

  async getSongByTitle(params) {
    const lowerParams = params.toString().toLowerCase();

    const result = await this._pool.query('SELECT * FROM songs');

    const songsTitle = result.rows.filter((s) => s.title.toString()
      .toLowerCase()
      .includes(lowerParams));

    return songsTitle.slice(0, songsTitle.length)
      .map(({ id, title, performer }) => ({ id, title, performer }));
  }

  async getSongByPerformer(params) {
    const lowerParams = params.toString().toLowerCase();

    const result = await this._pool.query('SELECT * FROM songs');

    const songsPerformer = result.rows.filter((s) => s.performer.toString()
      .toLowerCase()
      .includes(lowerParams));

    return songsPerformer.slice(0, songsPerformer.length)
      .map(({ id, title, performer }) => ({ id, title, performer }));
  }

  async getSongByTwoParams(paramsOne, paramsTwo) {
    const lowerTitle = paramsOne.toString().toLowerCase();
    const lowerPerformer = paramsTwo.toString().toLowerCase();

    const result = await this._pool.query('SELECT * FROM songs');

    const paramsResult = result.rows.filter((s) => s.title.toString()
      .toLowerCase()
      .includes(lowerTitle)
      && s.performer.toString()
        .toLowerCase()
        .includes(lowerPerformer))
      .map(({ id, title, performer }) => ({ id, title, performer }));

    return paramsResult.slice(0, paramsResult.length);
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
}

module.exports = SongService;
