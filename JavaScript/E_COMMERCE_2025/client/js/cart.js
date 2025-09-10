const modalContainer = document.getElementById("modal-container");      //capruto el modal-container
const modalOverlay = Document.getElementById("modal-overlay");          //capturo el modal-oberlay

const cartBtn = document.getElementById("cart-btn");

const displayCart = () => {                                     // esta función se ejecuta cuando el usuario aprete el boton del carrito
    //modal Header
    const modalHeader = document.createElement("div");          // contenedor del header

    // boton de cierre del carrito
    const modalClose = document.createElement("div");           // boton que cierra el modal(el carrito)
    modalClose.innerText = "❌";                                // este div va a tener un texto interno, como una cruz para que lo cierre
    modalClose.className = "modal-close";                       // clase css
    modalHeader.append(modalCose);                              // agarramos al header el boton de cierre mediante append

    // texto para el boton de cierre
    const modalTitle = document.createElement("div");
    modalTitle.innerText = " Carrito de compras";
    modalTitle.className = "modal-title";
    modalHeader.append(modalTitle);

    modalContainer.append(modalHeader);
};

cartBtn.addEventListener("click", displayCart);