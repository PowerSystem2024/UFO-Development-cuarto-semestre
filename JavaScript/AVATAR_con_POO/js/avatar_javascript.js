// ----------------------
// CLASES PRINCIPALES
// ----------------------

class Personaje {
    constructor(nombre, elemento) {
        this.nombre = nombre;
        this.elemento = elemento;
        this.vidas = 3;
    }

    perderVida() {
        if (this.vidas > 0) {
            this.vidas--;
        }
    }

    tieneVidas() {
        return this.vidas > 0;
    }

    reiniciar() {
        this.vidas = 3;
    }
}

class Jugador extends Personaje {
    constructor(nombre, elemento) {
        super(nombre, elemento);
        this.ataque = null;
    }

    seleccionarAtaque(tipo) {
        this.ataque = tipo;
    }

    reiniciar() {
        super.reiniciar();
        this.ataque = null;
    }
}

class Enemigo extends Personaje {
    constructor(nombre, elemento) {
        super(nombre, elemento);
    }

    generarAtaqueAleatorio() {
        const ataques = ["Punio", "Patada", "Barrida"];
        const indice = Math.floor(Math.random() * ataques.length);
        return ataques[indice];
    }
}

class Juego {
    constructor() {
        this.jugador = null;
        this.enemigo = null;
        this.estado = "menu"; // menu, seleccion, combate, resultados
        this.PERSONAJES = ["Zuko", "Katara", "Aang", "Toph", "Sokka"];
        this.inicializarElementosDOM();
        this.registrarEventos();
    }

    inicializarElementosDOM() {
        this.secciones = {
            menu: document.getElementById("menu-principal"),
            reglas: document.getElementById("contenedor-reglas"),
            seleccion: document.getElementById("elige-personaje"),
            combate: document.getElementById("seleccionar-ataque")
        };

        this.elementos = {
            mensajes: document.getElementById("mensajes"),
            vidasJugador: document.getElementById("vidas-jugador"),
            vidasEnemigo: document.getElementById("vidas-enemigo"),
            nombreJugador: document.getElementById("personaje-jugador"),
            nombreEnemigo: document.getElementById("personaje-enemigo"),
            botonReiniciar: document.getElementById("boton-reiniciar")
        };

        this.botonesAtaque = [
            document.getElementById("boton-punio"),
            document.getElementById("boton-patada"),
            document.getElementById("boton-barrida")
        ];
    }

    registrarEventos() {
        // Navegación principal
        document.getElementById("jugar").addEventListener("click", () => this.mostrarPantalla("seleccion"));
        document.getElementById("reglas").addEventListener("click", () => this.mostrarPantalla("reglas"));
        document.getElementById("volver-inicio").addEventListener("click", () => this.mostrarPantalla("menu"));

        // Selección de personaje
        this.PERSONAJES.forEach(nombre => {
            document.getElementById(nombre).addEventListener("click", () => this.seleccionarPersonajeJugador(nombre));
        });

        document.getElementById("boton-personaje").addEventListener("click", () => this.confirmarSeleccion());

        // Ataques
        this.botonesAtaque[0].addEventListener("click", () => this.procesarAtaque("Punio"));
        this.botonesAtaque[1].addEventListener("click", () => this.procesarAtaque("Patada"));
        this.botonesAtaque[2].addEventListener("click", () => this.procesarAtaque("Barrida"));

        // Reinicio
        this.elementos.botonReiniciar.addEventListener("click", () => this.reiniciarJuego());
    }

    mostrarPantalla(pantalla) {
        Object.values(this.secciones).forEach(sec => sec.classList.remove("active"));
        this.secciones[pantalla].classList.add("active");
        this.estado = pantalla;
    }

    seleccionarPersonajeJugador(nombre) {
        // Remover selección anterior
        this.PERSONAJES.forEach(p => {
            const img = document.getElementById(p);
            img.classList.remove("seleccionado");
        });

        // Marcar nuevo seleccionado
        const imgSeleccionada = document.getElementById(nombre);
        imgSeleccionada.classList.add("seleccionado");
        
        this.jugadorSeleccionado = nombre;
    }

    confirmarSeleccion() {
        if (!this.jugadorSeleccionado) {
            alert("Por favor, selecciona un personaje");
            return;
        }

        this.jugador = new Jugador(this.jugadorSeleccionado, this.obtenerElemento(this.jugadorSeleccionado));
        this.enemigo = this.generarEnemigo();
        
        this.actualizarUI();
        this.mostrarPantalla("combate");
    }

