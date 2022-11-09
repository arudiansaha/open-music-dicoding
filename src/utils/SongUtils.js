/* eslint-disable camelcase */
const mapDBToModel = ({ album_id, ...args }) => ({ ...args, albumId: album_id });

const mapDBToIDTitlePerformerModel = ({ id, title, performer }) => ({ id, title, performer });

module.exports = { mapDBToModel, mapDBToIDTitlePerformerModel };
