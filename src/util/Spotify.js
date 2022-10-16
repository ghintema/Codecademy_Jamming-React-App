import SearchBar from "../Components/SearchBar/SearchBar";

let accessToken;

const clientID = '9d9e01553427449c8215177c77c29d57';
// const redirectURL = 'http://localhost:3000/';
const redirectURL ='https://ghintema.github.io/Codecademy_Jammming-react-app/';


const Spotify = {

    getAccessToken(){

        // if accessToken already exist, leave.
        if (accessToken) {
            return accessToken;
        }

        // if not, check url for access token
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        // if accessTokenMatch and expiresInMatch were found in the url, set and return them.
        if (accessTokenMatch && expiresInMatch) { 
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);

            window.setTimeout(() => accessToken='', expiresIn * 1000) // after expiresIn-seconds, the accesToken is reset to an empty string.
            window.history.pushState('Access Token', null, '/'); 
            return accessToken;
        } else { // if accessToken and expiresIn were NOT found in the url, redirect to spotify authorization.
            const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURL}`;
            window.location = accessURL;
        }
    },

    search(term) {
        const accessToken = Spotify.getAccessToken(); // what happens, if Spotify.getAcessToken resolves without an accessToken???
        const endpoint = `https://api.spotify.com/v1/search?type=track&q=${term}`;  
        const header = { Authorization: `Bearer ${accessToken}` } 
        return fetch( endpoint, { headers: header })
            .then(response => {return response.json();})
            .then(jsonResponse => { 
                    if (!jsonResponse) {
                        return []; // return empty array, if no search results were found.
                    }
                    return jsonResponse.tracks.items.map(track => ({ // mapping the results with our serchResult 
                        id: track.id,
                        name: track.name,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        uri: track.uri
        35            }));
                })
   },
   
    savePlaylist(playlistName, trackURIs) {
        
        if (!playlistName || !trackURIs.length) { // in case of missing data, return;
        return;
        }
        const accessToken = Spotify.getAccessToken(); // what happens, if Spotify.getAcessToken resolves without an accessToken???
        const header = { Authorization: `Bearer ${accessToken}` }; 

        let userID;
       
        return fetch('https://api.spotify.com/v1/me', { headers: header }) // fetching for userID first
            .then(response => {return response.json()})
            .then(jsonResponse => {
                userID = jsonResponse.id; // here we have userID according to accesToken
                return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, // using userID to create a new playlist
                { 
                    headers: header, 
                    method: 'POST',
                    body: JSON.stringify({name: playlistName})
                })
                    .then(response => response.json())
                    .then(jsonResponse => {
                        const playlistID = jsonResponse.id // here we have the ID of newly requested playlist
                        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, { // using playlistID to add tracks to playlist.
                            headers: header,
                            method: 'POST',
                            body: JSON.stringify({ uris: trackURIs})
                        }) 
                    })// Here could come another .then() to deal with the response of storing-request, like an alert-message. //.then(response => response.json()).then(jsonResponse => {if (jsonResponse.status === ok) {alert('successfully stored playlist'')}})
            })
   }
}


export default Spotify;