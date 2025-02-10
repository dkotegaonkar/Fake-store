document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const loginBtn = document.getElementById("login-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const productList = document.getElementById("product-list");
    const categoryDropdown = document.querySelector("#nav-dropdown .dropdown-menu");
    const cartCount = document.getElementById("cart-count");
    const cartItemsList = document.getElementById("cart-items");
    let cart = [];
    
    
    categoryDropdown.addEventListener("click", (event) => {
        if (event.target.classList.contains("dropdown-item")) {
            const selectedCategory = event.target.id;
            fetchProductsByCategory(selectedCategory);
        }
    });

    const fetchProductsByCategory = (category) => {
        productList.innerHTML = "";
        axios.get(`https://fakestoreapi.com/products/category/${category}`)
            .then((res) => {
                res.data.forEach((product) => createProduct(product));
            })
            .catch((err) => console.error("Error fetching category products:", err));
    };


    const allProducts = () => {
        axios.get("https://fakestoreapi.com/products")
            .then((res) => {
                res.data.forEach((product) => {
                    createProduct(product);
                });
            })
            .catch((err) => console.error("Error fetching products from API:", err));
    };

    const createProduct = (product) => {
        const div = document.createElement("div");
        div.className = "card";
        div.style = "width:18rem;margin:10px;";

        div.innerHTML = `
            <img src="${product.image}" class="card-img-top" alt="..." style="width: 100%;height: 15vw;object-fit: cover">
            <div class="card-body d-flex flex-column">
                <small class="text-muted">${product.category}</small>
                <h2 class="fs-6" style="height: 2.5em; line-height: 1.25em; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                    ${product.title}
                </h2>
                <p class="card-text" style="height: 3em; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                    ${product.description}
                </p>
                <div class="d-flex justify-content-between align-items-center mt-3">
                    <span class="text-dark">$${product.price}</span>
                    <button class="btn btn-primary btn-sm add-to-cart" data-id="${product.id}" data-title="${product.title}" data-price="${product.price}" data-image="${product.image}">Add</button>
                </div>
            </div>`;

        productList.appendChild(div);
    };

    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("add-to-cart")) {
            const id = event.target.dataset.id;
            const title = event.target.dataset.title;
            const price = parseFloat(event.target.dataset.price);
            const image = event.target.dataset.image;

            const existingItem = cart.find(item => item.id === id);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ id, title, price, image, quantity: 1 });
            }

            updateCart();
            showToast("Item added to cart");
        }
    });

    const updateCart = () => {
        cartItemsList.innerHTML = "";
        let totalPrice = 0;
        cart.forEach((item, index) => {
            totalPrice += item.price * item.quantity;
            cartItemsList.innerHTML += `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <img src="${item.image}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 5px;">
                    <span>${item.title}</span>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    <div>
                        <button class="btn btn-sm btn-outline-primary" onclick="updateQuantity(${index}, -1)">-</button>
                        <span class="mx-2">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-primary" onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                </li>
            `;
        });

        cartItemsList.innerHTML += `
            <li class="list-group-item text-end"><strong>Total: $${totalPrice.toFixed(2)}</strong></li>
        `;

        cartCount.innerText = cart.reduce((total, item) => total + item.quantity, 0);
    };

    // Update quantity
    window.updateQuantity = (index, change) => {
        if (cart[index].quantity + change > 0) {
            cart[index].quantity += change;
        } else {
            cart.splice(index, 1);
        }
        updateCart();
    };


    const showToast = (message) => {
        const toast = document.createElement("div");
        toast.className = "toast show position-fixed bottom-0 end-0 m-3 p-3 bg-success text-white";
        toast.innerHTML = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    };


    allProducts();
    document.addEventListener("DOMContentLoaded", () => {
        const authLink = document.getElementById("auth-link");
        const token = localStorage.getItem("authToken");
    
        if (token) {
            authLink.innerText = "Logout";
            authLink.href = "#";
            authLink.addEventListener("click", () => {
                localStorage.removeItem("authToken");
                localStorage.removeItem("username");
                window.location.href = "login.html";
            });
        }
    });
});