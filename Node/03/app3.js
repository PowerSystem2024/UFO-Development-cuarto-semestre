console.log("Iniciando sistema..."); // Inicio síncrono

// Ejemplo de asincronía con setTimeout
setTimeout(() => {
  console.log("Primer Timeout");
}, 3000);

setTimeout(() => {
  console.log("Segundo Timeout");
}, 0);

setTimeout(() => {
  console.log("Tercero Timeout");
}, 0);

console.log("Sistema finalizado"); // Fin del stack principal
