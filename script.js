const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");


let cart = []

// Abir o modal do carrinho
cartBtn.addEventListener("click", function () {
    cartModal.style.display = "flex";
});

// Fechar modal quando clicar fora
cartModal.addEventListener("click", function () {
    if (event.target === cartModal) {
        cartModal.style.display = "none"
    }
})

// Fechar o modal ao clicar em fechar
closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none"
})

// Selecionando os items que eu quero
menu.addEventListener("click", function (event) {

    let parentButton = event.target.closest(".add-to-cart-btn");

    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"))



        addToCart(name, price)
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
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Previne que feche ao clicar ou passar o mouse
        style: {
            background: "#22c55e", // Verde para sucesso
        },
    }).showToast();

    updateCartModal();
}



// Atualiza o carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = ""
    let total = 0

    // Adiciona classes para altura máxima e rolagem
    cartItemsContainer.classList.add("max-h-64", "overflow-y-auto")

    cart.forEach(item => {
        const cartItemElement = document.createElement("div")

        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

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
        `
        total += item.price * item.quantity

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })

    cartCounter.innerHTML = cart.length;
}

// Função para remover o item do carrinho
cartItemsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name")
        console.log(name)


        removeItemCart(name)

    }
    

    
})


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
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: true,
                style: {
                    background: "#f97316", // Laranja para uma remoção parcial
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
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true,
            style: {
                background: "#ef4444", // Vermelho para remoção total
            },
        }).showToast();
    }
}


addressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        addressInput.classList.remove("border-red-600")
        addressWarn.classList.add("hidden")

    }

})

// Finalizar pedido
checkoutBtn.addEventListener("click", function () {
    const isOpen = checkRestaurantOpen();
    if (!isOpen) {
      Toastify({
            text: "RESTURANTE FECHADO NO MOMENTO",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
      }).showToast()
        return;
    }
    if (cart.length === 0) return;
    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-600");
        return;
    }

    // Calcular o total do carrinho
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Enviar pedido pro WhatsApp
    const cartItems = cart.map((item) => {
        return `
${item.name} Quantidade: ${item.quantity} Preço: R$${item.price.toFixed(2)}
`;
    }).join("");

    const message = encodeURIComponent(`Pedido: ${cartItems} 
*Total: R$${total.toFixed(2)}* 

Endereço: ${addressInput.value}`);
    const phone = "19971438515";

    // Abrir WhatsApp Web
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

    cart.length = 0
    updateCartModal();
});
 
// Verificar a hora e menipular o card horario
function checkRestaurantOpen() {
    const data = new Date()
    const hora = data.getHours()
    return hora >= 7 && hora < 22; //true = restaurante esta aberto

}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen()

if (isOpen) {
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
}
else {
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")

}









