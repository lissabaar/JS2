'use strict';

class Item {
    constructor(item) {
        let { title, price = 'Уточняйте по телефону', id, type = '' } = item;
        this.title = title;
        this.price = price;
        // this.img = img;
        this.id = id;
        this.type = type;
    }
    render() {
        return `<div class="catalog-item"><h3>${this.title}</h3>
        <p>${this.type}</p>
        <p>Цена: ${this.price} руб.</p>
        <button class="catalog-item-button" onclick="addToCart(${this.id})">Добавить в корзину</button>
        </div>`;
    }
}

class Catalog {
    constructor() {
        this.items = [];
    }
    fetchGoods() {
        this.items = [
            {
                id: 0,
                title: 'LG',
                price: 50,
                color: 'Черный',
                type: 'Телефон'
            },
            {
                id: 1,
                title: 'Samsung',
                price: 150,
                color: 'Красный',
                type: 'Ноутбук'
            },
            {
                id: 2,
                title: 'Apple',
                price: 20,
                color: 'Белый',
                type: 'Наушники'
            },
            {
                id: 3,
                title: 'Dell',
                price: 10,
                color: 'Белый',
                type: 'Монитор'
            },
            {
                id: 4,
                title: 'Xiaomi',
                price: 50,
                color: 'Черный',
                type: 'Телефон'
            },
            {
                id: 5,
                title: 'MSI',
                price: 150,
                color: 'Красный',
                type: 'Ноутбук'
            },
            {
                id: 6,
                title: 'Lenovo',
                price: 20,
                color: 'Белый',
                type: 'Ноутбук'
            }
        ];
    }
    render() {
        let listHtml = '';
        this.items.forEach(item => {
            const catalogItem = new Item(item);
            listHtml += catalogItem.render();
        });
        document.querySelector('.catalog-list').innerHTML = listHtml;
    }
}

// 1. Добавьте пустые классы для корзины товаров и элемента корзины товаров. Продумайте, какие методы понадобятся для работы с этими сущностями.

class Cart {
    constructor() {
        this.items = [];
    }
    render() { } // сформировать корзину
    clear() { } // очистить корзину
    purchase() { } // сделать заказ
    sum() { } // посчитать общую стоимость

}


class CartItem extends Item {
    render() {
        return `<h3>${this.title}</h3>
        <span class="cart-item-point">Тип: ${this.type}</span>
        <span class="cart-item-point">Цена: ${this.price}</span>
        <span class="cart-item-point">Количество: <button class="countdown-btn" onclick="countDown()">[-]</button> ${this.count} 
        <button class="countup-btn" onclick="countUp()">[+]</button></span>`
    }
    countUp() { }
    countDown() { }
}

// КАТАЛОГ

const list = new Catalog();
list.fetchGoods();
list.render();


// ВЫПАДАЮЩАЯ КОРЗИНА

const cartDiv = document.getElementById('user-cart');
const cartBtn = document.getElementById('cart-btn');
const cartCloseBtn = document.getElementById('cart-close');

cartBtn.addEventListener('click', () => {
    cartDiv.style.display = 'block';
})
cartCloseBtn.addEventListener('click', () => {
    cartDiv.style.display = 'none';
})



// ТОВАРЫ В КОРЗИНЕ
var cart = new Cart;
cart.items = JSON.parse(localStorage.getItem('cartItems')) || [];

function renderCart() {
    const cartItemsList = document.getElementById('cart-items');
    cartItemsList.innerHTML = '';

    if (cart.items.length == 0) {
        cartItemsList.innerHTML = 'Корзина пуста.';
    }

    var totalCount = 0;
    var totalSum = 0;

    for (let i = 0; i < cart.items.length; i++) {

        var cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `<h3>${cart.items[i].title}</h3>
        <span class="cart-item-point">Тип: ${cart.items[i].type}</span>
        <span class="cart-item-point">Цена: ${cart.items[i].price}</span>
        <span class="cart-item-point">Количество: <button class="countdown-btn" onclick="countDown()">[-]</button> ${cart.items[i].count} 
        <button class="countup-btn" onclick="countUp()">[+]</button></span>`;

        if (cartItemsList != null) {
            cartItemsList.appendChild(cartItem);
        }

        totalCount += cart.items[i].count;
        totalSum += cart.items[i].price * cart.items[i].count;
    }

    var cartPrice = document.createElement('div');
    cartPrice.className = 'cart-sum';
    cartPrice.innerHTML = `В корзине: ${totalCount} товаров на сумму ${totalSum} руб.`
    if (cart.items.length > 0) {
        cartItemsList.appendChild(cartPrice);
    }
}

// ДОБАВЛЕНИЕ В КОРЗИНУ 

function addToCart(itemId) {
    let isNew = true;
    if (cart.items.length > 0) {
        for (let i = 0; i < cart.items.length; i++) {
            if (itemId == cart.items[i].id) {
                cart.items[i].count++;
                isNew = false;
                break;
            }
        }
    }
    if (isNew) {
        cart.items.push(list.items[itemId]);
        cart.items[cart.items.length - 1].count = 1
    }
    localStorage.setItem('cartItems', JSON.stringify(cart.items))
    renderCart();
}

renderCart()


// TO DO
function countDown() {
    console.log('down')
}
function countUp() {
    console.log('UP')
}