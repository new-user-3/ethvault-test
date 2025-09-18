const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
  if (req.method === 'POST') {
    console.log('------------------ POST Request Received at: %s  ------------------', new Date().toISOString());
    console.log('URL:', req.originalUrl);
    console.log(req.body);
  }
  next(); // Pass to next middleware or route
});


router.get('/', (req, res) => {
  const test = {test: "/api/fetch"}
   console.log(test );
   res.status(200).json(test);
})

router.post('/', (req, res) => {
  
  res.status(200).json({message: "Data taken correctly"});
})

module.exports = router;
