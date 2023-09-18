const getItems = async (req, res) => {
  const items = { name: "test1" };
  res.status(200).json(items);
};

module.exports = {
  getItems,
};
