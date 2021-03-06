"use strict";

class Product {
  addingProducts = [];
  constructor(productName, productPrice) {
    this.productName = productName;
    this.productPrice = productPrice;
    this.renderNewProduct();
  }
  renderNewProduct() {
    const productItem = document.createElement("li");
    productItem.classList.add("product-item");

    const productsList = document.querySelector(".products-list");
    let content = `
      <h4 class="product-item-name">${this.productName}</h4>
      <p class="product-item-price-value">$${this.productPrice}</p>
      <button class="shopping-cart"></button>
      `;
    productItem.innerHTML = content;
    productsList.appendChild(productItem);
  }
}

class Products {
  products = [];
  addedProducts = [];
  productIndex = 0;

  constructor() {
    this.readFromSessionStorage();
    this.initCreateNewProduct();
    this.readFromLocalStorage();
    this.initAddProductToTheCart();
    this.initDeleteProductFromTheCart();
    this.calcSum();
  }

  saveInLocalStorage() {
    localStorage.setItem("products", JSON.stringify(this.products));
  }
  readFromLocalStorage() {
    this.products = [];
    const localProduct = localStorage.getItem("products");
    if (localProduct) {
      const productsShapes = JSON.parse(localStorage.getItem("products"));
      productsShapes.forEach((productShape) => {
        const product = new Product(
          productShape.productName,
          productShape.productPrice
        );
        this.products.push(product);
      });
    }
  }
  saveInSessionStorage() {
    sessionStorage.setItem("addedProducts", JSON.stringify(this.addedProducts));
  }
  readFromSessionStorage() {
    this.addedProducts = [];
    document.querySelector(".shopping-bag-products").innerHTML = "";
    const localAddedProduct = sessionStorage.getItem("addedProducts");
    if (localAddedProduct) {
      const productsShapes = JSON.parse(
        sessionStorage.getItem("addedProducts")
      );
      productsShapes.forEach((productShape) => {
        const product = {
          productName: productShape.productName,
          productPrice: productShape.productPrice,
        };

        this.addedProducts.push(product);
        this.addProductToTheCart(product);
      });
    }
    this.calcSum();
  }
  createNewProduct() {
    const productNameValue = document.getElementById("product-name").value;
    const productPriceValue = Number(
      document.getElementById("product-price").value
    );

    if (!productNameValue) {
      alert("You must enter a product name!");
      return;
    }

    if (!productPriceValue || typeof productPriceValue != "number") {
      alert("You must enter a valid price!");
      return;
    }

    if (
      this.products.filter(
        (product) => product.productName === productNameValue
      ).length > 0
    )
      return;
    else {
      const product = new Product(productNameValue, productPriceValue);
      this.products.push(product);
      this.saveInLocalStorage();
    }
    document.getElementById("product-name").value = "";
    document.getElementById("product-price").value = "";
    this.initAddProductToTheCart();
  }
  initCreateNewProduct() {
    const addBtn = document.querySelector(".add-product-btn");
    addBtn.addEventListener("click", () => {
      this.createNewProduct();
    });
  }
  addProductToTheCart(product) {
    const shoppingBagProductsBox = document.querySelector(
      ".shopping-bag-products"
    );
    const shoppingBagSection = document.querySelector(".shopping-bag-section");
    const shoppingBagProductBox = document.createElement("div");
    shoppingBagProductBox.classList.add("shopping-bag-product");
    let content = `
          <h5>${product.productName}</h5>
          <button class="delete-btn"></button>
          <p>${product.productPrice}$</p>
      `;
    shoppingBagProductBox.innerHTML = content;
    shoppingBagProductsBox.appendChild(shoppingBagProductBox);
    shoppingBagSection.appendChild(shoppingBagProductsBox);
    this.initDeleteProductFromTheCart();
  }
  initAddProductToTheCart() {
    const shoppingCartBtns = document.querySelectorAll(".shopping-cart");
    const products = JSON.parse(localStorage.getItem("products"));

    shoppingCartBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const addedProduct = products.filter(
          (product) =>
            product.productName ===
            e.target.parentElement.firstElementChild.textContent
        );
        if (addedProduct.length > 0) {
          this.addProductToTheCart(addedProduct[0]);

          this.addedProducts.push(addedProduct[0]);
          this.saveInSessionStorage();
          this.calcSum();
        }
        return;
      });
    });
  }
  deleteProductFromTheCart(index) {
    this.addedProducts = [...this.addedProducts.filter((_, i) => i !== index)];
    this.saveInSessionStorage();
    this.readFromSessionStorage();
    return;
  }

  initDeleteProductFromTheCart() {
    const deleteBtns = document.querySelectorAll(".delete-btn");
    const addedProducts = JSON.parse(sessionStorage.getItem("addedProducts"));

    deleteBtns.forEach((btn, index) => {
      btn.addEventListener("click", (e) => {
        const productToRemove = addedProducts.filter(
          (product) =>
            product.productName ===
            e.target.previousSibling.previousSibling.textContent
        );
        if (productToRemove.length > 0) {
          this.deleteProductFromTheCart(index);
        }
        return;
      });
    });
  }
  calcSum() {
    const sum = document.querySelector(".sum");
    const addedProducts = JSON.parse(sessionStorage.getItem("addedProducts"));
    if (addedProducts && addedProducts.length > 0) {
      sum.innerHTML = `${addedProducts
        .map((product) => product.productPrice)
        .reduce((cur, sum) => cur + sum)}$`;
    } else sum.innerHTML = `0$`;
  }
}

class ShoppingBag {
  constructor() {
    this.createShoppingBagBox();
    this.initCloseShoppingBag();
    this.initCreateShoppingBagBox();
  }
  createShoppingBagBox() {
    const shoppingBagBox = document.createElement("section");
    shoppingBagBox.classList.add("shopping-bag-section");
    let content = `
          <button class="close-shopping-bag"></button>
          <h3>Shopping bag</h3>
          <div class="shopping-bag-products"></div>
          <h4>Sum</h4>
          <p class="sum"></p>
        `;
    shoppingBagBox.innerHTML = content;
    document.body.prepend(shoppingBagBox);
  }
  initCreateShoppingBagBox() {
    const shoppingBagBtn = document.querySelector(".shopping-bag-icon");
    shoppingBagBtn.addEventListener("click", () => {
      document
        .querySelector(".shopping-bag-section")
        .classList.toggle("shopping-bag-section--active");
    });
  }
  initCloseShoppingBag() {
    document
      .querySelector(".close-shopping-bag")
      .addEventListener("click", () => {
        document
          .querySelector(".shopping-bag-section")
          .classList.toggle("shopping-bag-section--active");
      });
  }
}
const shoppingBag = new ShoppingBag();
const products = new Products();
