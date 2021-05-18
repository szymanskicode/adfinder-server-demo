module.exports = function dateParser(dateTxt) {
  if (dateTxt) {
    dateTxt = dateTxt.trim();
    if (dateTxt.includes('zisiaj')) {
      let date = new Date();
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      date = year * 10000 + month * 100 + day;
      return date;
    } else if (dateTxt.includes('czoraj')) {
      let timestamp = Date.now();
      let yesterday = timestamp - 86400000;
      let date = new Date(yesterday);
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      date = year * 10000 + month * 100 + day;
      return date;
    } else {
      const arr = dateTxt.split(' ');
      let day = parseInt(arr[0], 10);
      let month = arr[1];
      if (month.toLowerCase().includes('sty')) {
        month = 1;
      } else if (month.toLowerCase().includes('lut')) {
        month = 2;
      } else if (month.toLowerCase().includes('mar')) {
        month = 3;
      } else if (month.toLowerCase().includes('kwi')) {
        month = 4;
      } else if (month.toLowerCase().includes('maj')) {
        month = 5;
      } else if (month.toLowerCase().includes('cze')) {
        month = 6;
      } else if (month.toLowerCase().includes('lip')) {
        month = 7;
      } else if (month.toLowerCase().includes('sie')) {
        month = 8;
      } else if (month.toLowerCase().includes('wrz')) {
        month = 9;
      } else if (
        month.toLowerCase().includes('paź') ||
        month.toLowerCase().includes('paz')
      ) {
        month = 10;
      } else if (month.toLowerCase().includes('lis')) {
        month = 11;
      } else if (month.toLowerCase().includes('gru')) {
        month = 12;
      }
      let year = parseInt(arr[2], 10);

      date = year * 10000 + month * 100 + day;
      return date;
    }
  } else {
    return null;
  }
};
