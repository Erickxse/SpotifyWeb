// Importar el módulo APIController
import APIController from './app.js';
// Esperar a que el documento esté completamente cargado
document.addEventListener("DOMContentLoaded", async () => {
    // Obtener el token de la URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("code");

    // Mostrar el token en el elemento HTML correspondiente
    const tokenElement = document.getElementById("token");
    tokenElement.textContent = token;

    // Event listener para el botón de copiar
    const copyButton = document.getElementById("copy-token-button");
    copyButton.addEventListener("click", () => {
        // Seleccionar el texto del token
        const range = document.createRange();
        range.selectNode(tokenElement);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);

        // Copiar el texto seleccionado al portapapeles
        document.execCommand("copy");

        // Limpiar la selección
        window.getSelection().removeAllRanges();

        // Mostrar un mensaje de éxito (opcional)
        alert("Token copiado al portapapeles");
    });

    // Obtener las playlists del usuario utilizando la función de app.js
    const playlists = await APIController.getPlaylists();

    // Obtener el elemento del DOM donde queremos mostrar las playlists
    const playlistContainer = document.getElementById("playlist-container");

    // Mostrar las playlists en el DOM
    playlists.forEach((playlist) => {
        const playlistItem = document.createElement("li");
        playlistItem.textContent = playlist.name;
        playlistContainer.appendChild(playlistItem);
    });
});
