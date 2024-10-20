const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const tableInput = document.getElementById("table-number");
const addressWarn = document.getElementById("address-warn");
const tableWarn = document.getElementById("table-warn");

let cart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function () {
    cartModal.style.display = "flex";
});

// Fechar modal quando clicar fora
cartModal.addEventListener("click", function () {
    if (event.target === cartModal) {
        cartModal.style.display = "none";
    }
});

// Fechar o modal ao clicar em fechar
closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none";
});

// Selecionando os items que eu quero
menu.addEventListener("click", function (event) {
    let parentButton = event.target.closest(".add-to-cart-btn");

    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));

        addToCart(name, price);
    }
});

// Função para adicionar no carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        // Se o item já existe, aumenta apenas a quantidade + 1
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        });
    }

    // Notificação bonita com Toastify
    Toastify({
        text: `${name} foi adicionado ao carrinho!`,
        duration: 3000,
        close: true,
        gravity: "top", 
        position: "right", 
        stopOnFocus: true, 
        style: {
            background: "#22c55e", 
        },
    }).showToast();

    updateCartModal();
}

// Atualiza o carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cartItemsContainer.classList.add("max-h-64", "overflow-y-auto");

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");

        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

        cartItemElement.innerHTML = `
        <div>
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium"> ${item.name}</p>
                    <p class="font-medium mt-2">Quantidade: (${item.quantity})</p>
                    <p class="mt-2">Preço: R$${item.price.toFixed(2)}</p>
                </div>
                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>
            </div>      
        </div>
        `;
        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}

// Função para remover o item do carrinho
cartItemsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name");

        removeItemCart(name);
    }
});

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();

            // Notificação para remoção parcial
            Toastify({
                text: `Uma unidade de ${name} foi removida do carrinho!`,
                duration: 3000,
                close: true,
                gravity: "top", 
                position: "right", 
                stopOnFocus: true,
                style: {
                    background: "#f97316", 
                },
            }).showToast();

            return;
        }

        cart.splice(index, 1);
        updateCartModal();

        // Notificação para remoção completa
        Toastify({
            text: `${name} foi removido completamente do carrinho!`,
            duration: 3000,
            close: true,
            gravity: "top", 
            position: "right", 
            stopOnFocus: true,
            style: {
                background: "#ef4444", 
            },
        }).showToast();
    }
}

// Validar preenchimento dos campos
addressInput.addEventListener("input", function (event) {
    if (event.target.value !== "") {
        addressInput.classList.remove("border-red-600");
        addressWarn.classList.add("hidden");
        tableInput.value = "";
        tableInput.classList.remove("border-red-600");
        tableWarn.classList.add("hidden");
    }
});

tableInput.addEventListener("input", function (event) {
    if (event.target.value !== "") {
        tableInput.classList.remove("border-red-600");
        tableWarn.classList.add("hidden");
        addressInput.value = "";
        addressInput.classList.remove("border-red-600");
        addressWarn.classList.add("hidden");
    }
});

// Finalizar pedido
checkoutBtn.addEventListener("click", function () {
    const isOpen = checkRestaurantOpen();
    if (!isOpen) {
        Toastify({
            text: "RESTAURANTE FECHADO NO MOMENTO",
            duration: 3000,
            close: true,
            gravity: "top", 
            position: "left", 
            stopOnFocus: true, 
            style: {
                background: "#ef4444",
            },
        }).showToast();
        return;
    }

    if (cart.length === 0) return;

    if (addressInput.value === "" && tableInput.value === "") {
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-600");
        tableWarn.classList.remove("hidden");
        tableInput.classList.add("border-red-600");
        return;
    }

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const deliveryDetails = addressInput.value !== "" 
        ? `Endereço: ${addressInput.value}` 
        : `Mesa: ${tableInput.value}`;

    const cartItems = cart.map((item) => {
        return `${item.name} Quantidade: ${item.quantity} Preço: R$${item.price.toFixed(2)}\n`;
    }).join("");

    const message = encodeURIComponent(`Pedido: ${cartItems} 
    *Total: R$${total.toFixed(2)}* 
    ${deliveryDetails}`);

    const phone = "19971438515";
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

    cart.length = 0;
    updateCartModal();
});

// Verificar a hora e manipular o card horário
function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 7 && hora < 22; 
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
} else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}
