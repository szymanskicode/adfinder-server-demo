const validateRepeatPassword = (password, repeatPassword) => {
  if (password !== repeatPassword) {
    return `Hasło i jego powtórzenie nie są jednakowe.`;
  } else {
    return undefined;
  }
};

module.exports = validateRepeatPassword;
