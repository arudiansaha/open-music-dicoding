const mapDBToModel = ({
  username, title, action, time,
}) => ({
  username, title, action, time,
});

const mapDBToIdNameUsernameModel = ({ id, name, username }) => ({ id, name, username });

module.exports = { mapDBToModel, mapDBToIdNameUsernameModel };
