// Initialize vars
let access_token = null;
let user_id = null;
let playlistdisplayed = false;
let time_range = 'short_term';

let offset = 0; // Inicialmente, la paginación comienza en 0
const limit = 20; // Cantidad de resultados por página


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
        $.ajax({
            url: 'https://api.spotify.com/v1/me/playlists',
            headers: {
                'Authorization': 'Bearer ' + access_token,
            },
            data: {
                offset: offset, // Agrega el offset como parámetro
                limit: limit, // Limita la cantidad de resultados por página
            },
            success: function(response) {
                $('#playlist-button').removeClass("loading");
                const playlistContainer = $('#playlist-container');

                if (response.items.length === 0) {
                    playlistContainer.html('<p>No playlists found.</p>');
                } else {
                    let resultsHtml = '';
                    response.items.forEach((item, i) => {
                        // ... Tu código para generar HTML de listas de reproducción ...
                    });

                    playlistContainer.html(resultsHtml);

                    // Agregar botones de paginación
                    const paginationHtml = generatePaginationButtons(response.total, offset);
                    playlistContainer.append(paginationHtml);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                handleApiError(jqXHR.status);
            },
        });
    } else {
        alert('Please log in to Spotify.');
    }
}


function generatePaginationButtons(totalResults, currentOffset) {
    const totalPages = Math.ceil(totalResults / limit);
    const prevDisabled = currentOffset === 0 ? 'disabled' : '';
    const nextDisabled = currentOffset >= totalResults - limit ? 'disabled' : '';

    let paginationHtml = '<div class="pagination">';
    paginationHtml += '<button class="prev-page" ' + prevDisabled + ' onclick="loadPreviousPage()">&#8249; Previous</button>';
    paginationHtml += '<button class="next-page" ' + nextDisabled + ' onclick="loadNextPage()">&#8250; Next</button>';
    paginationHtml += '</div>';

    return paginationHtml;
}


function loadPreviousPage() {
    if (offset - limit >= 0) {
        offset -= limit;
        getPlaylists(offset);
    }
}

function loadNextPage() {
    if (offset + limit < totalResults) {
        offset += limit;
        getPlaylists(offset);
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
