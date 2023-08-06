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
    const accessToken = "AQDVwX_OszbiDPVqGoCcsUW-L_rX0ZBhNPb80OZtudrFq_QiMi8z1SwOTAGUk-Tw-nobmbhE8gX0u5gdUkgsOWKz6DbR_6Hwr7MIPAH1rR2Rc9KKIoBn2g6NIjWPc-5pQAXl9Qleiq9B-xWNk7jmChOG8jJVsAH6uy-AlI9Qs4QOEpxaskK68lld2xA0fhppAkd77-buDN-l7CsjJT77xiueFGU_LDM_UHjwoZrIYPIQkaSBCkdqoGnrkb4SIia4xjzVOAhTc1lBeZb3hr9QY0IBkAlRZRE";


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
