module.exports = function surfaceParser(surface) {
  if (surface) {
    let index = surface.indexOf(':');
    surface = surface.substring(index + 1);
    index = surface.indexOf('m');
    surface = surface.substring(0, index);
    surface = surface.replace(',', '.');
    surface = surface.trim();
    surface = parseFloat(surface);

    return surface;
  } else {
    return null;
  }
};
