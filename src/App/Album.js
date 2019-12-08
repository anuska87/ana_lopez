import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import { Typography } from '@material-ui/core';

const styles = theme => ({
  albumContainer: {
    width: '95%',
    padding: 10,
    display: 'flex'
  },
  cover: {
    width: 180,
    height: 180,
    borderRadius: 5,
    marginRight: 10
  },
  songsContainer: {
    width: '95%',
    padding: 10,
    marginTop: 10
  }
});

class Album extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      album: {},
      songs: []
    };
  }

  async componentDidMount() {
    try {
      const albumId = this.props.match.params.id;
      const resAlbum = await fetch(`/albums/${albumId}`);
      const album = await resAlbum.json();
      const resSongs = await fetch(`/songs?album_id=${albumId}`);
      const albumSongs = await resSongs.json();
      this.setState(prevState => ({
        ...prevState,
        loading: false,
        album,
        songs: albumSongs
      }));
    } catch (err) {
      console.error('Error accediendo al servidor', err);
    }
  }

  getHoursFromSeconds = totalSeconds => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor((totalSeconds % 3600) % 60);

    const hoursToDisplay = hours > 0 ? `${hours}h ` : '';
    const minsToDisplay = minutes > 0 ? `${minutes}min ` : '';
    const secondsToDisplay = seconds > 0 ? `${seconds}s` : '';

    return hoursToDisplay + minsToDisplay + secondsToDisplay;
  };

  getAlbumDuration = songs => {
    const totalSeconds = songs.reduce((total, currentSong) => total + currentSong.seconds, 0);
    return this.getHoursFromSeconds(totalSeconds);
  };

  render() {
    const { classes } = this.props;
    const { album, songs } = this.state;
    const albumDuration = this.getAlbumDuration(songs);
    const numberOfSongs = songs.length;
    return (
      <>
        <Paper className={classes.albumContainer}>
          <img src={album.cover} className={classes.cover}></img>
          <div>
            <Typography variant="h6">{album.name}</Typography>
            <Typography variant="body2" component="p">
              de {album.artist}
            </Typography>
            <Typography variant="caption" color="textSecondary" component="p">
              {songs.length} canciones
            </Typography>
            <Typography variant="caption" color="textSecondary" component="p">
              {albumDuration}
            </Typography>
          </div>
        </Paper>
        <Paper className={classes.songsContainer}>
          <List>
            {songs.map((song, index) => (
              <>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <MusicNoteIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={song.name}
                    secondary={this.getHoursFromSeconds(song.seconds)}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="play">
                      <PlayArrowIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index !== numberOfSongs - 1 && <Divider />}
              </>
            ))}
          </List>
        </Paper>
      </>
    );
  }
}

Album.propTypes = {
  match: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Album);
