'use strict';

const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

class Item {
    constructor(item) {
        let { product_name, price = 'Уточняйте по телефону', id_product, type = '' } = item;
        this.title = product_name;
        this.price = price;
        this.id = id_product;
        this.type = type;
    }
    render() {
        // return `<div class="catalog-item"><h3>${this.title}</h3>
        // <p>${this.type}</p>
        // <p>Цена: ${this.price} руб.</p>
        // <button class="catalog-item-button" onclick="cart.addToCart(${this.id})">Добавить в корзину</button>
        // </div>`;
        // return `<catalog-item :title="${this.title}" :price="${this.price}" :id="${this.id}"></catalog-item>`;
    }
}


class Catalog {
    constructor() {
        this.items = [];
    }

    async fetchGoods() {
        const items = await fetch(`${API_URL}/catalogData.json`).then((response) => { return response.json() })
        this.items = items;
        this.filteredItems = items;
    }

    updateItems(data) {
        this.items = data;
        this.filteredItems = data;
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
        // if (this.filteredItems.length == 0) {
        //     document.querySelector('.catalog-list').innerHTML = 'По вашему запросу ничего не нашлось';
        // }
        // else 
        this.render();
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
        })
        .catch(() => isError = true);
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

let items;
function updateItems(data) {
    items = data;
}

fetch(`${API_URL}/catalogData.json`)
.then((response) => { return response.json() })
.then((data) => comp.filteredItems = data);


// let filteredItems = [{
//     "id_product": 1,
//     "product_name": "Toyota",
//     "type": "FJ Cruiser",
//     "price": "383"
//   }, {
//     "id_product": 2,
//     "product_name": "Pontiac",
//     "type": "Firebird Trans Am",
//     "price": "66638"
//   }, {
//     "id_product": 3,
//     "product_name": "Honda",
//     "type": "Insight",
//     "price": "5160"
//   }, {
//     "id_product": 4,
//     "product_name": "Mercedes-Benz",
//     "type": "SLR McLaren",
//     "price": "0041"
//   }, {
//     "id_product": 5,
//     "product_name": "Suzuki",
//     "type": "Daewoo Lacetti",
//     "price": "0"
//   }, {
//     "id_product": 6,
//     "product_name": "Ford",
//     "type": "F350",
//     "price": "341"
//   }, {
//     "id_product": 7,
//     "product_name": "Ford",
//     "type": "Taurus",
//     "price": "55"
//   }, {
//     "id_product": 8,
//     "product_name": "Suzuki",
//     "type": "Swift",
//     "price": "38950"
//   }, {
//     "id_product": 9,
//     "product_name": "Cadillac",
//     "type": "DeVille",
//     "price": "81402"
//   }, {
//     "id_product": 10,
//     "product_name": "Mercury",
//     "type": "Cougar",
//     "price": "19"
//   }, {
//     "id_product": 11,
//     "product_name": "Mitsubishi",
//     "type": "Galant",
//     "price": "71"
//   }, {
//     "id_product": 12,
//     "product_name": "Audi",
//     "type": "90",
//     "price": "8510"
//   }, {
//     "id_product": 13,
//     "product_name": "Ford",
//     "type": "Laser",
//     "price": "3076"
//   }, {
//     "id_product": 14,
//     "product_name": "Mercury",
//     "type": "Cougar",
//     "price": "03"
//   }]

// КОРЗИНА

var cart = new Cart;
cart.render();


Vue.component('search', {
    template: `<input type="text" class="goods-search" @input="e => filterItems(e)" placeholder="Поиск">`,
    methods:{
        filterItems(e) {
        const value = e.target.value;
        catalogList.filterItems(value);
        if (catalogList.items.length == 0 || catalogList.filteredItems.length == 0) {
            app.isItemsListEmpty = true;
        } else {
            app.isItemsListEmpty = false;
        }
    }
}
});

Vue.component('cart', {
    template: `<div><button id="cart-btn" @click="cartClickHandler"></button>
    <div id="user-cart" v-show="isVisibleCart">
    <h2 class="cart-title">Корзина</h2>
        <button id="cart-close" @click="closeCart">[x]</button>
        <div id="cart-items"></div>
        </div></div>`,
data: function() {
    return {
        isVisibleCart: false,
    }
},
methods: {
    cartClickHandler() {
        if (this.isVisibleCart === true) {
            this.closeCart();
        }
        else {
            this.isVisibleCart = true;
        }
    },
    closeCart() {
        this.isVisibleCart = false;
    }
}
})

// Vue.component('catalog-error', {
//     template: `<p v-show="!isError">Ошибка соединения. Повторите позднее</p>`,
    // data: function() {
    //     return {
    //         isError: isError
    //     }
//     }
// })

Vue.component('catalog-item', {
    props: ['title', 'price', 'id', 'type'],

    template: `<div class="catalog-item">
    <h3>{{ title }}</h3>
    <p>{{ type }}</p>
    <p>Цена: {{ price }} руб.</p>
    <button class="ctalog-item-button" onclick="cart.addToCart({{ id }})">Добавить в корзину</button>
  </div>`
});

const comp = Vue.component('catalog-list', {
    // props: ['items'],
    data() {
        return {
            filteredItems: []}
    },
    // template: `<div class="catalog-list">
    // <!--<catalog-item v-for="item in filteredItems" :item="item"></catalog-item>-->
    // </div>`,
    template: `<div class="catalog-list">
    {{ filteredItems[0].price }}
    </div>`
});

const app = new Vue({
    el: '#app',
    data: {
        isItemsListEmpty: false,
        // isError: false,
    },
    methods: {

    }
});
