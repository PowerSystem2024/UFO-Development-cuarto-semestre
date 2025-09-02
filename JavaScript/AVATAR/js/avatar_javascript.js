// ----------------------
// Variables globales
// ----------------------

// Estado del juego (cambian)
let ataqueJugador;
let ataqueEnemigo;
let vidasJugador = 3;
let vidasEnemigo = 3;
let personajeSeleccionado = null;   // cambia al hacer click
let imgSeleccionada = null;         // cambia al resaltar la imagen

// Referencias a elementos fijos del DOM (no cambian)
const seccionMensajes = document.getElementById("mensajes");
const spanVidasJugador = document.getElementById("vidas-jugador");
const spanVidasEnemigo = document.getElementById("vidas-enemigo");

// Lista de personajes disponible (constante global)
const PERSONAJES = ["Zuko", "Katara", "Aang", "Toph", "Sokka"];


// ----------------------
// Inicialización
// ----------------------
function iniciarJuego() {
  // Botones menú
  document.getElementById("jugar")
    .addEventListener("click", () => mostrarPantalla("elige-personaje"));
  document.getElementById("reglas")
    .addEventListener("click", () => mostrarPantalla("contenedor-reglas"));
  document.getElementById("volver-inicio")
    .addEventListener("click", () => mostrarPantalla("menu-principal"));

  // Botón reiniciar (dentro de combate)
  document.getElementById("boton-reiniciar")
    .addEventListener("click", reiniciarJuego);

  // Selección de personaje por imagen
  PERSONAJES.forEach(p => {
    const img = document.getElementById(p);
    img.addEventListener("click", () => {
      personajeSeleccionado = p;

      // visual: marcar selección
      if (imgSeleccionada) imgSeleccionada.classList.remove("seleccionado");
      img.classList.add("seleccionado");
      imgSeleccionada = img;
    });
  });

  // Botón "SELECCIONAR" (solo continúa si ya tocó una imagen)
  document.getElementById("boton-personaje").addEventListener("click", () => {
    if (!personajeSeleccionado) {
      alert("Por favor, toca un personaje para seleccionarlo.");
      return;
    }
    seleccionarPersonajeJugador(personajeSeleccionado);
  });

  // Botones de ataque (son imágenes)
  document.getElementById("boton-punio")
    .addEventListener("click", () => ataqueJugadorAccion("Punio"));
  document.getElementById("boton-patada")
    .addEventListener("click", () => ataqueJugadorAccion("Patada"));
  document.getElementById("boton-barrida")
    .addEventListener("click", () => ataqueJugadorAccion("Barrida"));

  // Pantalla inicial
  mostrarPantalla("menu-principal");
}


// ----------------------
// Lógica del juego
// ----------------------
function mostrarPantalla(id) {
  document.querySelectorAll("section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function seleccionarPersonajeJugador(personaje) {
  document.getElementById("personaje-jugador").textContent = personaje;
  seleccionarPersonajeComputadora();

  // limpiar mensajes y ocultar botón de reinicio por si venía de otra partida
  seccionMensajes.innerHTML = "";
  document.getElementById("reiniciar").style.display = "none";

  vidasJugador = 3;
  vidasEnemigo = 3;
  spanVidasJugador.textContent = vidasJugador;
  spanVidasEnemigo.textContent = vidasEnemigo;

  mostrarPantalla("seleccionar-ataque");
}

function seleccionarPersonajeComputadora() {
  const aleatorio = PERSONAJES[Math.floor(Math.random() * PERSONAJES.length)];
  document.getElementById("personaje-enemigo").textContent = aleatorio;
}

function ataqueJugadorAccion(tipo) {
  ataqueJugador = tipo;
  ataqueAleatorioEnemigo();
  combate();
}

function aleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function ataqueAleatorioEnemigo() {
  const n = aleatorio(1, 3);
  if (n === 1) ataqueEnemigo = "Punio";
  if (n === 2) ataqueEnemigo = "Patada";
  if (n === 3) ataqueEnemigo = "Barrida";
}

function combate() {
  let resultado;

  if (ataqueJugador === ataqueEnemigo) {
    resultado = "Empate 😐";
  } else if (
    (ataqueJugador === "Punio" && ataqueEnemigo === "Barrida") ||
    (ataqueJugador === "Patada" && ataqueEnemigo === "Punio") ||
    (ataqueJugador === "Barrida" && ataqueEnemigo === "Patada")
  ) {
    resultado = "¡Ganaste esta ronda! 🎉";
    vidasEnemigo--;
    spanVidasEnemigo.textContent = vidasEnemigo;
  } else {
    resultado = "Perdiste esta ronda 😢";
    vidasJugador--;
    spanVidasJugador.textContent = vidasJugador;
  }

  crearMensaje(resultado);
  revisarFinDelJuego();
}

function crearMensaje(resultado) {
  seccionMensajes.innerHTML = `
    <p>Tu personaje atacó con ${ataqueJugador} 🆚 El enemigo atacó con ${ataqueEnemigo}</p>
    <p><strong>${resultado}</strong></p>
  `;
}

function revisarFinDelJuego() {
  if (vidasEnemigo === 0) {
    mostrarMensajeFinal("🎉 ¡Ganaste el juego completo! 🍾");
    deshabilitarBotonesAtaque();
  } else if (vidasJugador === 0) {
    mostrarMensajeFinal("💀 Has perdido el juego... ¡Inténtalo de nuevo!");
    deshabilitarBotonesAtaque();
  }
}

function mostrarMensajeFinal(mensaje) {
  seccionMensajes.innerHTML += `<p><strong>${mensaje}</strong></p>`;
  document.getElementById("reiniciar").style.display = "block"; // aparece el botón dentro de combate
}

function deshabilitarBotonesAtaque() {
  ["boton-punio","boton-patada","boton-barrida"].forEach(id => {
    const el = document.getElementById(id);
    el.style.pointerEvents = "none";
    el.style.opacity = "0.5";
  });
}

function reiniciarJuego() {
  // restablecer estado sin recargar página
  vidasJugador = 3;
  vidasEnemigo = 3;
  spanVidasJugador.textContent = vidasJugador;
  spanVidasEnemigo.textContent = vidasEnemigo;
  seccionMensajes.innerHTML = "";
  document.getElementById("reiniciar").style.display = "none";

  // re-habilitar ataques
  ["boton-punio","boton-patada","boton-barrida"].forEach(id => {
    const el = document.getElementById(id);
    el.style.pointerEvents = "auto";
    el.style.opacity = "1";
  });

  // volver al menú o dejar en combate (elige una):
  mostrarPantalla("menu-principal");
  // mostrarPantalla("seleccionar-ataque"); // alternativa
}


// ----------------------
// Iniciar todo
// ----------------------
window.addEventListener("load", iniciarJuego);
