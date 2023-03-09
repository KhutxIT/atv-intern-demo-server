const moment = require('moment/moment');

exports.getLastMonthEnglishFormat = () => {
  return moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
};

exports.getLastMonthMiddleDate = () => {
  let tmp = moment()
    .subtract(1, 'months')
    .startOf('month')
    .format('YYYY-MM-DD');
  tmp = replaceAtIndex(tmp, 8, '1');
  tmp = replaceAtIndex(tmp, 9, '5');
  return tmp;
};

const replaceAtIndex = (string, _index, _newValue) => {
  return (
    string.substring(0, _index) +
    _newValue +
    string.substring(_index + _newValue.length)
  );
};
