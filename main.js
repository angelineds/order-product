let orders = [];
const RENDER_EVENT = 'render-order';

const quantities = {
  'menu-1': 0,
  'menu-2': 0,
  'menu-3': 0,
  'menu-4': 0,
  'menu-5': 0,
  'menu-6': 0,
  'menu-7': 0,
  'menu-8': 0,
  'menu-9': 0
};

document.addEventListener('DOMContentLoaded', function() {
  const addOrder_buttons = document.querySelectorAll('.addCart');
  const addQuantity_buttons = document.querySelectorAll('.quantity-button__inc');
  const decQuantity_buttons = document.querySelectorAll('.quantity-button__dec');
  
  const submitOrder_button = document.getElementById('submit-cartOrder');
  const mainPage = document.getElementById('mainPage');
  const overlayPage = document.getElementById('overlayPage');
  const orderAgain_button = document.getElementById('submit-orderConfirmation');

  addOrder_buttons.forEach(addOrder_button => {
    addOrder_button.addEventListener('click', () => {
      const menu = addOrder_button.getAttribute('data-menu');
      addQuantity(menu);
      updateQuantityInput(menu);
      changeAddOrder__button(menu);
      addOrder(menu);
    });
  });

  addQuantity_buttons.forEach(addQuantity_button => {
    addQuantity_button.addEventListener('click', () => {
      const menu = addQuantity_button.getAttribute('data-menu');
      addQuantity(menu);
      updateQuantityInput(menu);
      addOrder(menu);
    });
  });

  decQuantity_buttons.forEach(decQuantity_button => {
    decQuantity_button.addEventListener('click', () => {
      const menu = decQuantity_button.getAttribute('data-menu');
      decQuantity(menu);
      updateQuantityInput(menu);
      addOrder(menu);
    });
  });

  submitOrder_button.addEventListener('click', () => {
    mainPage.style.overflow = 'hidden';
    overlayPage.style.display = 'block';
    overlayPage.style.overflowY = 'auto'
  });

  orderAgain_button.addEventListener('click', () => {
    mainPage.style.overflow = 'auto';
    overlayPage.style.display = 'none';
    overlayPage.style.overflowY = 'hidden';
    resetAll();
  });
});

function changeAddOrder__button(menu) {
  const menu_image = document.querySelector(`#menuImage[data-menu="${menu}"]`);
  const addCart_button = document.querySelector(`.addCart[data-menu="${menu}"]`);
  const quantity_button = document.querySelector(`.quantity-button[data-menu="${menu}"]`);
  
  const quantity = quantities[menu];

  if (quantity > 0) {
    addCart_button.style.visibility = 'hidden';
    quantity_button.style.visibility = 'visible';
    menu_image.style.border = '2px solid hsl(14, 86%, 42%)';
  } else {
    quantity_button.style.visibility = 'hidden';
    addCart_button.style.visibility = 'visible';
    menu_image.style.border = '2px solid hsl(14, 25%, 90%)';
  }
}

function addQuantity(menu) {
  quantities[menu]++;
}

function decQuantity(menu) {
  if (quantities[menu] > 0) {
    quantities[menu]--;
    changeAddOrder__button(menu);
  }
}

function updateQuantityInput(menu) {
  const inputQuantity = document.querySelector(`.quantity_value[data-menu="${menu}"]`);
  inputQuantity.textContent = quantities[menu];
}

