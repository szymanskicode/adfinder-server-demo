module.exports = function idParser(id) {
  if (id) {
    id = id.replace('ID:', '');
    id = id.trim();
    return id;
  } else {
    return null;
  }
};
