const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  const test = {test: "/api/fetch"}
   console.log(test );
   res.status(200).json(test);
})

router.post('/', (req, res) => {
  console.log("-------------------------- Received at: %s -----------------------------------", new Date().toISOString());
  console.log(req.body);
  
  res.status(200).json({message: "Data taken correctly"});
})

module.exports = router;
