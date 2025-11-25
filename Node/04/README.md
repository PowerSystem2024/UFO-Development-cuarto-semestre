# Clase 04: Profundizando en el Event Loop

## ¿Por qué Node.js es tan rápido?

Node.js es famoso por ser "no bloqueante". Pero, ¿qué significa esto realmente si solo usa un hilo (single-thread)?

### La Analogía del Restaurante

Imagina un restaurante muy concurrido:

*   **Modelo Tradicional (Multi-hilo)**: Tienes muchos meseros. Cada mesero atiende una mesa, toma el pedido, va a la cocina, **espera** allí parado hasta que el chef termine, y luego lleva la comida. Si tienes 50 mesas, necesitas 50 meseros. Si se acaban los meseros, los nuevos clientes esperan afuera.
*   **Modelo Node.js (Event Loop)**: Tienes **un solo mesero** (el hilo principal), pero es súper rápido.
    1.  El mesero toma el pedido de la Mesa 1 y lo deja en la cocina (Event Queue).
    2.  **No se queda esperando**. Inmediatamente va a la Mesa 2, toma el pedido y lo deja en cocina.
    3.  Cuando el chef (el sistema/kernel) termina el plato de la Mesa 1, toca una campana (Callback).
    4.  El mesero recoge el plato y lo sirve.

Así, un solo mesero puede atender cientos de mesas siempre y cuando no se quede parado esperando (bloqueado).

## El Event Loop: Bajo el Capó

El **Event Loop** es el ciclo infinito que permite a Node.js realizar operaciones no bloqueantes. Delega las tareas pesadas (leer archivos, consultas a BD) al sistema operativo (libuv), y cuando estas terminan, ejecuta el código JavaScript asociado (callback).

### Fases del Ciclo

El ciclo no es un simple "while(true)". Tiene fases específicas:

1.  **Timers**: ¿Hay algún `setTimeout` o `setInterval` que ya cumplió su tiempo? Si sí, ejecútalo.
2.  **Pending Callbacks**: Errores de sistema o tareas de I/O pospuestas.
3.  **Poll (Encuesta)**: Aquí pasa la magia. Node espera nuevas conexiones o datos de archivos. Si no hay nada pendiente, puede esperar aquí.
4.  **Check**: Ejecuta los `setImmediate()`.
5.  **Close Callbacks**: Cierre de conexiones, sockets destruidos, etc.


## Cuándo usar (y cuándo no) Node.js

### ✅ Casos de Uso Ideales
*   **Aplicaciones de Chat**: Websockets y mucha I/O ligera.
*   **Dashboards en tiempo real**: Monitoreo de datos que cambian constantemente.
*   **Microservicios**: Pequeños servicios que se comunican entre sí.
*   **Streaming de Datos**: Procesar archivos mientras se suben.

### ❌ Cuándo Evitarlo
*   **Procesamiento pesado de CPU**: Si tienes que calcular Fibonacci de números gigantes, procesar imágenes 4K o inteligencia artificial pesada en el mismo servidor. Esto bloquearía al "único mesero" y nadie más podría ser atendido.
