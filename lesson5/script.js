'use strict';

function makeGETRequest(url) {
    return new Promise((resolve, reject) => {
        var xhr;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                resolve(xhr.responseText);
                if (xhr.status != 200) {
                    reject('error');
                }
            }
        }

        xhr.open('GET', url, true);
        xhr.send();
    })
}

const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

const makeGETRequestPromise = makeGETRequest(`${API_URL}/catalogData.json`);

class Item {
    constructor(item) {
        let { product_name, price = 'Уточняйте по телефону', id_product, type = '' } = item;
        this.title = product_name;
        this.price = price;
        this.id = id_product;
        this.type = type;
    }
    render() {
        return `<div class="catalog-item"><h3>${this.title}</h3>
        <p>${this.type}</p>
        <p>Цена: ${this.price} руб.</p>
        <button class="catalog-item-button" onclick="cart.addToCart(${this.id})">Добавить в корзину</button>
        </div>`;
    }
}

class Catalog {
    constructor() {
        this.items = [];
    }

    async fetchGoods() {
        const items = await makeGETRequestPromise;
        this.items = JSON.parse(items);
        this.filteredItems = JSON.parse(items);
    }

    render() {
        let listHtml = '';
        this.filteredItems.forEach(item => {
            const catalogItem = new Item(item);
            listHtml += catalogItem.render();
        });
        document.querySelector('.catalog-list').innerHTML = listHtml;
    }

    filterItems(value) {
        const regexp = new RegExp(value, 'i');
        this.filteredItems = this.items.filter(item => regexp.test(item.product_name));
        if (this.filteredItems.length == 0) {
            document.querySelector('.catalog-list').innerHTML = 'По вашему запросу ничего не нашлось';
        }
        else this.render();
    }

    getItems() {
        return this.filteredItems
    }
}

class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cartItems')) || [];
    }

    render() {
        const getCatalog = catalogList.fetchGoods();
        getCatalog.then(() => {
            const cartItemsList = document.getElementById('cart-items');
            cartItemsList.innerHTML = '';

            if (this.items.length == 0) {
                cartItemsList.innerText = 'Корзина пуста.';
            }

            var totalCount = 0;
            var totalSum = 0;

            for (let i = 0; i < this.items.length; i++) {
                catalogList.items.forEach((item) => {
                    if (item.id_product == this.items[i].id_product) {
                        var cartItem = document.createElement('div');
                        cartItem.className = 'cart-item';
                        cartItem.innerHTML = `<h3>${item.product_name}</h3>
                        <span class="cart-item-point">Цена: ${item.price}</span>
                        <span class="cart-item-point">Количество:
                        <button class="countdown-btn" onclick="cart.count(${item.id_product}, 'down')">[-]</button> ${this.items[i].count} 
                        <button class="countup-btn" onclick="cart.count(${item.id_product}, 'up')">[+]</button></span>`;
                        cartItemsList.appendChild(cartItem);

                        totalCount += this.items[i].count;
                        totalSum += item.price * this.items[i].count;
                    }
                })
            }

            var cartPrice = document.createElement('div');
            cartPrice.className = 'cart-sum';
            cartPrice.innerHTML = `В корзине: ${totalCount} товаров на сумму ${totalSum} руб.`

            var clearBtn = document.createElement('button');
            clearBtn.addEventListener('click', () => this.clear());
            clearBtn.innerText = 'Очистить корзину'

            if (this.items.length > 0) {
                cartItemsList.appendChild(cartPrice);
                cartItemsList.appendChild(clearBtn);
            }
        });
    }

    addToCart(itemId) {
        let isNew = true;
        if (this.items.length > 0) {
            for (let i = 0; i < this.items.length; i++) {
                if (itemId == this.items[i].id_product) {
                    this.items[i].count++;
                    isNew = false;
                }
            }
        }
        if (isNew) {
            this.items.push({ 'id_product': itemId, 'count': 1 });
        }
        localStorage.setItem('cartItems', JSON.stringify(this.items));
        this.render();
    }

    clear() {
        localStorage.removeItem('cartItems');
        this.items = [];
        this.render();
    }

    count(itemId, operation) {
        this.items.forEach((item) => {
            if (item.id_product == itemId) {
                switch (operation) {
                    case 'down': item.count--;
                        break;
                    case 'up': item.count++;
                        break;
                }
            }
            if (item.count <= 0) {
                let itemToDelete = this.items.indexOf(item);
                this.items.splice(itemToDelete, 1);
            }
        })
        localStorage.setItem('cartItems', JSON.stringify(this.items));
        this.render();
    }
}

// КАТАЛОГ
const catalogList = new Catalog();

const getCatalog = catalogList.fetchGoods();
getCatalog.then(() => {
    catalogList.render();
})




// КОРЗИНА
var cart = new Cart;
cart.render();

let searchInput = document.querySelector('input.goods-search');
// let searchButton = document.querySelector('button.search-button');
// searchButton.addEventListener('click', (e) => {
//     const value = searchInput.value;
//     catalogList.filterItems(value);
//   });

// searchInput.addEventListener('input', (e) => {
//     const value = e.target.value;
//     catalogList.filterItems(value);
// });

const app = new Vue({
    el: '#app',
    data: {
        name: 'Test',
        isVisibleCart: false,
        // isItemsListEmpty: catalogList.filteredItems.length == 0 || catalogList.items.length == 0
        isItemsListEmpty: false
    },
    methods: {
        openCart() {
            this.isVisibleCart = true;
        },
        closeCart() {
            this.isVisibleCart = false;
        },
        filterItems(e) {
            const value = e.target.value;
            catalogList.filterItems(value);
        }
    }
});


getCatalog.then(() => { catalogList.getItems().length })