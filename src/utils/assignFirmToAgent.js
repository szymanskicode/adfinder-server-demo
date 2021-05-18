// Asigning firm fields from parent (Owner) to the child (Agent) temporary for sesion time.

const User = require('../models/user');

module.exports = async function (user, options = {}) {
  const unassign = options.unassign;
  const parent = await User.findById({ _id: user.parent });

  return new Promise((resolve) => {
    if (!parent) {
      resolve(user);
    } else {
      user.firmName = unassign ? undefined : parent.firmName;
      user.firmStreet = unassign ? undefined : parent.firmStreet;
      user.firmStreetNumber = unassign ? undefined : parent.firmStreetNumber;
      user.firmCity = unassign ? undefined : parent.firmCity;
      user.firmPostalCode = unassign ? undefined : parent.firmPostalCode;
      user.firmNIP = unassign ? undefined : parent.firmNIP;
      user.firmEmail = unassign ? undefined : parent.firmEmail;
      user.firmPhone = unassign ? undefined : parent.firmPhone;
      user.accountType = unassign ? undefined : parent.accountType;
      user.accountExpires = unassign ? undefined : parent.accountExpires;

      resolve(user);
    }
  });
};
