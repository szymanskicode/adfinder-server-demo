const validateTitle = (title) => {
  if (!title) {
    return 'Title is required';
  }

  title = title.trim();
  if (!title) {
    return 'Title is required';
  } else if (title.length > 100) {
    return `Title can't be longer than 100 characters`;
  } else {
    return undefined;
  }
};

module.exports = validateTitle;
