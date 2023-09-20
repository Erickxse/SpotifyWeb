// Variables globales
let access_token = null;
let user_id = null;
let playlistdisplayed = false;
let time_range = 'short_term';
let currentPage = 1; // Página actual
const itemsPerPage = 8; // Número de playlists por página
let playlists = []; // Almacena todas las playlists del usuario
let offset = 0; // Inicializa el offset en 0

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

// Función para obtener todas las playlists del usuario
function getAllPlaylists() {
    $('#playlist-button').addClass("loading");

    if (access_token) {
        $.ajax({
            url: 'https://api.spotify.com/v1/me/playlists',
            headers: {
                'Authorization': 'Bearer ' + access_token,
            },
            data: {
                offset: offset, // Establece el offset para paginación
                limit: 50, // Establece la cantidad de playlists por página (máximo 50)
            },
            success: function(response) {
                $('#playlist-button').removeClass("loading");

                const currentPlaylists = response.items;
                playlists = playlists.concat(currentPlaylists); // Agrega las playlists actuales a la lista principal

                // Control de visibilidad de los botones de paginación
                $('#previous-button').prop('disabled', currentPage === 1);
                $('#next-button').prop('disabled', currentPlaylists.length < 50); // Si hay menos de 50, no hay más páginas

                if (currentPlaylists.length === 50) {
                    // Si hay más playlists, sigue obteniéndolas
                    offset += 50; // Incrementa el offset para la siguiente página
                    getAllPlaylists(); // Llama recursivamente para obtener la siguiente página
                } else {
                    // Todas las playlists han sido obtenidas, ahora puedes mostrarlas
                    displayPlaylists(currentPage);
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
    getAllPlaylists(); // Llama a la función para obtener todas las playlists del usuario
}


// Función para mostrar un conjunto de playlists en la página actual
function displayPlaylists(page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pagePlaylists = playlists.slice(startIndex, endIndex);

    // Limpia el contenedor de las playlists
    $('#playlist-container').empty();

    // Genera el HTML para mostrar las playlists
    pagePlaylists.forEach((item, i) => {
        let playlistName = item.name;
        let playlistUrl = item.external_urls.spotify;
        let playlistImage = (item.images.length > 0) ? item.images[0].url : 'placeholder-url.jpg';

        const playlistHtml = '<div class="column wide playlist item">' +
            '<a href="' + playlistUrl + '" target="_blank"><img src="' + playlistImage + '"></a>' +
            '<h4>' + (startIndex + i + 1) + '. ' + playlistName + '</h4>' +
            '</div>';

        $('#playlist-container').append(playlistHtml);
    });
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
});

function enableControls() {
    $('#instructions, #login').css('display', 'none');
    $('#button-segment, #timeForm, #numForm').removeClass("disabled");
}

function disableControls() {
    $('#button-segment, #track-button, #artist-button, #timeForm, #numForm').addClass("disabled");
}