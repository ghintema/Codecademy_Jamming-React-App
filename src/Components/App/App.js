import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar.js';
import SearchResult from '../SearchResult/SearchResult.js';
import Playlist from '../Playlist/Playlist.js';
import Spotify from '../../util/Spotify.js'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this); 
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.state = {searchResult: [],
                  playlistName:'New Playlist',
                  playlistTracks: []}
  }

  addTrack (newTrack) {
    if (this.state.playlistTracks.find((track) => track.id === newTrack.id)) {
      return;
    } else { 
      this.setState({playlistName: this.state.playlistTracks.push(newTrack)});
    } 
  }

  removeTrack(removeTrack) {
    let trackList = this.state.playlistTracks;
    trackList = trackList.filter((track) => track.id !== removeTrack.id) // all tracks with track.id !== removeTrack.id remain in trackList
    this.setState({playlistTracks: trackList});

    // const index = this.state.playlistTracks.findIndex(track => track.id === removeTrack.id); // finding the index of the track to be removed;
    // this.setState({playlistTracks: this.state.playlistTracks.splice(index, 1)}) // deleting one element from index on;
  }

  updatePlaylistName(newName) {
    this.setState({playlistName: {newName}})
  }
 
  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri)
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      })
    })
  }

  search(term) { 
    Spotify.search(term).then(searchResult => {
      this.setState({searchResult: searchResult})});
    }
  

  render() { 
    return ( 
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResult searchResult={this.state.searchResult} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName} 
                      playlistTracks={this.state.playlistTracks} 
                      onRemove={this.removeTrack} 
                      onNameChange={this.updatePlaylistName} 
                      onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
     );
  }
}
 
export default App;

