const httpError = require('http-errors');
const validator = require('validator');
const db = require("../models");
const { user: User, address: Address, cartItem: CartItem,card: Card } = db;

// ------- sync helper functions ----------------------------------

/**
 * Helper function to check id is valid:
 *      - id is not null 
 *      - id is of type integer or number
 *      - id is greater than 0
 *      - id is a whole number
 * 
 * Can be used to check user_id, cart_id, or any id 
 * that should meet the above requirements for entering into db.
 * 
 * @param {String} id 
 */
 var validateID = module.exports.validateID = (id) => {
    if (!(id !== null &&
        (typeof id === 'number' && id > 0 && Number.isInteger(id)) ||       // case when id is number
        (typeof id === 'string' && validator.isInt(id, {min: 1}))           // case when id is a string
    )) {
        return httpError(400, 'Invalid input.');
    }
}


/**
 * Helper function to check nullable id is valid:
 *      - id is of type integer or number
 *      - id is greater than 0
 *      - id is a whole number
 * 
 * Can be used to check user_id, cart_id, or any id 
 * that should meet the above requirements.
 * 
 * @param {String, Number} id 
 */
 var validateNullableID = module.exports.validateNullableID = (id) => {
    if (!(id !== null &&
        (typeof id === 'number' && id > 0 && Number.isInteger(id)) ||       // case when id is number
        (typeof id === 'string' && validator.isInt(id, {min: 1}))           // case when id is a string
    ) && id !== null) {
        return httpError(400, 'Invalid input.');
    }
}


/**
 * Helper function to check name is valid:
 *      - name is not null 
 *      - name is of string type
 *      - name is longer than 0 characters
 *      - name is shorter than 30 characters 
 * 
 * Can be used to check first_name, last_name, or any other string 
 * that should meet the above requirements for entering into db.
 * 
 * @param {String} name 
 */
 var validateName = module.exports.validateName = (name) => {
    if (name === undefined || 
        name === null || 
        typeof name !== 'string'  ||
        name.length === 0  || 
        name.length > 35
    ) {
        return httpError(400, 'Invalid input.');
    }
}


/**
 * Helper function to check email is valid:
 *      - email is not null 
 *      - email is longer than 3 characters
 *      - email is shorter than 30 characters 
 *      - email is email format 
 * @param {String} email email address of user
 */
 var validateEmail = module.exports.validateEmail = (email) => {
    if (email === undefined || 
        email === null || 
        email.length < 3 ||
        email.length > 30 ||
        !validator.isEmail(email) 
    ) {
        return httpError(400, 'Invalid input.');
    }
}


/**
 * Helper function to check password is valid:
 *      - password is not null 
 *      - password is longer than 8 characters
 *      - password is shorter than 30 characters 
 *      - password contains at least 1 number, 1 uppercase char, 1 lowercase char
 * @param {String} password password of user
 */
 var validatePassword = module.exports.validatePassword = (password) => {
    if (password === undefined || 
        password === null || 
        password.length > 30 ||
        !validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0}) 
    ) {
        return httpError(400, 'Invalid input.');
    }
}


/**
 * Helper function to check quantity is valid:
 *      - quantity is not null 
 *      - quantity is of type number
 *      - quantity is greater than 0
 *      - quantity is a whole number
 * 
 * @param {String} quantity
 */
 var validateQuantity = module.exports.validateQuantity = (quantity) => {
    if (quantity === undefined ||
        quantity === null || 
        typeof quantity !== 'number' ||
        quantity <= 0 ||
        !Number.isInteger(quantity)
    ) {
        return httpError(400, 'Invalid input.');
    }
}


/**
 * Helper function to check price is valid:
 *      - price is not null 
 *      - price is of type number or 
 *      - price is greater than 0
 *      - price is in proper format to be currency
 * 
 * @param {String} price
 */
 var validatePrice = module.exports.validatePrice = (price) => {
    if (price === undefined || 
        price === null || 
        typeof price !== 'number' ||
        price <= 0 ||
        !validator.isCurrency(`${price}`)
    ) {
        return httpError(400, 'Invalid input.');
    }
}


/**
 * Validates a value that:
 *      - may be of type string or number
 *      - is a whole number
 *      - is between min and max  
 * Throws error if not 
 * 
 * @param {String, Number} value value being validated 
 * @param {Number} min
 * @param {Number} max
 * @return {Boolean} true if value meets requirements
 */
 var validateValue = module.exports.validateValue = (value, min, max) => {
    return (
        (
            typeof value === 'string'       && 
            validator.isInt(value, { min: min, max: max })
        ) || (
            typeof value === 'number'       && 
            Number.isInteger(value)         && 
            value >= min                    &&
            value <= max 
        )
    )
}


