module.exports = function roomsParser(rooms) {
  if (rooms) {
    let index = rooms.indexOf(':');
    rooms = rooms.substring(index + 1);
    rooms = rooms.toLowerCase();
    rooms = rooms.trim();
    rooms = rooms.substring(0, 1);

    if (rooms.includes('k')) {
      rooms = 1;
    } else {
      rooms = parseInt(rooms, 10);
    }

    return rooms;
  } else {
    return null;
  }
};
