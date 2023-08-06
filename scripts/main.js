document.addEventListener("DOMContentLoaded", async () => {
    // Obtener el token de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("token");

    // Verificar si se proporcionó un token en la URL
    if (accessToken) {
        // Mostrar el token en el elemento HTML correspondiente
        const tokenElement = document.getElementById("token");
        tokenElement.textContent = accessToken;

        // Obtener las playlists del usuario utilizando el módulo APIController
        const playlists = await window.APIController.getPlaylists();

        // Mostrar las listas de reproducción en el DOM (por ejemplo, en un elemento con el id "playlist-container")
        const playlistContainer = document.getElementById("playlist-container");
        playlists.forEach((playlist) => {
            const playlistItem = document.createElement("li");
            playlistItem.textContent = playlist.name;
            playlistContainer.appendChild(playlistItem);
        });
    } else {
        // Si no se proporcionó un token en la URL, muestra un mensaje de error
        console.error("Error: No se proporcionó un token en la URL");
    }
});
