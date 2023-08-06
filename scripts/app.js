const APIController = (funcion(){

    const clientId = '970017726a0d4148a54e8887d5985452';
const clientSecret = '6969761aaa164e60bddd6ef1d49a7f25';
let accessToken = '';

const _getToken = async () => {
    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
        },
        body: 'grant_type=client_credentials',
    });
    const data = await result.json();
    accessToken = data.access_token;
};

const getPlaylists = async () => {
    if (!accessToken) {
        await _getToken();
    }

    const apiURL = 'https://api.spotify.com/v1/me/playlists';
    const headers = {
        'Authorization': 'Bearer ' + accessToken,
    };

    const response = await fetch(apiURL, { headers });
    const data = await response.json();
    return data.items;
};

return {
    getPlaylists,
};
}) ();