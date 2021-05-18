const validateUsername = (username) => {
  if (!username) {
    return 'Nazwa jest wymagana.';
  }

  username = username.trim();
  if (!username) {
    return 'Nazwa jest wymagana.';
  } else if (username.length > 100) {
    return `Nazwa nie może być dłuższa niż 100 znaków.`;
  } else {
    return undefined;
  }
};

module.exports = validateUsername;
