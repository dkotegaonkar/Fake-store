import axios from "axios";

document.addEventListener("DOMContentLoaded", () => {
    interface Product {
        id: number;
        title: string;
        price: number;
        image: string;
        description: string;
        category: string;
    }

    interface CartItem {
        id: number;
        title: string;
        price: number;
        image: string;
        quantity: number;
    }

    const loginForm = document.getElementById("login-form") as HTMLFormElement;
    const loginBtn = document.getElementById("login-btn") as HTMLButtonElement;
    const logoutBtn = document.getElementById("logout-btn") as HTMLButtonElement;
    const productList = document.getElementById("product-list") as HTMLDivElement;
    const categoryDropdown = document.querySelector("#nav-dropdown .dropdown-menu") as HTMLDivElement;
    const cartCount = document.getElementById("cart-count") as HTMLSpanElement;
    const cartItemsList = document.getElementById("cart-items") as HTMLUListElement;
    let cart: CartItem[] = [];

    categoryDropdown.addEventListener("click", (event: Event) => {
        const target = event.target as HTMLElement;
        if (target.classList.contains("dropdown-item")) {
            const selectedCategory = target.id;
            fetchProductsByCategory(selectedCategory);
        }
    });

    const fetchProductsByCategory = (category: string): void => {
        productList.innerHTML = "";
        axios.get<Product[]>(`https://fakestoreapi.com/products/category/${category}`)
            .then((res) => {
                res.data.forEach((product) => createProduct(product));
            })
            .catch((err) => console.error("Error fetching category products:", err));
    };

    const allProducts = (): void => {
        axios.get<Product[]>("https://fakestoreapi.com/products")
            .then((res) => {
                res.data.forEach((product) => createProduct(product));
            })
            .catch((err) => console.error("Error fetching products from API:", err));
    };

    const createProduct = (product: Product): void => {
        const div = document.createElement("div");
        div.className = "card";
        div.style.cssText = "width:18rem;margin:10px;";

        div.innerHTML = `
            <img src="${product.image}" class="card-img-top" alt="..." style="width: 100%;height: 15vw;object-fit: cover">
            <div class="card-body d-flex flex-column">
                <small class="text-muted">${product.category}</small>
                <h2 class="fs-6" style="height: 2.5em; overflow: hidden;">${product.title}</h2>
                <p class="card-text" style="height: 3em; overflow: hidden;">${product.description}</p>
                <div class="d-flex justify-content-between align-items-center mt-3">
                    <span class="text-dark">$${product.price}</span>
                    <button class="btn btn-primary btn-sm add-to-cart" 
                        data-id="${product.id}" 
                        data-title="${product.title}" 
                        data-price="${product.price}" 
                        data-image="${product.image}">
                        Add
                    </button>
                </div>
            </div>`;

        productList.appendChild(div);
    };

    document.addEventListener("click", (event: Event) => {
        const target = event.target as HTMLElement;
        if (target.classList.contains("add-to-cart")) {
            const id = Number(target.dataset.id);
            const title = target.dataset.title || "";
            const price = parseFloat(target.dataset.price || "0");
            const image = target.dataset.image || "";

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

    const updateCart = (): void => {
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
                </li>`;
        });

        cartItemsList.innerHTML += `<li class="list-group-item text-end"><strong>Total: $${totalPrice.toFixed(2)}</strong></li>`;
        cartCount.innerText = cart.reduce((total, item) => total + item.quantity, 0).toString();
    };

    (window as any).updateQuantity = (index: number, change: number): void => {
        if (cart[index].quantity + change > 0) {
            cart[index].quantity += change;
        } else {
            cart.splice(index, 1);
        }
        updateCart();
    };

    const showToast = (message: string): void => {
        const toast = document.createElement("div");
        toast.className = "toast show position-fixed bottom-0 end-0 m-3 p-3 bg-success text-white";
        toast.innerHTML = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    };

    allProducts();

    document.addEventListener("DOMContentLoaded", () => {
        const authLink = document.getElementById("auth-link") as HTMLAnchorElement;
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
