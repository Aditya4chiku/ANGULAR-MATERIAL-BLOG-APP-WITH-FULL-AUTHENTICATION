const express = require("express");
const multer = require("multer");
const storage=require('../middleware/multer.file')
const authenticate = require("../middleware/check-auth");
const ShareDataController=require('../controllers/page.controller')
const router = express.Router();
//routing Data
router.post('',multer({ storage: storage }).single("image"),ShareDataController.shareData);
router.put("/:id",multer({ storage: storage }).single("image"),ShareDataController.updatData);
router.get("",ShareDataController.fetchData);
router.get("/:id",ShareDataController.fetchSingleData);
router.delete("/:id",ShareDataController.deleteData);

module.exports = router;
