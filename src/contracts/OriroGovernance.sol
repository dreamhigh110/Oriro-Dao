// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title OriroGovernance
 * @dev Governance contract for Oriro DAO with proposal and voting functionality
 */
contract OriroGovernance is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    // ORIRO token for voting
    IERC20 public oriroToken;
    
    // Role for creating proposals
    bytes32 public constant PROPOSER_ROLE = keccak256("PROPOSER_ROLE");
    
    // Role for executing approved proposals
    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");
    
    // Proposal states
    enum ProposalState { Pending, Active, Canceled, Defeated, Succeeded, Executed }
    
    // Vote types
    enum VoteType { Against, For, Abstain }
    
    // Proposal structure
    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        uint256 startTime;
        uint256 endTime;
        bool executed;
        bool canceled;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 abstainVotes;
        mapping(address => bool) hasVoted;
        mapping(address => VoteType) votes;
    }
    
    // Vote receipt
    struct Receipt {
        address voter;
        VoteType voteType;
        uint256 weight;
        uint256 timestamp;
    }
    
    // Proposal details return structure to avoid stack too deep
    struct ProposalDetails {
        address proposer;
        string title;
        string description;
        uint256 startTime;
        uint256 endTime;
        bool executed;
        bool canceled;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 abstainVotes;
        ProposalState state;
    }
    
    // Quorum percentage (out of 100)
    uint256 public quorumPercentage = 10; // 10% of total token supply
    
    // Proposal duration in seconds (e.g., 3 days = 259200 seconds)
    uint256 public votingPeriod = 259200;
    
    // Minimum delay between proposal creation and voting start
    uint256 public votingDelay = 86400; // 1 day in seconds
    
    // Minimum token balance required to create proposals
    uint256 public proposalThreshold;
    
    // Proposals storage
    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;
    
    // Events
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        string title,
        uint256 startTime,
        uint256 endTime
    );
    event VoteCast(
        address indexed voter,
        uint256 indexed proposalId,
        VoteType voteType,
        uint256 weight
    );
    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalCanceled(uint256 indexed proposalId);
    event QuorumPercentageUpdated(uint256 newQuorumPercentage);
    event VotingPeriodUpdated(uint256 newVotingPeriod);
    event VotingDelayUpdated(uint256 newVotingDelay);
    event ProposalThresholdUpdated(uint256 newProposalThreshold);
    
    /**
     * @dev Constructor to initialize the governance contract
     * @param _oriroToken Address of the ORIRO token used for voting
     * @param _admin Address that will receive admin role
     * @param _proposalThreshold Minimum token balance required to create proposals
     */
    constructor(
        address _oriroToken,
        address _admin,
        uint256 _proposalThreshold
    ) {
        require(_admin != address(0), "Admin cannot be zero address");
        
        oriroToken = IERC20(_oriroToken);
        proposalThreshold = _proposalThreshold;
        
        // Set up roles
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(PROPOSER_ROLE, _admin);
        _grantRole(EXECUTOR_ROLE, _admin);
    }
    
    /**
     * @dev Creates a new proposal
     * @param title Title of the proposal
     * @param description Detailed description of the proposal
     */
    function createProposal(string calldata title, string calldata description) 
        external 
        nonReentrant 
        returns (uint256) 
    {
        require(
            hasRole(PROPOSER_ROLE, msg.sender) || 
            oriroToken.balanceOf(msg.sender) >= proposalThreshold,
            "Insufficient tokens to create proposal"
        );
        
        uint256 proposalId = proposalCount++;
        Proposal storage proposal = proposals[proposalId];
        
        proposal.id = proposalId;
        proposal.proposer = msg.sender;
        proposal.title = title;
        proposal.description = description;
        proposal.startTime = block.timestamp + votingDelay;
        proposal.endTime = proposal.startTime + votingPeriod;
        
        emit ProposalCreated(
            proposalId,
            msg.sender,
            title,
            proposal.startTime,
            proposal.endTime
        );
        
        return proposalId;
    }
    
    /**
     * @dev Casts a vote on an active proposal
     * @param proposalId ID of the proposal
     * @param voteType Type of vote (Against, For, Abstain)
     */
    function castVote(uint256 proposalId, VoteType voteType) external nonReentrant {
        require(proposalId < proposalCount, "Invalid proposal ID");
        Proposal storage proposal = proposals[proposalId];
        
        require(getProposalState(proposalId) == ProposalState.Active, "Proposal not active");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        
        uint256 votes = oriroToken.balanceOf(msg.sender);
        require(votes > 0, "No voting power");
        
        proposal.hasVoted[msg.sender] = true;
        proposal.votes[msg.sender] = voteType;
        
        if (voteType == VoteType.For) {
            proposal.forVotes += votes;
        } else if (voteType == VoteType.Against) {
            proposal.againstVotes += votes;
        } else if (voteType == VoteType.Abstain) {
            proposal.abstainVotes += votes;
        }
        
        emit VoteCast(msg.sender, proposalId, voteType, votes);
    }
    
    /**
     * @dev Executes a successful proposal
     * @param proposalId ID of the proposal
     */
    function executeProposal(uint256 proposalId) external nonReentrant {
        require(hasRole(EXECUTOR_ROLE, msg.sender), "Must have executor role");
        require(getProposalState(proposalId) == ProposalState.Succeeded, "Proposal not successful");
        
        Proposal storage proposal = proposals[proposalId];
        proposal.executed = true;
        
        emit ProposalExecuted(proposalId);
    }
    
    /**
     * @dev Cancels a pending or active proposal
     * @param proposalId ID of the proposal
     */
    function cancelProposal(uint256 proposalId) external nonReentrant {
        Proposal storage proposal = proposals[proposalId];
        
        require(
            proposal.proposer == msg.sender || hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Not proposer or admin"
        );
        
        ProposalState state = getProposalState(proposalId);
        require(
            state == ProposalState.Pending || state == ProposalState.Active,
            "Cannot cancel proposal in current state"
        );
        
        proposal.canceled = true;
        
        emit ProposalCanceled(proposalId);
    }
    
    /**
     * @dev Returns the current state of a proposal
     * @param proposalId ID of the proposal
     */
    function getProposalState(uint256 proposalId) public view returns (ProposalState) {
        require(proposalId < proposalCount, "Invalid proposal ID");
        Proposal storage proposal = proposals[proposalId];
        
        if (proposal.canceled) {
            return ProposalState.Canceled;
        } else if (proposal.executed) {
            return ProposalState.Executed;
        } else if (block.timestamp < proposal.startTime) {
            return ProposalState.Pending;
        } else if (block.timestamp <= proposal.endTime) {
            return ProposalState.Active;
        } else if (proposal.forVotes <= proposal.againstVotes || !_quorumReached(proposalId)) {
            return ProposalState.Defeated;
        } else {
            return ProposalState.Succeeded;
        }
    }
    
    /**
     * @dev Checks if a proposal has reached quorum
     * @param proposalId ID of the proposal
     */
    function _quorumReached(uint256 proposalId) internal view returns (bool) {
        Proposal storage proposal = proposals[proposalId];
        uint256 totalSupply = oriroToken.totalSupply();
        uint256 quorumVotes = (totalSupply * quorumPercentage) / 100;
        return (proposal.forVotes + proposal.againstVotes + proposal.abstainVotes) >= quorumVotes;
    }
    
    /**
     * @dev Returns detailed information about a proposal
     * @param proposalId ID of the proposal
     */
    function getProposal(uint256 proposalId) external view returns (ProposalDetails memory) {
        require(proposalId < proposalCount, "Invalid proposal ID");
        Proposal storage proposal = proposals[proposalId];
        
        ProposalDetails memory details = ProposalDetails({
            proposer: proposal.proposer,
            title: proposal.title,
            description: proposal.description,
            startTime: proposal.startTime,
            endTime: proposal.endTime,
            executed: proposal.executed,
            canceled: proposal.canceled,
            forVotes: proposal.forVotes,
            againstVotes: proposal.againstVotes,
            abstainVotes: proposal.abstainVotes,
            state: getProposalState(proposalId)
        });
        
        return details;
    }
    
    /**
     * @dev Returns information about a user's vote on a proposal
     * @param proposalId ID of the proposal
     * @param voter Address of the voter
     */
    function getVoteInfo(uint256 proposalId, address voter) external view returns (
        bool hasVoted,
        VoteType voteType
    ) {
        require(proposalId < proposalCount, "Invalid proposal ID");
        Proposal storage proposal = proposals[proposalId];
        
        return (
            proposal.hasVoted[voter],
            proposal.votes[voter]
        );
    }
    
    /**
     * @dev Updates the quorum percentage
     * @param _quorumPercentage New quorum percentage (out of 100)
     */
    function setQuorumPercentage(uint256 _quorumPercentage) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_quorumPercentage > 0 && _quorumPercentage <= 100, "Invalid quorum percentage");
        quorumPercentage = _quorumPercentage;
        emit QuorumPercentageUpdated(_quorumPercentage);
    }
    
    /**
     * @dev Updates the proposal threshold
     * @param _proposalThreshold New proposal threshold
     */
    function setProposalThreshold(uint256 _proposalThreshold) external onlyRole(DEFAULT_ADMIN_ROLE) {
        proposalThreshold = _proposalThreshold;
        emit ProposalThresholdUpdated(_proposalThreshold);
    }
    
    /**
     * @dev Grants the proposer role to an address
     * @param account Address to grant the role to
     */
    function grantProposerRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(PROPOSER_ROLE, account);
    }
    
    /**
     * @dev Grants the executor role to an address
     * @param account Address to grant the role to
     */
    function grantExecutorRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(EXECUTOR_ROLE, account);
    }
} 