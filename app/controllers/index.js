const auth_controller = require("./auth/auth.controller");
const verify_controller = require("./auth/verify.controller");
const forget_controller = require("./auth/forget.controller");
const reset_controller = require("./auth/reset.controller");

const user_controller = require("./user/user.controller");
const address_controller = require("./user/address.controller");

const product_controller = require("./product/product.controller");
const brand_controller = require("./product/brand.controller");
const category_controller = require("./product/category.controller");
const manufacturingCountry_controller = require("./product/manufacturingCountry.controller");

const payment_controller = require("./order/payment.controller");
const order_controller = require("./order/order.controller");
const orderItems_controller = require("./order/orderItem.controller");

const cart_controller = require("./cart/cart.controller");
const cartItems_controller = require("./cart/cartItem.controller");

const discount_controller = require("./discount/discount.controller");
const image_controller = require("./image/image.controller");
const version_controller = require("./version/version.controller");
const version_websocket_controller = require("./version/version.websocket.controller");


const language_controller = require("./language/language.controller");
const translation_controller = require("./translation/translation.controller");
module.exports = {
  auth_controller,
  user_controller,
  verify_controller,
  forget_controller,
  reset_controller,
  product_controller,
  brand_controller,
  category_controller,
  manufacturingCountry_controller,
  address_controller,
  payment_controller,
  cart_controller,
  cartItems_controller,
  order_controller,
  orderItems_controller,
  discount_controller,
  image_controller,
  version_controller,
  version_websocket_controller,
  language_controller,
  translation_controller

};
