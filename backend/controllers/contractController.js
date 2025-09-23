const asyncErrorHandler = require("../middlewares/helpers/asyncErrorHandler");
const ErrorHandler = require("../utils/errorHandler");
const contractsLoader = require('../config/contractsLoader');
const { ethers } = require("ethers");

const { contractDeposit, contractStacked, contractGovernance, contractStaking } = contractsLoader();



exports.getAllProposal = asyncErrorHandler(async (req, res, next) => {
  const allProposals = await getAllProposal()

  res.status(200).json({
    success: true,
    allProposals
  });

});


exports.getProposal = asyncErrorHandler(async (req, res, next) => {
  const index = 0;  
  const proposal = await getProposalDetails(index);

  res.status(200).json({
    success: true,
    proposal,
  });
});


/////////////////////////////////////////////

async function getAllProposal() {
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
    const formattedProposals = proposalData.map((proposal, index) => convertPorposalToJson(proposal, index))

    return formattedProposals
}

async function getProposalDetails(index) {
    // Get proposal count
    const count = await contractGovernance.proposalCount()
    //const proposalCount = Number(count)
    if ( index < count ) {
        const proposal = await contractGovernance.getProposalDetails(index)
        return convertPorposalToJson(proposal, index)
    }

    return {}
}

function convertPorposalToJson(proposal, index) {
    return safeConvertToJson({
      id: index,
      proposer: proposal.proposer,
      description: proposal.description,
      createdAt: Number(proposal.createdAt),
      votesFor: ethers.formatEther(proposal.votesFor),
      votesAgainst: ethers.formatEther(proposal.votesAgainst),
      executed: proposal.executed,
      canceled: proposal.canceled,
      state: proposal.state,
    })    
}

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
