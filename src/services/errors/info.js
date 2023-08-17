export const generateUserErrorInfo = (newUser) => {
  return `One or more properties were incomplete or not valid.
  List of required Properties:
  * nombre : needs to be a string , se recibio: ${newUser.first_name}
  * apellido : needs to be a string , se recibio:  ${newUser.last_name}
  * edad : needs to be a number , se recibio:  ${newUser.age}
  * email : needs to be a string , se recibio:  ${newUser.email}`;
};

export const generateProductErrorInfo = (product) => {
  return `One or more properties were incomplete or not valid.
  List of required Properties:
  * Title: needs to be a string, received: ${product.title}
  * Price: needs to be a number, received:  ${product.price}
  * Description: needs to be a string, received:  ${product.description}
  * Thumbnail: needs to be a string, received:  ${product.thumbnail}`;
};

export const generateCartErrorInfo = (cart) => {
  return `One or more properties were incomplete or not valid.
  List of required Properties:
  * product: needs to be a string, received: ${cart.product}
  * quantity : needs to be a number, received:  ${cart.quantity}
  * price: needs to be a Number, received:  ${cart.price}
`;
};
