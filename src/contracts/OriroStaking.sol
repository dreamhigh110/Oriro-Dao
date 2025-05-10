// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

/**
 * @title OriroStaking
 * @dev Contract for staking ORIRO tokens with time-based rewards
 */
contract OriroStaking is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    // Staking token (ORIRO)
    IERC20 public stakingToken;
    
    // Reward rate in tokens per second
    uint256 public rewardRate;
    
    // Last time reward calculation was updated
    uint256 public lastUpdateTime;
    
    // Reward per token stored
    uint256 public rewardPerTokenStored;
    
    // User reward per token paid
    mapping(address => uint256) public userRewardPerTokenPaid;
    
    // User rewards
    mapping(address => uint256) public rewards;
    
    // User staking balances
    mapping(address => uint256) public balances;
    
    // User staking timestamps (for lock periods)
    mapping(address => uint256) public stakingTimestamps;
    
    // Minimum staking period in seconds (e.g., 30 days = 2592000 seconds)
    uint256 public minStakingPeriod = 2592000;
    
    // Total staked amount
    uint256 private _totalSupply;
    
    // Events
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    event RewardRateUpdated(uint256 newRate);
    event MinStakingPeriodUpdated(uint256 newPeriod);
    
    /**
     * @dev Constructor to initialize the staking contract
     * @param _stakingToken Address of the ORIRO token
     * @param _rewardRate Initial reward rate (tokens per second)
     */
    constructor(IERC20 _stakingToken, uint256 _rewardRate) {
        stakingToken = _stakingToken;
        rewardRate = _rewardRate;
        lastUpdateTime = block.timestamp;
    }
    
    /**
     * @dev Updates the reward for a user based on their current staking balance
     * @param account Address of the user
     */
    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;
        
        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }
    
    /**
     * @dev Returns the current reward per token
     */
    function rewardPerToken() public view returns (uint256) {
        if (_totalSupply == 0) {
            return rewardPerTokenStored;
        }
        
        return rewardPerTokenStored + 
            (((block.timestamp - lastUpdateTime) * rewardRate * 1e18) / _totalSupply);
    }
    
    /**
     * @dev Returns the amount of rewards earned by an account
     * @param account Address of the user
     */
    function earned(address account) public view returns (uint256) {
        return ((balances[account] * (rewardPerToken() - userRewardPerTokenPaid[account])) / 1e18) + 
            rewards[account];
    }
    
    /**
     * @dev Stakes tokens in the contract
     * @param amount Amount of tokens to stake
     */
    function stake(uint256 amount) external nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Cannot stake 0");
        
        _totalSupply += amount;
        balances[msg.sender] += amount;
        stakingTimestamps[msg.sender] = block.timestamp;
        
        stakingToken.safeTransferFrom(msg.sender, address(this), amount);
        emit Staked(msg.sender, amount);
    }
    
    /**
     * @dev Withdraws staked tokens from the contract
     * @param amount Amount of tokens to withdraw
     */
    function withdraw(uint256 amount) external nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Cannot withdraw 0");
        require(balances[msg.sender] >= amount, "Insufficient staked balance");
        require(
            block.timestamp >= stakingTimestamps[msg.sender] + minStakingPeriod,
            "Staking period not yet completed"
        );
        
        _totalSupply -= amount;
        balances[msg.sender] -= amount;
        
        stakingToken.safeTransfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount);
    }
    
    /**
     * @dev Claims accumulated rewards
     */
    function getReward() external nonReentrant updateReward(msg.sender) {
        uint256 reward = rewards[msg.sender];
        if (reward > 0) {
            rewards[msg.sender] = 0;
            stakingToken.safeTransfer(msg.sender, reward);
            emit RewardPaid(msg.sender, reward);
        }
    }
    
    /**
     * @dev Updates the reward rate
     * @param _rewardRate New reward rate
     */
    function setRewardRate(uint256 _rewardRate) external onlyOwner updateReward(address(0)) {
        rewardRate = _rewardRate;
        emit RewardRateUpdated(_rewardRate);
    }
    
    /**
     * @dev Updates the minimum staking period
     * @param _minStakingPeriod New minimum staking period in seconds
     */
    function setMinStakingPeriod(uint256 _minStakingPeriod) external onlyOwner {
        minStakingPeriod = _minStakingPeriod;
        emit MinStakingPeriodUpdated(_minStakingPeriod);
    }
    
    /**
     * @dev Emergency function to recover tokens accidentally sent to the contract
     * @param _token Address of the token to recover
     */
    function recoverERC20(IERC20 _token) external onlyOwner {
        // Ensure stakers' tokens cannot be withdrawn
        require(_token != stakingToken, "Cannot withdraw staking token");
        
        uint256 balance = _token.balanceOf(address(this));
        _token.safeTransfer(owner(), balance);
    }
    
    /**
     * @dev Returns the total amount of tokens staked in the contract
     */
    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }
    
    /**
     * @dev Returns the staked balance of an account
     * @param account Address of the user
     */
    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }
    
    /**
     * @dev Checks if an account can withdraw their staked tokens
     * @param account Address of the user
     */
    function canWithdraw(address account) external view returns (bool) {
        return block.timestamp >= stakingTimestamps[account] + minStakingPeriod;
    }
    
    /**
     * @dev Returns the remaining time until an account can withdraw their staked tokens
     * @param account Address of the user
     */
    function timeUntilWithdrawal(address account) external view returns (uint256) {
        uint256 endTime = stakingTimestamps[account] + minStakingPeriod;
        if (block.timestamp >= endTime) {
            return 0;
        }
        return endTime - block.timestamp;
    }
} 