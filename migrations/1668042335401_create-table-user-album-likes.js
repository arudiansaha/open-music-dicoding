exports.up = (pgm) => {
  pgm.createTable('user_album_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    album_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint(
    'user_album_likes',
    'unique_userId_and_albumId',
    'UNIQUE(user_id, album_id)',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('user_album_likes');
};
