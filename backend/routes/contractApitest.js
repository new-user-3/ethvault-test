const express = require('express');
const {
    getAllProposal,
    getProposal,
} = require("../controllers/contractController");

const router = express.Router();

const { ethers } = require("ethers");


router.route("/proposal/").get(getProposal);
router.route("/proposal/all").get(getAllProposal);

console.log("contractApitest...")

const axios = require('axios');

axios.get('http://localhost:4000/api/contract/proposal/all')
  .then(response => {
    console.log('Response data:', response.data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
  

axios.get('http://localhost:4000/api/contract/proposal')
  .then(response => {
    console.log('Dane:', response.data);
  })
  .catch(error => {
    console.error('Error:', error);
  });

console.log("END contractApitest!!!")






module.exports = router;