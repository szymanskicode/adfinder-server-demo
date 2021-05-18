const validateTermsAgree = (termsAgree) => {
  if (!termsAgree === true) {
    return 'Please accept terms and conditions to continue';
  } else {
    return undefined;
  }
};

module.exports = validateTermsAgree;
