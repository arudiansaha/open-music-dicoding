const UserPayloadSchema = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const userValidator = {
  validateUserPayload: (payload) => {
    const validationResult = UserPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = userValidator;
