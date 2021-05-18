module.exports = function titleParser(title) {
  if (title) {
    title = title.trim();
    return title;
  } else {
    return null;
  }
};
