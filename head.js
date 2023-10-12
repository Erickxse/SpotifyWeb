// Initialize vars
let access_token = null;
let user_id = null;
let playlistdisplayed = false;
let time_range = 'short_term';
let currentPage = 1; // Página actual
const itemsPerPage = 8; // Número de playlists por página
let playlists = []; // Almacena todas las playlists del usuario


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
        let offset = 0;
        let allPlaylists = [];

        // Función recursiva para obtener todas las playlists paginadas
        function fetchPlaylists() {
            $.ajax({
                url: 'https://api.spotify.com/v1/me/playlists',
                headers: {
                    'Authorization': 'Bearer ' + access_token,
                },
                data: {
                    limit: 50, // Número de playlists por página (máximo permitido)
                    offset: offset // Página actual
                },
                success: function(response) {
                    const playlistsOnPage = response.items.filter(item => item.tracks.total <= 100);
                    allPlaylists = allPlaylists.concat(playlistsOnPage);

                    // Si hay más playlists, realiza una solicitud recursiva
                    if (response.next) {
                        offset += 50; // Avanza a la siguiente página
                        fetchPlaylists();
                    } else {
                        // Cuando se hayan obtenido todas las playlists, muestra las primeras 8
                        playlists = allPlaylists; // Actualiza la lista de playlists
                        
                        // Asigna identificadores únicos temporales a las playlists
                        playlists.forEach((playlist, index) => {
                            playlist.id = 'playlist-' + index;
                        });


                        displayPlaylists(currentPage);
                        // Control de visibilidad de los botones de paginación
                        $('#previous-button').prop('disabled', currentPage === 1);
                        $('#next-button').prop('disabled', currentPage * itemsPerPage >= playlists.length);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    handleApiError(jqXHR.status);
                },
            });
        }

        // Comienza la recuperación de playlists
        fetchPlaylists();
    } else {
        alert('Please log in to Spotify.');
    }
}


// Función para mostrar un conjunto de playlists en la página actual
function displayPlaylists(page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pagePlaylists = playlists.slice(startIndex, endIndex);

    // Limpia el contenedor de las playlists
    $('#playlist-container').empty();

    // Genera el HTML para mostrar las playlists y los enlaces dinámicos
    pagePlaylists.forEach((item, i) => {
        let playlistName = item.name;
        let playlistUrl = item.external_urls.spotify;
        let playlistImage = (item.images.length > 0) ? item.images[0].url : 'placeholder-url.jpg';

        const playlistHtml = '<div class="column wide playlist item">' +
            // Agrega un enlace dinámico con el identificador único de la playlist
            '<a href="rounds.html?id=' + item.id + '"><img src="' + playlistImage + '"></a>' +
            '<h4>' + (startIndex + i + 1) + '. ' + playlistName + '</h4>' +
            '</div>';

        $('#playlist-container').append(playlistHtml);
    });
}

function getPlaylistInfo(playlistId) {
    const apiUrl = `https://api.spotify.com/v1/playlists/${playlistId}`;

    // Agrega el token de autorización en los encabezados de la solicitud
    const headers = {
        'Authorization': 'Bearer ' + access_token
    };

    $.ajax({
        url: apiUrl,
        headers: headers,
        success: function(response) {
            // Accede a la URL de la imagen de portada y el nombre de la playlist
            const coverUrl = response.images[0].url; // Suponiendo que la playlist tiene al menos una imagen de portada
            const playlistName = response.name;

            // Actualiza la imagen de portada y el nombre en el HTML
            $('#playlist-cover').attr('src', coverUrl);
            $('#playlist-name').text(playlistName);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // Maneja los errores de la solicitud
            console.error('Error al obtener información de la playlist:', errorThrown);
        },
    });
}

function enableControls() {
    $('#instructions, #login').css('display', 'none');
    $('#button-segment, #timeForm, #numForm').removeClass("disabled");
}

function disableControls() {
    $('#button-segment, #track-button, #artist-button, #timeForm, #numForm').addClass("disabled");
}

// Evento para avanzar a la siguiente página
$('#next-button').on('click', function() {
    currentPage++;
    displayPlaylists(currentPage);

    // Control de visibilidad de los botones de paginación
    $('#previous-button').prop('disabled', false);
    $('#next-button').prop('disabled', currentPage * itemsPerPage >= playlists.length);
});

// Evento para retroceder a la página anterior
$('#previous-button').on('click', function() {
    currentPage--;
    displayPlaylists(currentPage);

    // Control de visibilidad de los botones de paginación
    $('#previous-button').prop('disabled', currentPage === 1);
    $('#next-button').prop('disabled', false);
});



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

    // Obtén la ID de la playlist de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const playlistId = urlParams.get('id');

    // Llama a la función para obtener la información de la playlist
    if (playlistId) {
        getPlaylistInfo(playlistId);
    }
});
