// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "./MarketMonitor.sol";

contract RoyaltyRegistry is Ownable(msg.sender), Pausable {
    using Math for uint256;

    /// @dev Struct to hold royalty configuration parameters
    struct RoyaltyConfig {
        uint256 baseRate;        // Base royalty rate in basis points
        uint256 minRate;         // Minimum allowable rate
        uint256 maxRate;         // Maximum allowable rate
        uint256 volumeMultiplier; // Trading volume impact factor
        uint256 timeDecayFactor;  // Time-based decay coefficient
        address beneficiary;      // Royalty recipient
        uint256 lastUpdateTime;   // Last config update timestamp
        bool useMarketMetrics;   // Whether to use market metrics for calculations
    }

    /// @dev Reference to the market monitor contract
    MarketMonitor public marketMonitor;

    /// @dev Maximum basis points for rates (100%)
    uint256 public constant MAX_BPS = 10000;
    
    /// @dev Minimum time between rate updates
    uint256 public updateCooldown;
    
    /// @dev Mapping of NFT contract + tokenId to RoyaltyConfig
    mapping(address => mapping(uint256 => RoyaltyConfig)) public royaltyConfigs;
    
    /// @dev Mapping of authorized operators
    mapping(address => bool) public authorizedOperators;
    
    /// @dev Protocol-level parameters
    uint256 public globalMinRate;
    uint256 public globalMaxRate;
    uint256 public rateChangeLimit;

    /// @dev Maximum volume multiplier to prevent excessive adjustments
    uint256 public constant MAX_VOLUME_MULTIPLIER = 1000; // 10%

    /// @dev Events
    event RoyaltyConfigUpdated(
        address indexed nftContract,
        uint256 indexed tokenId,
        RoyaltyConfig config
    );
    
    event OperatorStatusUpdated(address indexed operator, bool status);
    event RoyaltyPaid(
        address indexed nftContract,
        uint256 indexed tokenId,
        address beneficiary,
        uint256 amount
    );
    event EmergencyPaused(address indexed triggeredBy);
    event EmergencyUnpaused(address indexed triggeredBy);

    /// @dev Custom errors
    error UnauthorizedOperator();
    error InvalidRate();
    error CooldownActive();
    error InvalidBeneficiary();
    error RateExceedsLimit();
    error InvalidAddress();
    error InvalidVolumeMultiplier();
    error InvalidTimeDecayFactor();
    error ArithmeticError();

    /**
     * @dev Constructor to initialize the contract with default parameters
     * @param _globalMinRate Global minimum royalty rate
     * @param _globalMaxRate Global maximum royalty rate
     */
    constructor(
        uint256 _globalMinRate,
        uint256 _globalMaxRate
    ) {
        if (_globalMinRate >= _globalMaxRate) revert InvalidRate();
        if (_globalMaxRate > MAX_BPS) revert InvalidRate();
        
        globalMinRate = _globalMinRate;
        globalMaxRate = _globalMaxRate;
        updateCooldown = 1 days;
        rateChangeLimit = 500; // 5% maximum change
        
        authorizedOperators[msg.sender] = true;
    }

    /**
     * @dev Sets the royalty configuration for an NFT
     * @param nftContract Address of the NFT contract
     * @param tokenId Token ID
     * @param config New royalty configuration
     */
    function setRoyaltyConfig(
        address nftContract,
        uint256 tokenId,
        RoyaltyConfig calldata config
    ) external whenNotPaused {
        
        
        RoyaltyConfig storage oldConfig = royaltyConfigs[nftContract][tokenId];
        
        // Validate cooldown period
        if (oldConfig.lastUpdateTime + updateCooldown > block.timestamp) {
            revert CooldownActive();
        }
        
        // Validate rates
        if (config.baseRate > MAX_BPS ||
            config.minRate > config.maxRate ||
            config.maxRate > MAX_BPS ||
            config.minRate < globalMinRate ||
            config.maxRate > globalMaxRate) {
            revert InvalidRate();
        }
        
        // Validate rate change
        if (oldConfig.baseRate != 0) {
            uint256 rateChange = config.baseRate > oldConfig.baseRate ?
                config.baseRate - oldConfig.baseRate :
                oldConfig.baseRate - config.baseRate;
            if (rateChange > rateChangeLimit) revert RateExceedsLimit();
        }
        
        if (config.beneficiary == address(0)) revert InvalidBeneficiary();
        
        // Update config
        royaltyConfigs[nftContract][tokenId] = RoyaltyConfig({
            baseRate: config.baseRate,
            minRate: config.minRate,
            maxRate: config.maxRate,
            volumeMultiplier: config.volumeMultiplier,
            timeDecayFactor: config.timeDecayFactor,
            beneficiary: config.beneficiary,
            lastUpdateTime: block.timestamp,
            useMarketMetrics: config.useMarketMetrics
        });
        
        emit RoyaltyConfigUpdated(nftContract, tokenId, config);
    }
    /**
     * @dev Safely scales a large number down to prevent overflow
     * @param value The value to scale
     * @return The scaled value
     */
    function safeScale(uint256 value) internal pure returns (uint256) {
        uint256 decimals = 0;
        uint256 temp = value;
        
        // Count number of digits
        while (temp >= 10000) {
            temp /= 10000;
            decimals += 4;
        }
        
        // Scale down to a manageable size while preserving significance
        return value / (10 ** decimals);
    }

    /**
     * @dev Calculates the dynamic royalty amount incorporating market metrics
     */
    function calculateRoyalty(
        address nftContract,
        uint256 tokenId,
        uint256 salePrice
    ) public view returns (uint256) {
        RoyaltyConfig storage config = royaltyConfigs[nftContract][tokenId];
        if (config.beneficiary == address(0)) return 0;
        
        uint256 effectiveRate = config.baseRate;
        
        // Apply market-based adjustments if enabled
        if (config.useMarketMetrics && address(marketMonitor) != address(0)) {
            MarketMonitor.MarketMetrics memory metrics = marketMonitor.getMarketMetrics(
                nftContract,
                tokenId
            );
            
            try this.calculateVolumeAdjustment(
                metrics.volume24h,
                config.volumeMultiplier,
                effectiveRate
            ) returns (uint256 adjustedRate) {
                effectiveRate = adjustedRate;
            } catch {
                // If volume adjustment fails, continue with current effective rate
            }
            
            try this.calculateTimeDecay(
                metrics.lastSaleTimestamp,
                config.timeDecayFactor,
                effectiveRate
            ) returns (uint256 decayedRate) {
                effectiveRate = decayedRate;
            } catch {
                // If time decay calculation fails, continue with current effective rate
            }
        }
        
        // Ensure rate is within bounds
        effectiveRate = effectiveRate.max(config.minRate);
        effectiveRate = effectiveRate.min(config.maxRate);
        
        // Safe multiplication for final royalty calculation
        try this.safeMultiply(salePrice, effectiveRate) returns (uint256 royalty) {
            return royalty / MAX_BPS;
        } catch {
            // In case of overflow, return minimum royalty
            return (salePrice * config.minRate) / MAX_BPS;
        }
    }

    /**
     * @dev External function for safe volume adjustment calculation
     */
    function calculateVolumeAdjustment(
        uint256 volume24h,
        uint256 volumeMultiplier,
        uint256 currentRate
    ) external pure returns (uint256) {
        if (volume24h == 0 || volumeMultiplier == 0) return currentRate;
        
        uint256 scaledVolume = safeScale(volume24h);
        uint256 volumeAdjustment = (scaledVolume * volumeMultiplier) / MAX_BPS;
        
        // Cap the adjustment to prevent excessive rates
        volumeAdjustment = volumeAdjustment.min(MAX_BPS);
        
        return (currentRate * (MAX_BPS + volumeAdjustment)) / MAX_BPS;
    }

    /**
     * @dev External function for safe time decay calculation
     */
    function calculateTimeDecay(
        uint256 lastSaleTimestamp,
        uint256 timeDecayFactor,
        uint256 currentRate
    ) external view returns (uint256) {
        if (timeDecayFactor == 0) return currentRate;
        
        uint256 timeSinceLastSale = block.timestamp - lastSaleTimestamp;
        if (timeSinceLastSale <= 1 days) return currentRate;
        
        uint256 decay = (timeSinceLastSale * timeDecayFactor) / 1 days;
        decay = decay.min(MAX_BPS);
        
        return (currentRate * (MAX_BPS - decay)) / MAX_BPS;
    }

    /**
     * @dev External function for safe multiplication
     */
    function safeMultiply(uint256 a, uint256 b) external pure returns (uint256) {
        uint256 c = a * b;
        if (a != 0 && c / a != b) revert ArithmeticError();
        return c;
    }

    /**
     * @dev Retrieves the current royalty configuration for an NFT
     */
    function getRoyaltyInfo(
        address nftContract,
        uint256 tokenId
    ) external view returns (RoyaltyConfig memory) {
        return royaltyConfigs[nftContract][tokenId];
    }

    /**
     * @dev Updates the market monitor contract address
     */
    function setMarketMonitor(address payable _marketMonitor) external onlyOwner {
        if (_marketMonitor == address(0)) revert InvalidAddress();
        marketMonitor = MarketMonitor(_marketMonitor);
    }

    /**
     * @dev Sets whether to use market metrics for a specific NFT
     */
    function setUseMarketMetrics(
        address nftContract,
        uint256 tokenId,
        bool useMetrics
    ) external {
        if (!authorizedOperators[msg.sender]) revert UnauthorizedOperator();
        RoyaltyConfig storage config = royaltyConfigs[nftContract][tokenId];
        config.useMarketMetrics = useMetrics;
    }

    /**
     * @dev Adds or removes an authorized operator
     */
    function setOperatorStatus(address operator, bool status) external onlyOwner {
        if (operator == address(0)) revert InvalidAddress();
        authorizedOperators[operator] = status;
        emit OperatorStatusUpdated(operator, status);
    }

    /**
     * @dev Emergency pause function
     */
    function emergencyPause() external onlyOwner {
        _pause();
        emit EmergencyPaused(msg.sender);
    }

    /**
     * @dev Emergency unpause function
     */
    function emergencyUnpause() external onlyOwner {
        _unpause();
        emit EmergencyUnpaused(msg.sender);
    }

    /**
     * @dev Withdraws accumulated ether from the contract
     */
    function withdraw() external onlyOwner {
        address payable wallet = payable(owner());
        uint256 balance = address(this).balance;
        (bool success, ) = wallet.call{value: balance}("");
        require(success, "Transfer failed");
    }
}