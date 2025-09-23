const { ethers } = require("ethers");

const contractsLoader = () => {
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

    const provider = new ethers.JsonRpcProvider(HOLESKY_RPC_URL)
    const contractDeposit = new ethers.Contract(DEPOSIT_CONTRACT_ADDRESS, DEPOSIT_CONTRACT_ABI, provider)
    const contractStacked = new ethers.Contract(STACKED_CONTRACT_ADDRESS, STACKED_CONTRACT_ABI, provider)
    const contractGovernance = new ethers.Contract(GOVERNANCE_CONTRACT_ADDRESS, GOVERNANCE_CONTRACT_ABI, provider)
    const contractStaking = new ethers.Contract(STAKING_DASHBOARD_CONTRACT_ADDRESS, STAKING_DASHBOEAR_CONTRACT_ABI, provider)            

    return {
        contractDeposit,
        contractStacked,
        contractGovernance,
        contractStaking,
        MY_ETH_ADDRESS
    }
}

module.exports = contractsLoader;