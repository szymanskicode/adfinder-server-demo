// Generate random number in range
module.exports = function randomNumInRange(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};