/**
 * Helper function to check that expiration date of card is valid
 * 
 * @param {int} expMonth
 * @param {int} expYear
 * @return {bool} True if expiration date is valid and has not passed
*/
var expDateIsValid = module.exports.expDateIsValid = (expMonth, expYear) => {
    // create Date object of now
    const now = new Date()

    // create Date object of expiration
    const expDate = new Date(expYear, expMonth);

    // returns true if expDate has NOT passed
    return now < expDate;
}


/**
 * Helper function to check that Auth inputs are valid:
 *      - valid inputs provided
 *      - email is email format
 *      - password is valid
 *      - password is strong
 * Otherwise returns error
 *
 * @param {Object} data has properties: 
 *      - email 
 *      - password
 */
module.exports.validateAuthInputs = (data) => {
    validateEmail(data.email);
    validatePassword(data.password);
}


/** 
 * Validator function for Cart:
 *      - validate values
 * Throws errors if not 
 * 
 * @param {Object} data data about cartItem
 * @return {Object} cartItem object
 */
 module.exports.validateCart = (data) => {
    // returns error if inputs invalid
    validateID(data.id);
    validateID(data.user_id);
    validatePrice(data.total);
    validateQuantity(data.num_items);
}


/** 
 * Validator function for User (account) inputs:
 *      - validate inputs to prevent XSS attack
 *      - Use for updating a User object
 * Throws errors if not 
 * 
 * @param {Object} data properties are inputs of a User object that can be updated: 
 *      - first_name (may be undefined)
 *      - last_name (may be undefined)
 *      - email (may be undefined)
 *      - password (may be undefined)
 */
module.exports.validateUserInputs = (data) => {
    // check each existing property in data for valid inputs
    if (data.first_name !== undefined) validateName(data.first_name);
    if (data.last_name !== undefined) validateName(data.last_name);
    if (data.email !== undefined) validateEmail(data.email);
    if (data.password !== undefined) validatePassword(data.password);
}


/**
 * Validator function for Cart Item inputs:
 *      - validate inputs to prevent XSS attack
 *      - Use for creating or updating a Cart Item object
 * Throws errors if not 
 * 
 * @param {Object} data properties are inputs of an Cart Item object: 
 *      - cart_id
 *      - user_id
 *      - product_id
 *      - quantity
 */
module.exports.validateCartItemInputs = (data) => {
    validateNullableID(data.cart_id);
    validateNullableID(data.user_id);
    validateID(data.product_id);
    validateQuantity(data.quantity);
}


/** 
 * Validator function for Address inputs:
 *      - validate inputs to prevent XSS attack
 *      - Use for creating or updating an Address object
 * Throws errors if not 
 * 
 * @param {Object} data properties are inputs of an Address object: 
 *      - address1
 *      - address2 (may be undefined or null)
 *      - city 
 *      - state 
 *      - country 
 *      - isPrimaryAddress (may be undefined or null)
 *      - first_name
 *      - last_name 
 *      - user_id
 */
 module.exports.validateAddressInputs = (req, res , next) => {

    req.body.userId = req.userId
    // make sure address2 and isPrimaryAddress properties are defined 
    req.body.address2 = (req.body.address2 === undefined) ? null : req.body.address2;
    req.body.isPrimaryAddress = (req.body.isPrimaryAddress === undefined) ? null : req.body.isPrimaryAddress ;

    const { address1, 
        address2,               // can be null or undefined
        city, 
        state,
        zip,
        country,
        isPrimaryAddress,        // can be null or undefined
        userId 
    } = req.body;

    // call other validators for applicable inputs
  // validateID(userId);

    // check for valid inputs 
    if ( address1 === undefined  || address1 === null        || typeof address1   !== 'string'  ||
        city === undefined       || city === null            || typeof city       !== 'string'  ||
        state === undefined      || state === null           || typeof state      !== 'string'  ||
        zip === undefined        || zip === null             || typeof zip        !== 'string'  ||
        country === undefined    || country === null         || typeof country    !== 'string'  ||
        address1.length === 0    || address1.length > 30     ||
        city.length === 0        || city.length > 30         ||
        state.length === 0        || state.length > 30         ||
        zip.length < 5           || zip.length > 10          ||
        country.length === 0     || country.length > 30      ||
        (isPrimaryAddress !== undefined && isPrimaryAddress !== null && 
            (typeof isPrimaryAddress !== 'boolean'))       ||
        (address2 !== undefined && address2 !== null && 
            (typeof address2 !== 'string'|| address2.length === 0 || address2.length > 30))    
    ){
       return res.status(400).send({ message: "Invalid input." });
    }
    
   next();
}


/** 
 * Validator function for payment inputs:
 *      - validate inputs to prevent XSS attack
 *      - Use for creating or updating a Card object
 * Throws errors if not 
 * 
 * @param {Object} data properties are inputs of a Card object: 
 *      - cardType (may be undefined or null)
 *      - provider 
 *      - cardNo 
 *      - cvv 
 *      - expMonth 
 *      - expYear 
 *      - billingAddressId
 *      - isPrimaryPayment (may be undefined or null)
 *      - user_id
 */