function addOrder(menu) {
  const menuName = document.querySelector(`#title[data-menu="${menu}"]`).textContent;
  const menuPrice = parseFloat(document.querySelector(`#price[data-menu="${menu}"]`).textContent.slice(1));
  const menuQuantity = quantities[menu];
  const menuImageSrc = document.querySelector(`#menuImage[data-menu="${menu}"]`).getAttribute('src');

  const existingOrder = orders.find(order => order.title === menuName);
  if (existingOrder) {
    existingOrder.quantity = menuQuantity;
  } else {
    const menuObject = generateMenuObject(menu, menuName, menuPrice, menuQuantity, menuImageSrc);
    orders.push(menuObject);
  }
  orders = orders.filter(order => order.quantity > 0);
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateMenuObject(menu, title, price, quantity, imageSrc) {
  return {
    menu,
    title,
    price,
    quantity,
    imageSrc
  }
}

function resetAll() {
  orders = [];
  for (const key in quantities) {
    quantities[key] = 0;
  }

  const orderList = document.getElementById('cartOrderList');
  const confirmationList = document.getElementById('orderConfirmation__items');
  const orderTotalItem = document.getElementById('orderTotal_item');
  const totalOrderPrice = document.getElementById('orderTotal_value');

  orderList.innerHTML = '';
  confirmationList.innerHTML = '';

  orderTotalItem.textContent = 'Your cart (0)';
  totalOrderPrice.textContent = '$0.00';
  
  const addCartButtons = document.querySelectorAll('.addCart');
  const quantityButtons = document.querySelectorAll('.quantity-button');
  const menuImages = document.querySelectorAll('#menuImage');

  addCartButtons.forEach(button => button.style.visibility = 'visible');
  quantityButtons.forEach(button => button.style.visibility = 'hidden');
  menuImages.forEach(image => image.style.border = '2px solid hsl(14, 25%, 90%)');
  
  // Reset each quantity input to 0
  document.querySelectorAll('.quantity_value').forEach(input => input.textContent = 0);
  updateCartDisplay();

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener(RENDER_EVENT, function () {
  const orderList = document.getElementById('cartOrderList');
  const orderTotalItem = document.getElementById('orderTotal_item');
  const totalOrderPrice = document.getElementById('orderTotal_value');
  const confirmationList = document.getElementById('orderConfirmation__items');

  orderList.innerHTML = '';
  confirmationList.innerHTML = '';

  updateCartDisplay();
  totalPrice = 0;

  for (const orderItem of orders) {
    const {orderContainer, confirmationContainer, itemTotal} = makeOrderList(orderItem);
    orderList.appendChild(orderContainer);
    confirmationList.appendChild(confirmationContainer);
    totalPrice += itemTotal;
  }
  orderTotalItem.textContent = `Your cart (${orders.length})`;
  totalOrderPrice.textContent = `$${totalPrice.toFixed(2)}`;

  // For confirmation function
  const confirmOrderTotal = document.createElement('div');
  confirmOrderTotal.classList.add('confirmationOrderTotal');

  const orderTotal = document.createElement('p');
  orderTotal.textContent = "Order total";

  const confirmTotalPrice = document.createElement('p');
  confirmTotalPrice.classList.add('confirmationTotalValue');
  confirmTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;

  confirmOrderTotal.appendChild(orderTotal);
  confirmOrderTotal.appendChild(confirmTotalPrice);

  confirmationList.appendChild(confirmOrderTotal);
});

function updateCartDisplay() {
  const emptyCart = document.getElementById('cartEmpty');
  const orderList = document.getElementById('cartOrderList');
  const totalOrder = document.getElementById('cartOrderTotal');
  const deliveryLogo = document.getElementById('cartDelivery');
  const submitOrder = document.getElementById('submit-cartOrder');

  if (orders.length === 0) {
    emptyCart.style.display = 'block';
    orderList.style.display = 'none';
    totalOrder.style.display = 'none';
    deliveryLogo.style.display = 'none';
    submitOrder.style.display = 'none';
  } else {
    emptyCart.style.display = 'none';
    orderList.style.display = 'block';
    totalOrder.style.display = 'flex';
    deliveryLogo.style.display = 'flex';
    submitOrder.style.display = 'block';
  }
}

function makeOrderList(orderItem) {
  // For cart function
  const orderContainer = document.createElement('div');
  orderContainer.classList.add('cart-orderItem');

  const menuContainer = document.createElement('div');
  menuContainer.classList.add('cart-orderItemMenu');

  const textTitle = document.createElement('p');
  textTitle.classList.add('orderItem_name');
  textTitle.textContent = orderItem.title;

  const quantityContainer = document.createElement('div');
  quantityContainer.classList.add('cart-orderItemQuantity');

  const textQuantity = document.createElement('p');
  textQuantity.classList.add('orderItem_quantity');
  textQuantity.textContent = `${orderItem.quantity}x`;

  const textPrice = document.createElement('p');
  textPrice.classList.add('orderItem_price');
  textPrice.textContent = `@ $${orderItem.price.toFixed(2)} →`;

  const textTotal = document.createElement('p');
  textTotal.classList.add('orderItem_totalPrice');

  const itemTotal =  orderItem.quantity * orderItem.price;
  textTotal.textContent = `$${itemTotal.toFixed(2)}`;

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('orderItem_delete');
  deleteButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 10 10" class="icon_removeItem">
      <path fill="currentColor" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/>
    </svg>`;

  deleteButton.addEventListener('click', () => {
    const index = orders.findIndex(order => order.title === orderItem.title);
    if (index > -1) orders.splice(index, 1);
    quantities[orderItem.menu] = 0;
    updateQuantityInput(orderItem.menu); 

    changeAddOrder__button(orderItem.menu);
    document.dispatchEvent(new Event(RENDER_EVENT));
  });

  // For order confirmation function
  const confirmationContainer = document.createElement('div');
  confirmationContainer.classList.add('orderConfirmation__item');

  const confirmationItemContainer = document.createElement('div');
  confirmationItemContainer.classList.add('confirmation__item');

  const confirmImage = document.createElement('img');
  confirmImage.classList.add('menuImage-confirm');
  confirmImage.src = orderItem.imageSrc;

  const confirmItemDetail = document.createElement('div');
  confirmItemDetail.classList.add('confirmation__itemDetail');

  const confirmName = document.createElement('p');
  confirmName.classList.add('confirmation__name');
  confirmName.textContent = orderItem.title;

  const confirmQuantityDetail = document.createElement('div');
  confirmQuantityDetail.classList.add('confirmation__itemQuantity');
  
  const confirmQuantity = document.createElement('p');
  confirmQuantity.classList.add('confirmation__quantity');
  confirmQuantity.textContent = `${orderItem.quantity}x`;

  const confirmPrice = document.createElement('p');
  confirmPrice.classList.add('confirmation__price');
  confirmPrice.textContent = `@ $${orderItem.price.toFixed(2)}`;

  const confirmTotalItem = document.createElement('p');
  confirmTotalItem.classList.add('confirmation__total');
  confirmTotalItem.textContent = `$${itemTotal.toFixed(2)}`;

  // For cart function
  quantityContainer.appendChild(textQuantity);
  quantityContainer.appendChild(textPrice);
  quantityContainer.appendChild(textTotal);

  menuContainer.appendChild(textTitle);
  menuContainer.appendChild(quantityContainer);

  orderContainer.appendChild(menuContainer);
  orderContainer.appendChild(deleteButton);

  // for confirmation function
  confirmQuantityDetail.appendChild(confirmQuantity);
  confirmQuantityDetail.appendChild(confirmPrice);

  confirmItemDetail.appendChild(confirmName);
  confirmItemDetail.appendChild(confirmQuantityDetail);

  confirmationItemContainer.appendChild(confirmImage);
  confirmationItemContainer.appendChild(confirmItemDetail);

  confirmationContainer.appendChild(confirmationItemContainer);
  confirmationContainer.appendChild(confirmTotalItem);

  console.log(orders);
  return { orderContainer, confirmationContainer, itemTotal };
}