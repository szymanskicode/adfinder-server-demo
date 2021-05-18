const validatePassword = (password) => {
  if (!password) {
    return 'Hasło jest wymagane.';
  }

  password = password.trim();
  if (!password) {
    return 'Hasło jest wymagane.';
  } else if (password.length < 6) {
    return 'Hasło musi zawierać minimum 6 znaków.';
  } else if (password.length > 100) {
    return 'Hasło nie może być dłuższe niż 100 znaków.';
  } else {
    return undefined;
  }
};

module.exports = validatePassword;
