const express = require("express");
const bodyParser = require("body-parser");
const xss = require ('xss-clean');
const cors = require ('cors');
const helmet = require ('helmet');

const app = express();

var corsOptions = {
  origin: "http://localhost:5173"
};
// var corsOptions = {
//   origin: "http://localhost:3000"
// };
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors(corsOptions));
app.use (xss ());
app.use (bodyParser.json ({ limit: '10kb' }));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// database
const db = require("./app/models/");
const Role = db.role;
const OrderStatus = db.orderStatus;
const CardType = db.cardType;

 //db.sequelize.sync();
// //force: true will drop the table if it already exists
//  db.sequelize.sync({force:true}).then(() => {
//    console.log('Drop and Resync Database with { force: true }');
//  initial(); 
//  });  

// simple route 
app.get("/", (req, res) => {
  res.json({ message: "Welcome to allora-ecommerce application." });
});

// routes
require('./app/routes/auth/auth.routes')(app);
require('./app/routes/user/user.routes')(app);
require('./app/routes/user/address.routes')(app);

require('./app/routes/product/product.routes')(app);
require('./app/routes/product/brand.routes')(app);
require('./app/routes/product/category.routes')(app);
require('./app/routes/product/manufacturingCountry.routes')(app);

require('./app/routes/discount/discount.routes')(app);

require('./app/routes/order/order.routes')(app);
require('./app/routes/payment/payment.routes')(app);

require('./app/routes/cart/cart.routes')(app);
require('./app/routes/cart/cartItems.routes')(app);
// set port, listen for requests
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.create({
    id: 1,
    name: "user"
  });
 
  Role.create({
    id: 2,
    name: "moderator"
  });
 
  Role.create({
    id: 3,
    name: "admin"
  });




  CardType.create({
    id: 1,
    name: "credit"
  });
 
  CardType.create({
    id: 2,
    name: "debit"
  });



  OrderStatus.create({
    id: 1,
    name: "pending"
  });
 
  OrderStatus.create({
    id: 2,
    name: "shipped"
  });
 
  OrderStatus.create({
    id: 3,
    name: "delivered"
  });
  OrderStatus.create({
    id: 4,
    name: "canceled"
  });
}