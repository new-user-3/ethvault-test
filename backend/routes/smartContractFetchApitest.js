const express = require('express');
const router = express.Router();

const { ethers } = require("ethers");


// Holesky testnet configuration
const HOLESKY_CHAIN_ID = 17000
const HOLESKY_RPC_URL = "https://ethereum-holesky-rpc.publicnode.com"


const MY_ETH_ADDRESS = "0xC24e64A9f889A7de503f68Ac0F7415dC00888e8B"
// Contract addresses
const DEPOSIT_CONTRACT_ADDRESS = "0x520d7dAB4A5bCE6ceA323470dbffCea14b78253a"
const STACKED_CONTRACT_ADDRESS = "0x16b0cD88e546a90DbE380A63EbfcB487A9A05D8e"
const GOVERNANCE_CONTRACT_ADDRESS = "0xD396FE92075716598FAC875D12E708622339FA3e"
const STAKING_DASHBOARD_CONTRACT_ADDRESS = "0xd33e9676463597AfFF5bB829796836631F4e2f1f"

const DEPOSIT_CONTRACT_ABI = require("../../lib/abis/dETH.json")
const STACKED_CONTRACT_ABI = require("../../lib/abis/sETH.json")
const GOVERNANCE_CONTRACT_ABI = require("../../lib/abis/governance.json")
const STAKING_DASHBOEAR_CONTRACT_ABI = require("../../lib/abis/stakingDashboard.json")


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


const provider = new ethers.JsonRpcProvider(HOLESKY_RPC_URL)
const contractDeposit = new ethers.Contract(DEPOSIT_CONTRACT_ADDRESS, DEPOSIT_CONTRACT_ABI, provider)
const contractStacked = new ethers.Contract(STACKED_CONTRACT_ADDRESS, STACKED_CONTRACT_ABI, provider)
const contractGovernance = new ethers.Contract(GOVERNANCE_CONTRACT_ADDRESS, GOVERNANCE_CONTRACT_ABI, provider)
const contractStaking = new ethers.Contract(STAKING_DASHBOARD_CONTRACT_ADDRESS, STAKING_DASHBOEAR_CONTRACT_ABI, provider)            
const account = MY_ETH_ADDRESS

async function getDepositData() {
  const name = await contractDeposit.name()
  const symbol = await contractDeposit.symbol()
  const decimal = await contractDeposit.decimals()
  const total = await contractDeposit.totalSupply()
  const balance = await contractDeposit.balanceOf(MY_ETH_ADDRESS)
  return safeConvertToJson({contractAddress: DEPOSIT_CONTRACT_ADDRESS, name: name, symbol: symbol, decimal: decimal, totalETH: ethers.formatUnits(total, decimal), balance: {onAccount: account, balance: ethers.formatUnits(balance, decimal)}})
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
  return safeConvertToJson({contractAddress: STACKED_CONTRACT_ADDRESS, name: name, symbol: symbol, decimal: decimal, totalETH: ethers.formatUnits(total, decimal), balance: {onAccount: account, balance: ethers.formatUnits(balance, decimal)}})
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
  return JSON.stringify({contractAddress: STAKING_DASHBOARD_CONTRACT_ADDRESS})
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
