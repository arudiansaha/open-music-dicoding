const {
  PlaylistPayloadSchema,
  SongInPlaylistPayloadSchema,
} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const playlistValidator = {
  validatePlaylistPayload: (payload) => {
    const validationResult = PlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateSongInPlaylistPayload: (payload) => {
    const validationResult = SongInPlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = playlistValidator;
