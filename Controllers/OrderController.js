const createOrder = async (req, res) => {
  res.send("Create Order");
};
const getAllOrder = async (req, res) => {
  res.send("get All Order");
};
const getSingleOrder = async (req, res) => {
  res.send("get Single Order");
};
const getCurrentUserOrder = async (req, res) => {
  res.send("get Current User Order");
};
const updateOrder = async (req, res) => {
  res.send("Update Order");
};

module.exports = {
  createOrder,
  getAllOrder,
  getSingleOrder,
  getCurrentUserOrder,
  updateOrder,
};
