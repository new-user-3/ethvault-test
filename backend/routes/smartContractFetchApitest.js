const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  const test = {test: "/api/fetch"}
   console.log(test );
   res.status(200).json(test);
})

router.post('/', (req, res) => {
  const json = req.body;
  console.log(json);
  
  res.status(200).json({message: "Data taken correctly"});
})

module.exports = router;
