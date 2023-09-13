// Initialize vars
let access_token = null;
let user_id = null;
let songsdisplayed = false;
let artistsdisplayed = false;
let playlistdisplayed = false;
let time_range = 'short_term';
let time_range_display = 'last 4 weeks';
let playlist_uris = [];
let limit = '20';

// Authorization. Key from spotify api website, must send a waypoint through their settings
// https://developer.spotify.com/documentation/general/guides/authorization-guide/
function authorize() {
    const client_id = '970017726a0d4148a54e8887d5985452';
    const redirect_uri = 'https://quiet-rabanadas-52e0a4.netlify.app/login';
    const scopes = 'playlist-read-private playlist-read-collaborative playlist-read';
  
  // Store the date
  const d = new Date();
  let date = [d.getMonth() +  1, d.getDate(), d.getFullYear()];
  date = date.join('/');
  
    // Create a Token, and finalize it
    // final result will lead to a humongous URL Link
    // with the necessary stuff
    let url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(client_id);
    url += '&scope=' + encodeURIComponent(scopes);
    url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
    // Paste the final URL format
    window.location = url;
  }