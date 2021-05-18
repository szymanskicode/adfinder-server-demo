module.exports = function phoneParser(phone) {
  if (phone) {
    phone = phone.trim();
    phone = phone.replace(/ /g, '');
    phone = phone.replace(/-/g, '');
    phone = phone.replace(/\+/g, 'e');

    if (phone.indexOf('00') === 0) {
      phone = phone.replace('00', 'e');
    }

    return phone;
  } else {
    return null;
  }
};
