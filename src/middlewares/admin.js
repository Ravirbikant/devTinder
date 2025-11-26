const adminAuth = (req, res, next) => {
  const token = "abc";
  const isUserAdmin = token === "abc";
  if (!isUserAdmin) res.status(401).send("Unauthorized request");
  next();
};

module.exports = { adminAuth };
