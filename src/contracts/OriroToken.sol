// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title OriroToken
 * @dev ERC20 token for the Oriro platform with role-based access control
 */
contract OriroToken is ERC20, ERC20Burnable, ERC20Pausable, AccessControl {
    // Create role identifiers
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    
    // Maximum supply cap
    uint256 public immutable MAX_SUPPLY;
    
    /**
     * @dev Constructor to create the Oriro token
     * @param initialSupply Initial supply of tokens to mint
     * @param maxSupply Maximum possible supply of tokens
     * @param admin Address that will receive all roles
     */
    constructor(
        uint256 initialSupply,
        uint256 maxSupply,
        address admin
    ) ERC20("Oriro Token", "ORIRO") {
        require(initialSupply <= maxSupply, "Initial supply exceeds max supply");
        require(admin != address(0), "Admin cannot be zero address");
        
        MAX_SUPPLY = maxSupply;
        
        // Grant roles to admin
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);
        
        // Mint initial supply to the admin
        _mint(admin, initialSupply * 10**decimals());
    }
    
    /**
     * @dev Mints new tokens, respecting the max supply cap
     * @param to Address receiving the tokens
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        require(to != address(0), "Cannot mint to the zero address");
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds maximum supply cap");
        _mint(to, amount);
    }
    
    /**
     * @dev Pauses all token transfers
     */
    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }
    
    /**
     * @dev Unpauses all token transfers
     */
    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }
    
    // The following functions are overrides required by Solidity
    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual override(ERC20, ERC20Pausable) {
        super._beforeTokenTransfer(from, to, amount);
    }
} 