const express = require('express');
const router = express.Router();

const contractsLoader = require('../config/contractsLoader');
const { ethers } = require("ethers");

const { contractDeposit, contractStacked, contractGovernance, contractStaking, MY_ETH_ADDRESS } = contractsLoader();
const account = MY_ETH_ADDRESS

router.use((req, res, next) => {
  if (req.method === 'POST') {
    console.log('------------------ POST Request Received at: %s  ------------------', new Date().toISOString());
    console.log('URL:', req.originalUrl);
    console.log(req.body);
  }
  next(); // Pass to next middleware or route
});

router.post('/', (req, res) => {
  res.status(200).json({message: "Data taken correctly"});
})


async function getDepositData() {
  const name = await contractDeposit.name()
  const symbol = await contractDeposit.symbol()
  const decimal = await contractDeposit.decimals()
  const total = await contractDeposit.totalSupply()
  const balance = await contractDeposit.balanceOf(MY_ETH_ADDRESS)
  return safeConvertToJson({contractAddress: contractDeposit.address, name: name, symbol: symbol, decimal: decimal, totalETH: ethers.formatUnits(total, decimal), balance: {onAccount: account, balance: ethers.formatUnits(balance, decimal)}})
}

router.post('/deposit', async (req, res) => {    
  try {
    const jsonResponse = await getDepositData(); 
    console.log(jsonResponse);
    res.status(200).json(jsonResponse);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Response Error' });
  }
});

async function getStackedData() {
  const name = await contractStacked.name()
  const symbol = await contractStacked.symbol()
  const decimal = await contractStacked.decimals()
  const total = await contractStacked.totalSupply()
  const balance = await contractStacked.balanceOf(MY_ETH_ADDRESS)
  return safeConvertToJson({contractAddress: contractDeposit.address, name: name, symbol: symbol, decimal: decimal, totalETH: ethers.formatUnits(total, decimal), balance: {onAccount: account, balance: ethers.formatUnits(balance, decimal)}})
}

router.post('/stacked', async (req, res) => {
  try {
    const jsonResponse = await getStackedData(); 
    console.log(jsonResponse);
    res.status(200).json(jsonResponse);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Response Error' });
  }
})

async function getGovernanceData() {
    // Get proposal count
    const count = await contractGovernance.proposalCount()
    const proposalCount = Number(count)

    // Fetch all proposals
    const proposalPromises = []
    for (let i = 0; i < proposalCount; i++) {
      proposalPromises.push(contractGovernance.getProposalDetails(i))
    }
    const proposalData = await Promise.all(proposalPromises)

    // Format proposals
    const formattedProposals = proposalData.map((proposal, index) => ({
      id: index,
      proposer: proposal.proposer,
      description: proposal.description,
      createdAt: Number(proposal.createdAt),
      votesFor: ethers.formatEther(proposal.votesFor),
      votesAgainst: ethers.formatEther(proposal.votesAgainst),
      executed: proposal.executed,
      canceled: proposal.canceled,
      state: proposal.state,
    }))

    return safeConvertToJson(formattedProposals)
}

router.post('/governance', async (req, res) => {
  try {
    const jsonResponse = await getGovernanceData(); 
    console.log(jsonResponse);
    res.status(200).json(jsonResponse);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Response Error' });
  }
})

async function getStakingDashboardData() {
  const overview = await contractStaking.getStakingOverview()
  const leaderboard = await contractStaking.getLeaderboard(10)
  const address = MY_ETH_ADDRESS
  const stakerDetails = await contractStaking.getStakerDetails(address)
  return safeConvertToJson({
    contractAddress: contractStaking.address,
    overview: {
      totalETHDeposited: ethers.formatEther(overview[0]),
      totalETHStaked: ethers.formatEther(overview[1]),
      totalStakers: overview[2],
      averageStakeAmount: ethers.formatEther(overview[3])
    },
    leaderboard: leaderboard,
    stakerDetails: {
      address: address,
      details: stakerDetails
    }
  })
}

router.post('/stakingdashboard', async (req, res) => {
  try {
    const jsonResponse = await getStakingDashboardData(); 
    console.log(jsonResponse);
    res.status(200).json(jsonResponse);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Response Error' });  }

})

module.exports = router;



async function fetchSmartContracts()  {
  console.log("Fetching.....")
  try {
    const fetchedContracts = [
      await getDepositData(), 
      await getStackedData(), 
      await getGovernanceData(), 
      await getStakingDashboardData()]
    console.log(fetchedContracts);
  } catch (error) {
    console.error("Error fetchSmartContracts:", error);
  }
} 
  
fetchSmartContracts()    

function safeConvertToJson(valueAsStr) {
  try {
    const json = JSON.stringify(valueAsStr, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    );
    return json;
  } catch(error) {
    return ""
  }
}
