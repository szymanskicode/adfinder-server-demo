module.exports = function randomUserAgent() {
  // Randomly select and return user agent from the list
  const list = [
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:81.0) Gecko/20100101 Firefox/81.0',
  ];

  const randomIndex = Math.floor(Math.random() * list.length);

  const userAgent = list[randomIndex];

  return userAgent;
};
