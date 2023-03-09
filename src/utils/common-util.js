const compareObjectById = (obj1, obj2) => {
  return `${obj1._id || obj1}` === `${obj2._id || obj2}`;
};

module.exports = {
  compareObjectById,
};
