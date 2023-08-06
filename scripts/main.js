// Esperar a que el documento esté completamente cargado
document.addEventListener("DOMContentLoaded", async () => {
    // Obtener las playlists del usuario utilizando la función de app.js
    const playlists = await APIController.getPlaylists();
    // Obtener el elemento del DOM donde queremos mostrar las playlists
    const playlistContainer = document.getElementById("playlist-container");
    // URL de la API de Spotify para obtener las playlists del usuario
    const apiURL = "https://api.spotify.com/v1/me/playlists";

    // Obtener el código de autorización de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    // Token de acceso de Spotify (debes obtenerlo mediante el proceso de autorización)
    const accessToken = "AQAgbzxX-d-vlZd3ObQT1KdYwtSFtFYnkYaNfrcrdj9Z5L09ZkrPHFHiBykhRNdX5M--h8dha62fr_wZwIYtsKEwjifZbhqVj8OKVUtCvTr9_rUGhnm8HUF8lItUjjgQGWGrqmTaFMV2AupPImTPhv2brsMq4M-Hh-1CWJhXMS5EyQ4takXskf-U3MsuxS20_MNmDu4o8w3pKRY3pdvbW4JnKPekOpEy09NQ29duMNpDYrUmWuyMWPKyN5mslUI-qJQmIpEWsEhxW8-E0wxvp4QjpL_uVkI";


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
