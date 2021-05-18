const Cart = require('../../models/cart');

module.exports = async function validateCartData(param, value, ownerId) {
  switch (param) {
    case 'title':
      if (!value || value.trim().length < 1) {
        return 'Nazwa jest wymagana.';
      }

      if (value && value.length > 50) {
        return 'Nazwa jest zbyt długa. (max 50 znaków).';
      }

      const cart = await Cart.findOne({ title: value.trim(), owner: ownerId });

      if (cart && cart.title === value.trim()) {
        return 'Koszyk o podanej nazwie już istnieje.';
      }

      return undefined;
    case 'description':
      if (value && value.length > 150) {
        return 'Opis jest zbyt długi (max 150 znaków).';
      }

      return undefined;
    default:
      return undefined;
  }
};
