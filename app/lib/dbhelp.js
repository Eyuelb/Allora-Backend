const httpError = require('http-errors');
const db = require("../models");
const { idExists, userIdExists, userExists, ifExists ,findById,add,deletebyid } = require("../validators/checker");
const Op = db.Sequelize.Op;

   
getCartProduct = async (cartId,user,cart,cartItems,product) => {

    let cartResult = await findById(cart,cartId);
    if (cartResult.userId && cartResult.id) {
      let userResult = await userExists(user,cartResult.userId);
      if (userResult) {
        let cartItemsResult = await ifExists(cartItems, { cartId: cartResult.id });
        if (cartItemsResult.count) {
      
          var cartItems = []; 
          var subTotal = 0;



          for (var i = 0; i < cartItemsResult.count; i++){
            if(cartItemsResult.rows[i].productId !== null){
       let productResult = await ifExists(product, { id: cartItemsResult.rows[i].productId });
       if (productResult.rows[0]) {
          var totalPrice = parseInt(cartItemsResult.rows[i].quantity) * parseInt(productResult.rows[0].productPrice)
            cartItems[i] = 
              { 
              cartItemId:cartItemsResult.rows[i].id,
              quantity: cartItemsResult.rows[i].quantity,
              totalPrice: totalPrice,
              productId: productResult.rows[0].id,
              productName: productResult.rows[0].productName,
              productShortDescription: productResult.rows[0].productShortDescription, 
              productPrice: productResult.rows[0].productPrice, 
              productMainImage: productResult.rows[0].productMainImage, 
              productPrice: productResult.rows[0].productPrice       
              }



            subTotal = parseInt(totalPrice) + parseInt(subTotal) 
            }
            else{
              return httpError(400, "error occurred in product Id="+cartItemsResult.rows[i].productId);
            }
          }



            else{
              const result = deletebyid(cartItems,{id:cartItemsResult.rows[i].id});
               return result 
             }

        }
        return {
          userId:userResult.id,
          cartId:cartId,
          subTotal:subTotal,
          chartItemsCount:cartItemsResult.count,
          cartItems
        }

      }
        else{
          return httpError(400, "error occurred while retrieving cart id="+cartResult.id);
        }
      }
      else{
        return httpError(400, "error occurred while retrieving user id="+cartResult.userId);
      }
    }
    else{
      return httpError(400, "error occurred while retrieving cartItems id="+cartId);
    }
    

    



};



copyCartProductToOrder = async (cartId,user,cart,cartItems,product) => {

  let cartResult = await findById(cart,cartId);
  if (cartResult.userId && cartResult.id) {
    let userResult = await userExists(user,cartResult.userId);
    if (userResult) {
      let cartItemsResult = await ifExists(cartItems, { cartId: cartResult.id });
      if (cartItemsResult.count) {
    
        var orderedItems = []; 
        var subTotal = 0
        for (var i = 0; i < cartItemsResult.count; i++){
          if(cartItemsResult.rows[i].productId !== null){
      let productResult = await ifExists(product, { id: cartItemsResult.rows[i].productId });
     if (productResult.rows[0]) {
        var totalPrice = parseInt(cartItemsResult.rows[i].quantity) * parseInt(productResult.rows[0].productPrice)
        orderedItems[i] = 
            { 
            cartItemId:cartItemsResult.rows[i].id,
            quantity: cartItemsResult.rows[i].quantity,
            totalPrice: totalPrice,
            productId: productResult.rows[0].id,
            productName: productResult.rows[0].productName,
            productShortDescription: productResult.rows[0].productShortDescription, 
            productPrice: productResult.rows[0].productPrice, 
            productMainImage: productResult.rows[0].productMainImage, 
            productPrice: productResult.rows[0].productPrice       
            }
          subTotal = parseInt(totalPrice) + parseInt(subTotal)
          }
        }

      }
      return {
        userId:userResult.id,
        cartId:cartId,
        subTotal:subTotal,
        orderedItemsCount:cartItemsResult.count,
        orderedItems
      }

    }
      else{
        return httpError(400, "error occurred while retrieving cart id="+cartResult.id);
      }
    }
    else{
      return httpError(400, "error occurred while retrieving user id="+cartResult.userId);
    }
  }
  else{
    return httpError(400, "error occurred while retrieving cartItems id="+cartId);
  }
  

  



};



getCartItems = async (cartId,user,cart,cartItems,product) => {

  let cartResult = await findById(cart,cartId);
  if (cartResult.userId && cartResult.id) {
    let userResult = await userExists(user,cartResult.userId);
    if (userResult) {
      let cartItemsResult = await ifExists(cartItems, { cartId: cartResult.id });
      if (cartItemsResult.count) {
    
        return cartItemsResult

    }
      else{
        return httpError(400, "error occurred while retrieving cart id="+cartResult.id);
      }
    }
    else{
      return httpError(400, "error occurred while retrieving user id="+cartResult.userId);
    }
  }
  else{
    return httpError(400, "error occurred while retrieving cartItems id="+cartId);
  }
  

  


 
};





getorderedProducts = async (Order,id) => {

    let orderResult = await ifExists(Order,{id:id});
    if (orderResult.count) {
  
      return orderResult.rows[0].orderedProducts

  }
    else{
      return httpError(400, "error occurred while retrieving order id="+id);
    }

}

module.exports = {
  getCartProduct,
  getCartItems,
  copyCartProductToOrder,
  getorderedProducts
};
