// Initialize vars
let access_token = null;
let user_id = null;
let playlistdisplayed = false;
let time_range = 'short_term';
let limit = '20';

// Authorization
function authorize() {
    const client_id = '970017726a0d4148a54e8887d5985452';
    const redirect_uri = 'https://quiet-rabanadas-52e0a4.netlify.app/login';
    const scopes = 'playlist-read-private playlist-read-collaborative playlist-read';

    let url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(client_id);
    url += '&scope=' + encodeURIComponent(scopes);
    url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
    window.location = url;
}

function getHashValue(key) {
    if (typeof key !== 'string') {
        key = '';
    } else {
        key = key.toLowerCase();
    }
    const keyAndHash = location.hash.match(new RegExp(key + '=([^&]*)'));
    const value = keyAndHash ? keyAndHash[1] : '';
    return value;
}

function getUserId() {
    if (access_token) {
        $.ajax({
            url: 'https://api.spotify.com/v1/me',
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function(response) {
                user_id = response.id;
                enableControls();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                handleApiError(jqXHR.status);
            },
        });
    } else {
        alert('Please log in to Spotify.');
    }
}

function getPlaylists() {
    const limit = 20; // Número de resultados por página
    let offset = 0; // Offset inicial (página 1)

    function fetchPlaylists() {
        // Realiza una solicitud a la API de Spotify con el offset actual
        $.ajax({
            url: `https://api.spotify.com/v1/me/playlists?limit=${limit}&offset=${offset}`,
            headers: {
                'Authorization': 'Bearer ' + access_token,
            },
            success: function(response) {
                // Procesa los resultados aquí (agrega a tu lista de reproducción, etc.)
                // ...

                // Verifica si hay más páginas de resultados
                if (response.next) {
                    // Si hay más páginas, actualiza el offset y obtén la siguiente página
                    offset += limit;
                    fetchPlaylists();
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                handleApiError(jqXHR.status);
            },
        });
    }

    $('#playlist-button').addClass("loading");

    if (access_token) {
        // Inicia la obtención de listas de reproducción
        fetchPlaylists();
    } else {
        alert('Please log in to Spotify.');
    }
}



function handleApiError(error) {
    $('#playlist-button').removeClass("loading");
    $('#results').html('<p>Error retrieving data from Spotify API. Please try again later.</p>');
}

$(document).ready(function() {
    access_token = getHashValue('access_token');
    
    $('#playlist-button').on('click', function() {
        getPlaylists();
    });

    if (access_token) {
        getUserId();
    } else {
        disableControls();
    }
});

function enableControls() {
    $('#instructions, #login').css('display', 'none');
    $('#button-segment, #timeForm, #numForm').removeClass("disabled");
}

function disableControls() {
    $('#button-segment, #track-button, #artist-button, #timeForm, #numForm').addClass("disabled");
}
