// Initialize vars
let access_token = null;
let user_id = null;
let playlistdisplayed = false;
let time_range = 'short_term';
let currentPage = 1;
const playlistsPerPage = 4; // Número de listas de reproducción por página
let playlists = [];


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
    $('#playlist-button').addClass("loading");

    if (access_token) {
        $.ajax({
            url: 'https://api.spotify.com/v1/me/playlists',
            headers: {
                'Authorization': 'Bearer ' + access_token,
            },
            success: function(response) {
                $('#playlist-button').removeClass("loading");
                // Obtén una referencia al contenedor de listas de reproducción
                const playlistContainer = $('#playlist-container');
                playlistContainer.empty(); // Limpia cualquier contenido anterior

                if (response.items.length === 0) {
                    // Si no se encontraron listas de reproducción
                    playlistContainer.html('<p>No playlists found.</p>');
                } else {
                    // Genera el HTML para mostrar las listas de reproducción
                    let resultsHtml = '';
                    response.items.forEach((item, i) => {
                        let playlistName = item.name;
                        let playlistUrl = item.external_urls.spotify;
                        let playlistImage = (item.images.length > 0) ? item.images[0].url : 'placeholder-url.jpg';

                        resultsHtml += '<div class="column wide playlist item">';
                        resultsHtml += '<a href="' + playlistUrl + '" target="_blank"><img src="' + playlistImage + '"></a>';
                        resultsHtml += '<h4>' + (i + 1) + '. ' + playlistName + '</h4>';
                        resultsHtml += '</div>';
                    });

                    // Agrega el HTML generado al contenedor de listas de reproducción
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

    // Llama a la función para mostrar las listas de reproducción
    displayPlaylists(playlists, currentPage);

    // Llama a la función para manejar la paginación
    handlePagination();
}

// Función para mostrar las listas de reproducción en la página actual
function displayPlaylists(playlists, page) {
    const start = (page - 1) * playlistsPerPage;
    const end = start + playlistsPerPage;
    const playlistsToDisplay = playlists.slice(start, end);

    // Genera el HTML para las listas de reproducción a mostrar
    let resultsHtml = '';
    playlistsToDisplay.forEach((item, i) => {
        // Código para generar cada elemento de lista de reproducción (similar al existente)
    });

    // Agrega el HTML generado al contenedor de listas de reproducción
    $('#playlist-container').html(resultsHtml);
}

// Función para manejar el cambio de página
function handlePagination() {
    $('#prev-page').on('click', function() {
        if (currentPage > 1) {
            currentPage--;
            displayPlaylists(playlists, currentPage);
        }
    });

    $('#next-page').on('click', function() {
        const totalPages = Math.ceil(playlists.length / playlistsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayPlaylists(playlists, currentPage);
        }
    });
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
