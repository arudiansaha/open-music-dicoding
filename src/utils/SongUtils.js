/* eslint-disable camelcase */
const mapDBToModel = ({
  id, title, year, genre, performer, duration, album_id,
}) => ({
  id, title, year, genre, performer, duration, albumId: album_id,
});

const mapDBToIDTitlePerformerModel = ({ id, title, performer }) => ({ id, title, performer });

module.exports = { mapDBToModel, mapDBToIDTitlePerformerModel };
