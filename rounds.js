let access_token = null;
let user_id = null;
let playlist_id = null;
let tracks = []; // Almacena las canciones de la playlist

$(document).ready(function() {
    access_token = getHashValue('access_token');
    playlist_id = getQueryParam('playlist_id');

    if (access_token && playlist_id) {
        getPlaylistTracks(playlist_id);
    } else {
        alert('Falta el token de acceso o el ID de la playlist.');
    }
});

// Obtener el valor de un parámetro en la URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Obtener las canciones de una playlist
function getPlaylistTracks(playlistId) {
    $.ajax({
        url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
            tracks = response.items.map(item => item.track);
            startBattle();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('Error obteniendo canciones de la playlist.');
        }
    });
}

// Iniciar el enfrentamiento entre las canciones
function startBattle() {
    if (tracks.length < 2) {
        alert('La playlist no tiene suficientes canciones para un enfrentamiento.');
        return;
    }

    // Empezar la primera ronda del enfrentamiento
    battleRound(tracks);
}

// Realizar una ronda de enfrentamiento
function battleRound(tracks) {
    if (tracks.length === 1) {
        // Si solo queda una canción, es la ganadora
        $('#battle-area').html(`<h2>¡Ganador!</h2><p>${tracks[0].name} de ${tracks[0].artists[0].name}</p>`);
        return;
    }

    // Seleccionar dos canciones al azar para el enfrentamiento
    const [track1, track2] = tracks.splice(0, 2);

    // Mostrar las dos canciones para el enfrentamiento
    $('#battle-area').html(`
        <div class="track">
            <h3>${track1.name}</h3>
            <p>${track1.artists[0].name}</p>
            <button class="vote-button" data-winner="1">Votar</button>
        </div>
        <div class="track">
            <h3>${track2.name}</h3>
            <p>${track2.artists[0].name}</p>
            <button class="vote-button" data-winner="2">Votar</button>
        </div>
    `);

    // Evento de clic para los botones de voto
    $('.vote-button').on('click', function() {
        const winnerIndex = $(this).data('winner');
        const winnerTrack = winnerIndex === 1 ? track1 : track2;
        tracks.push(winnerTrack);

        // Pasar a la siguiente ronda
        battleRound(tracks);
    });
}

// Obtener el valor del token en la URL
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
