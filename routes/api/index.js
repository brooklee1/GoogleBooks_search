const router = require("express").Router();
const bookRoutes = require("./books");
// Added
const path = require("path");
const googleRoutes = require("./google");

// Book routes
router.use("/books", bookRoutes);

//Added
// Google Routes
router.use("/google", googleRoutes);

//Added
// For anything else, render the html page
router.use(function(req, res) {
  res.sendFile(path.join(__dirname, "../../client/build/index.html"));
});

module.exports = router;
