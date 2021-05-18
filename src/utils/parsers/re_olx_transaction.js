module.exports = function transactionParser(transaction) {
  if (transaction) {
    transaction = transaction.toLowerCase().trim();
  } else {
    return null;
  }

  if (transaction.includes('sprzeda')) {
    return 'sprzedaz';
  } else if (transaction.includes('kup')) {
    return 'kupno';
  } else if (transaction.includes('wynaje')) {
    return 'wynajem';
  } else if (transaction.includes('naje')) {
    return 'najem';
  } else if (transaction.includes('zami')) {
    return 'zamiana';
  } else {
    return null;
  }
};
