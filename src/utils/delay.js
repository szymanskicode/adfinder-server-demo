module.exports = async function delay(ms) {
  // Simple delay function
  return new Promise((resolve) => setTimeout(resolve, ms));
};
