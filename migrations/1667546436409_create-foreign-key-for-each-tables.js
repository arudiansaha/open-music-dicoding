exports.up = (pgm) => {
  pgm.addConstraint(
    'songs',
    'fk_songs.albumId_albums.id',
    'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE',
  );

  pgm.addConstraint(
    'playlists',
    'fk_playlists.owner_users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE',
  );

  pgm.addConstraint(
    'playlist_songs',
    'fk_playlistSongs.playlistId_playlists.id',
    'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE',
  );
  pgm.addConstraint(
    'playlist_songs',
    'fk_playlistSongs.songId_songs.id',
    'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE',
  );

  pgm.addConstraint(
    'collaborations',
    'fk_collaborations.playlistId_playlists.id',
    'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE',
  );
  pgm.addConstraint(
    'collaborations',
    'fk_collaborations.userId_users.id',
    'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE',
  );

  pgm.addConstraint(
    'playlist_song_activities',
    'fk_playlistSongActivities.playlistId_playlists.id',
    'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint(
    'songs',
    'fk_songs.albumId_albums.id',
  );

  pgm.dropConstraint(
    'playlists',
    'fk_playlists.owner_users.id',
  );

  pgm.dropConstraint(
    'playlist_songs',
    'fk_playlistSongs.playlistId_playlists.id',
  );
  pgm.dropConstraint(
    'playlist_songs',
    'fk_playlistSongs.songId_songs.id',
  );

  pgm.dropConstraint(
    'collaborations',
    'fk_collaborations.playlistId_playlists.id',
  );
  pgm.dropConstraint(
    'collaborations',
    'fk_collaborations.userId_users.id',
  );

  pgm.dropConstraint(
    'playlist_song_activities',
    'fk_playlistSongActivities.playlistId_playlists.id',
  );
};
