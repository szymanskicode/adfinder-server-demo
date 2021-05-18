const checkErrors = (validationErrors) => {
  const errArr = Object.values(validationErrors);
  const errCount = errArr.length;
  const undefinedCount = errArr.filter((err) => err === undefined).length;

  if (errCount === undefinedCount) {
    return true;
  } else return false;
};

module.exports = checkErrors;
