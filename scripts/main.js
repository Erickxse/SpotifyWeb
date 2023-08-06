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
    const accessToken = "AQCdSMgowlw-IW1CORtB4DQwt83vrt_ZVbOWQksoGPDUYqXgLI_ZpMhjqmkql3ZmebRfoORhtiJxjuhK2wysl9Mqi5Hfmz4mOGoCYTlF1jH-uojz5O0SCesdBBOztHI_ISXhg7lbhwbMvEFyGBA1bOS0Ve8C-fTyxqhGMItBXBobp2buO1pdHzA4Tf0Q8X_0wrml8GquRu1Gfsa2guJFCCQ17vJsCD-ftRjaW4muOXlo0Hs6L_Nk6gZxngs0CXE9_YwjobuFofpKlKEgG4I2KKaw0J_99RAwaVv-QUzpfSP1";


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
