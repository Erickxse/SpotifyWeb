document.addEventListener("DOMContentLoaded", async () => {
    // Obtener el token de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    // Verificar si se proporcionó un código de autorización en la URL
    if (code) {
        try {
            // Obtener el token de acceso utilizando el código de autorización
            const result = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `grant_type=authorization_code&code=${code}&redirect_uri=https://quiet-rabanadas-52e0a4.netlify.app/login&client_id=970017726a0d4148a54e8887d5985452&client_secret=6969761aaa164e60bddd6ef1d49a7f25`,
            });
            const data = await result.json();
            const accessToken = data.access_token;

            // Utilizar el token para acceder a las funciones de la API de Spotify

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
        } catch (error) {
            console.error("Error al obtener el token de acceso:", error);
        }
    } else {
        // Si no se proporcionó un código de autorización en la URL, muestra un mensaje de error
        console.error("Error: No se proporcionó un código de autorización en la URL");
    }
});
