// Initialize vars
let access_token = null;
let user_id = null;
let playlistdisplayed = false;
let time_range = 'short_term';
let limit = '20';
let currentOffset = 0;


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

function getPlaylists(offset) {
    $('#playlist-button').addClass("loading");

    if (access_token) {
        // Define el límite de listas de reproducción por página
        const limit = 20;

        $.ajax({
            url: 'https://api.spotify.com/v1/me/playlists',
            headers: {
                'Authorization': 'Bearer ' + access_token,
            },
            data: {
                offset: offset,
                limit: limit,
            },
            success: function(response) {
                $('#playlist-button').removeClass("loading");
                const playlistContainer = $('#playlist-container');

                if (response.items.length === 0) {
                    // Si no se encontraron listas de reproducción
                    playlistContainer.html('<p>No playlists found.</p>');
                } else {
                    let resultsHtml = '';
                    response.items.forEach((item, i) => {
                        let playlistName = item.name;
                        let playlistUrl = item.external_urls.spotify;
                        let playlistImage = (item.images.length > 0) ? item.images[0].url : 'placeholder-url.jpg';

                        resultsHtml += '<div class="column wide playlist item">';
                        resultsHtml += '<a href="' + playlistUrl + '" target="_blank"><img src="' + playlistImage + '"></a>';
                        resultsHtml += '<h4>' + (i + 1 + offset) + '. ' + playlistName + '</h4>';
                        resultsHtml += '</div>';
                    });

                    playlistContainer.html(resultsHtml);
                }

                playlistdisplayed = true;
            },
            error: function(jqXHR, textStatus, errorThrown) {
                handleApiError(jqXHR.status);
            },
        });
    } else {
        alert('Please log in to Spotify.');
    }
}

// Función para cargar la siguiente página de listas de reproducción
function loadNextPage() {
    currentOffset += limit; // Aumenta el offset para cargar la siguiente página
    getPlaylists(currentOffset);
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