module.exports.validatePaymentInputs = (req, res , next) => {
    // make sure cardType and isPrimaryPayment properties are defined 
    req.body.cardType = (req.body.cardType === undefined) ? null : req.body.cardType;
    req.body.isPrimaryPayment = (req.body.isPrimaryPayment === undefined) ? null : req.body.isPrimaryPayment ;

    const { 
        cardType,          // can be null or undefined
        provider,   
        cardNo, 
        cvv,
        expMonth,
        expYear,
        billingAddressId,     
        isPrimaryPayment,       // can be null or undefined
        userId  
    } = req.body;

    // call other validators for applicable inputs
    validateID(userId);
    validateID(billingAddressId); 

    // check for valid inputs 
    if (provider === undefined              || provider === null                   || typeof provider !== 'string'         ||
        cardNo === undefined               || cardNo === null                    || typeof cardNo !== 'string'          ||
        cvv === undefined                   || cvv === null                        || typeof cvv !== 'string'              ||
        expMonth === undefined             || expMonth === null                  || 
        expYear === undefined              || expYear === null                   || 
        provider.length === 0               || provider.length > 20                ||
        cardNo.length !== 16               ||
        cvv.length !== 3                    ||
        !validateValue(expMonth, 1, 12)    ||
        !validateValue(expYear, 2021, 2100)||
        !validator.isNumeric(cardNo)       || 
        !validator.isNumeric(cvv)           ||
        !expDateIsValid(expMonth, expYear)||
        (isPrimaryPayment !== undefined && isPrimaryPayment !== null && 
            (typeof isPrimaryPayment !== 'boolean'))       ||
        (cardType !== undefined && cardType !== null && 
            (typeof cardType !== 'string' || !(cardType === 'credit' || cardType === 'debit')))
    ){
        return res.status(400).send({ message: "Payment inputs invalid." });
     }
     
    next();    
}




//------------------------------------------------------------------
// ------- async helper functions ----------------------------------
//------------------------------------------------------------------

 /** 
 * Validator function for User services:
 *      - validate inputs
 *      - get user object 
 * Throws errors if not 
 * 
 * @param {Integer} user_id ID of user to get
 * @return {Object} user object
 */
module.exports.validateUser = async (user_id) => {
    try {
        // return error if inputs invalid
        validateID(user_id);

        // check if user exists
        const user = await User.findById(user_id);

        // return error if user does not exist
        if (!user) {
            return httpError(404, 'User not found.');
        }

        return user;

    } catch(err) {
        return err;
    }
}


/**
 * Validator function for Address services:
 *      - valid input provided
 *      - address exists
 *      - address is associated with authenticated user
 * Otherwise returns error
 *
 * @param {Object} data data about address and user
 * @return {object} address
 */
module.exports.validateAddress = async (data) => {
    try {
        // check for valid input
        validateID(data.address_id);
        validateID(data.user_id);

        // find address by id
        const address = await Address.findById(data.address_id);
        if (!address) {
            return httpError(404, 'Address not found.');
        }

        // check that address's user_id matches authenticated user_id
        if (address.user_id !== data.user_id) {
            return httpError(403, 'Address does not match user.')
        }

        return address;

    } catch(err) {
        return err;
    }
}


/**
 * Validator function for payment services:
 *      - valid input provided
 *      - payment method exists
 *      - payment method is associated with authenticated user
 * Otherwise returns error
 *
 * @param {Object} data data about payment method and user
 * @return {object} Card object that is payment method
 */
module.exports.validatePayment = async (data) => {
    try {
        // check for valid input
        validateID(data.payment_id);
        validateID(data.user_id);

        // find payment by id
        const payment = await Card.findById(data.payment_id);
        if (!payment) {
            return httpError(404, 'Payment not found.');
        }

        // check that payment method's user_id matches authenticated user_id
        if (payment.user_id !== data.user_id) {
            return httpError(409, 'Payment does not match user.')
        }

        return payment;

    } catch(err) {
        return err;
    }
}


/** 
 * Validator function for CartItem:
 *      - validate inputs
 *      - get cartItem object 
 * Throws errors if not 
 * 
 * @param {Object} data data about cartItem
 * @return {Object} cartItem object
 */
module.exports.validateCartItem = async (data) => {
    try {
        // return error if inputs invalid
        validateID(data.cart_id);
        validateID(data.product_id);
        if (data.quantity !== undefined) validateQuantity(data.quantity);

        // find cart item
        const cartItem = await CartItem.findOne(data);
        
        // return error if not found
        if (!cartItem) {
            return httpError(404, 'Cart item not found');
        }

        return cartItem;
        
    } catch(err) {
        return err;
    }
}
