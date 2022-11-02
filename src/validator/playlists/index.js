const PlaylistPayloadSchema = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const playlistValidator = {
  validatePlaylistVPayload: (payload) => {
    const validationResult = PlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error);
    }
  },
};

module.exports = playlistValidator;