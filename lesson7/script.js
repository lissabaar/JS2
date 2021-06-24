'use strict';

const PostResp = (url, data) => {
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

// ПОИСК

Vue.component('search', {
    data() {
        return {
            searchLine: '',
        }
    },
    template: `<input type="text" class="goods-search" v-model="searchLine" @input="filterItems(searchLine)" placeholder="Поиск">`,
    methods: {
        filterItems(searchLine) {
            const regexp = new RegExp(searchLine, 'i');
            app.filteredItems = app.items.filter(item => regexp.test(item.product_name));
            if (app.items.length == 0 || app.filteredItems.length == 0) {
                app.isItemsListEmpty = true;
            } else {
                app.isItemsListEmpty = false;
            }
        },
    }
});

// КОРЗИНА

Vue.component('cart', {
    props: ['items'],

    template: `<div><button id="cart-btn" @click="cartClickHandler"></button>
    <div id="user-cart" v-show="isVisibleCart">
    <h2 class="cart-title">Корзина</h2>
        <button id="cart-close" @click="closeCart">[x]</button>
        <p v-if="!items.length">Корзина пуста.</p>
        <div id="cart-items">
        <cart-item v-for="item in items" :item="item"></cart-item>
        </div>
        <button @click="clear">Очистить корзину</button>
        </div></div>`,

    data() {
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
        },

        clear() {
            app.cartItems = [];
        },
    }
})

// ТОВАР В КОРЗИНЕ

Vue.component('cart-item', {
    props: ['item'],

    template: `<div class="cart-item" v-if="item.count > 0">
    <h4>{{ item.product_name }} {{ item.type }} <button class="del-btn" @click="remove(item)">[x]</button></h4> 
    <p>Количество: <button class="count-btn" @click="countDown(item)">[-]</button> {{ item.count }} <button class="count-btn" @click="countUp(item)">[+]</button></p>
    <p>Цена: {{ item.price * item.count }} руб.</p>
  </div>`,

    methods: {
        countDown(item) {
            item.count--;
            if (item.count <= 0) {
                this.remove(item);
            }
        },

        countUp(item) {
            item.count++
        },

        remove(item) {
            PostResp('/removeItem', item);
        }

    }
});

// КАТАЛОГ

Vue.component('catalog-list', {
    props: ['items'],

    template: `<div class="catalog-list">
                <catalog-item v-for="item in items" :item="item"></catalog-item>
                </div>`,
});

// ТОВАР

Vue.component('catalog-item', {
    props: ['item'],

    template: `<div class="catalog-item">
    <h3>{{ item.product_name }}</h3>
    <p>{{ item.type }}</p>
    <p>Цена: {{ item.price }} руб.</p>
    <button class="catalog-item-button" @click="addToCart(item)">Добавить в корзину</button>
  </div>`,

    methods: {
        addToCart(item) {
            PostResp('/addToCart', item);
        }
    }
});

// ОШИБКА 

Vue.component('catalog-error', {
    template: `<p>Ошибка соединения. Повторите позднее</p>`,
})

// ВЬЮ

const app = new Vue({
    el: '#app',
    data: {
        items: [],
        filteredItems: [],
        isError: false,
        isItemsListEmpty: false,
        cartItems: [],
    },
    mounted() {
        fetch('/catalog.json')
            .then((response) => response.json())
            .then((data) => {
                this.items = data;
                this.filteredItems = data;
            })
            .catch(() => {
                this.isError = true;
            });
        fetch('/cart.json')
            .then((response) => response.json())
            .then((data) => {
                app.cartItems = data;
            });
    },
});

