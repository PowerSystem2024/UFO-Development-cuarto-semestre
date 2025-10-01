const modalContainer = document.getElementById("modal-container");      //capruto el modal-container
const modalOverlay = document.getElementById("modal-overlay");          //capturo el modal-oberlay

const cartBtn = document.getElementById("cart-btn");            // cartBtn es una constante que captura el id  cart-btn
const cartCounter = document.getElementById("cart-counter");  // cartCounter es una constante que captura el id cart-counter

const displayCart = () => {                                     // esta función se ejecuta cuando el usuario aprete el boton del carrito
    modalContainer.innerHTML = "";                              // Limpia el header del modal
    modalContainer.style.display = "block";
    modalOverlay.style.display = "block";
    //modal Header
    const modalHeader = document.createElement("div");          // contenedor del header

    // boton de cierre del carrito
    const modalClose = document.createElement("div");           // boton que cierra el modal(el carrito)
    modalClose.innerText = "❌";                                // este div va a tener un texto interno, como una cruz para que lo cierre
    modalClose.className = "modal-close";                       // clase css
    modalHeader.append(modalClose);                              // agarramos al header el boton de cierre mediante append

    modalClose.addEventListener("click", ()=> {
        modalContainer.style.display = "none";
        modalOverlay.style.display = "none";
    })

    // texto para el boton de cierre
    const modalTitle = document.createElement("div");
    modalTitle.innerText = " Carrito de compras";
    modalTitle.className = "modal-title";
    modalHeader.append(modalTitle);

    modalContainer.append(modalHeader);

    // modal body
    if (cart.length > 0) {

    
    cart.forEach((product) => {
        const modalBody = document.createElement("div");
        modalBody.className = "modal-body";
        modalBody.innerHTML =`
        <div class="product">
                <img class="product-img" src="${product.img}" />
                <div class="product-info">
                    <h4>${product.productName}</h4>
                </div>
            <div class="quantity">
                <span class = "quantity-btn-decrese">-</span>
                <span class = "quantity-input">${product.quanty}</span>
                <span class = "quantity-btn-increse">+</span>
            </div>
                <div class = "price">${product.price * product.quanty} $</div>
                <div class = "delete-product">❌</div>
        </div>
        `;
        modalContainer.append(modalBody);

        const decrese = modalBody.querySelector(".quantity-btn-decrese");
        decrese.addEventListener("click", ()=> {
            if(product.quanty !== 1) {
                product.quanty--;
                displayCart();
                displayCartCounter();
            }
        });

        const increse = modalBody.querySelector(".quantity-btn-increse");
        increse.addEventListener("click", ()=> {
            product.quanty++;
            displayCart();
            displayCartCounter();
        });

        // eliminar producto
        const deleteProduct = modalBody.querySelector(".delete-product");

        deleteProduct.addEventListener("click", ()=> {
            deleteCartProduct(product.id);
        });
    });
    

    //modal fotter
    const total = cart.reduce((acc, el) => acc + el.price * el.quanty, 0); // calculo el total a pagar

    const modalFooter = document.createElement("div");
    modalFooter.className = "modal-footer"
    modalFooter.innerHTML = `
    <div class="total-price">Total: ${total}</div>
    `;
    modalContainer.append(modalFooter);
} else {
    const modalText = document.createElement("h2");
    modalText.className = "modal-body";
    modalText.innerText = "Tu carrito está vacío";
    modalContainer.append(modalText);
}
};

cartBtn.addEventListener("click", displayCart);

const deleteCartProduct =(id)=> {
    const foundId = cart.findIndex((element)=> element.id === id);
    cart.splice(foundId, 1)
    displayCart();
    displayCartCounter();
};



const displayCartCounter = () => {
    const cartLength = cart.reduce((acc, el) => acc + el.quanty, 0);
    if(cartLength > 0) {
        cartCounter.style.display = "block";
        cartCounter.innerText = cartLength;
    } else {
        cartCounter.style.display = "none";
    };
};