    obtenerElemento(nombre) {
        const elementos = {
            "Zuko": "🔥", 
            "Katara": "💧", 
            "Aang": "🌪️", 
            "Toph": "🌱", 
            "Sokka": "🗡️"
        };
        return elementos[nombre];
    }

    generarEnemigo() {
        const nombresDisponibles = this.PERSONAJES.filter(nombre => nombre !== this.jugadorSeleccionado);
        const nombreAleatorio = nombresDisponibles[Math.floor(Math.random() * nombresDisponibles.length)];
        return new Enemigo(nombreAleatorio, this.obtenerElemento(nombreAleatorio));
    }

    actualizarUI() {
        this.elementos.nombreJugador.textContent = `${this.jugador.nombre} ${this.jugador.elemento}`;
        this.elementos.nombreEnemigo.textContent = `${this.enemigo.nombre} ${this.enemigo.elemento}`;
        this.elementos.vidasJugador.textContent = this.jugador.vidas;
        this.elementos.vidasEnemigo.textContent = this.enemigo.vidas;
    }

    procesarAtaque(ataqueJugador) {
        if (!this.jugador.tieneVidas() || !this.enemigo.tieneVidas()) return;

        this.jugador.seleccionarAtaque(ataqueJugador);
        const ataqueEnemigo = this.enemigo.generarAtaqueAleatorio();

        const resultado = this.determinarGanador(ataqueJugador, ataqueEnemigo);
        this.aplicarResultado(resultado, ataqueJugador, ataqueEnemigo);
        this.mostrarMensaje(resultado, ataqueJugador, ataqueEnemigo);
        this.verificarFinJuego();
    }

    determinarGanador(ataqueJugador, ataqueEnemigo) {
        if (ataqueJugador === ataqueEnemigo) return "empate";

        const reglas = {
            "Punio": "Barrida",
            "Patada": "Punio",
            "Barrida": "Patada"
        };

        return reglas[ataqueJugador] === ataqueEnemigo ? "jugador" : "enemigo";
    }

    aplicarResultado(resultado, ataqueJugador, ataqueEnemigo) {
        switch (resultado) {
            case "jugador":
                this.enemigo.perderVida();
                break;
            case "enemigo":
                this.jugador.perderVida();
                break;
        }
        this.actualizarUI();
    }

    mostrarMensaje(resultado, ataqueJugador, ataqueEnemigo) {
        const mensajes = {
            "empate": "Empate 😐",
            "jugador": "¡Ganaste esta ronda! 🎉",
            "enemigo": "Perdiste esta ronda 😢"
        };

        this.elementos.mensajes.innerHTML = `
            <p>${this.jugador.nombre} atacó con ${ataqueJugador} 🆚 ${this.enemigo.nombre} atacó con ${ataqueEnemigo}</p>
            <p><strong>${mensajes[resultado]}</strong></p>
        `;
    }

    verificarFinJuego() {
        if (!this.enemigo.tieneVidas()) {
            this.finalizarJuego("¡Ganaste el juego! 🎉");
        } else if (!this.jugador.tieneVidas()) {
            this.finalizarJuego("Has perdido... 💀");
        }
    }

    finalizarJuego(mensaje) {
        this.elementos.mensajes.innerHTML += `<p><strong>${mensaje}</strong></p>`;
        this.deshabilitarAtaques();
        this.elementos.botonReiniciar.style.display = "block";
    }

    deshabilitarAtaques() {
        this.botonesAtaque.forEach(boton => {
            boton.style.pointerEvents = "none";
            boton.style.opacity = "0.5";
        });
    }

    habilitarAtaques() {
        this.botonesAtaque.forEach(boton => {
            boton.style.pointerEvents = "auto";
            boton.style.opacity = "1";
        });
    }

    reiniciarJuego() {
        this.jugador.reiniciar();
        this.enemigo.reiniciar();
        this.actualizarUI();
        this.elementos.mensajes.innerHTML = "";
        this.elementos.botonReiniciar.style.display = "none";
        this.habilitarAtaques();
    }
}

// ----------------------
// INICIALIZACIÓN
// ----------------------

let juego;

window.addEventListener("load", () => {
    juego = new Juego();
    juego.mostrarPantalla("menu");
});