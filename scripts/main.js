require('dotenv').config();
// Esperar a que el documento esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    // URL de la API de Spotify para obtener las playlists del usuario
    const apiURL = "https://api.spotify.com/v1/me/playlists";

    // Token de acceso de Spotify (debes obtenerlo mediante el proceso de autorización)
    const accessToken = process.env.SPOTIFY_ACCESS_TOKEN;

    // Configuración de la solicitud a la API de Spotify
    const headers = {
        Authorization: `Bearer ${accessToken}`,
    };

    // Realizar la solicitud a la API de Spotify para obtener las playlists del usuario
    axios.get(apiURL, { headers })
        .then((response) => {
            // Obtener las playlists del usuario desde la respuesta de la API
            const playlists = response.data.items;

            // Obtener el elemento del DOM donde queremos mostrar las playlists
            const playlistContainer = document.getElementById("playlist-container");

            // Crear un elemento de lista para cada playlist y mostrarlo en el DOM
            playlists.forEach((playlist) => {
                const playlistItem = document.createElement("li");
                playlistItem.textContent = playlist.name;
                playlistContainer.appendChild(playlistItem);
            });
        })
        .catch((error) => {
            console.error("Error al obtener las playlists:", error);
        });
});
