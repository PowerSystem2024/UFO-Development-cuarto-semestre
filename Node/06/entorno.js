// Obtenemos las variables de entorno para configurar el usuario actual
let currentUser = process.env.NOMBRE || "Sin Nombre";
let userWebsite = process.env.WEB || "No tengo web";

console.log("Nombre:", currentUser);
console.log("Web:", userWebsite);

console.log("Hola desde Node.js");
//console.log(`Hola ${currentUser}`);
