// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./RoyaltyRegistry.sol";
import "AbstractCallback.sol";
/**
 * @title MarketMonitor
 * @dev Tracks and analyzes NFT market conditions for dynamic royalty calculations
 */
contract MarketMonitor is Ownable(msg.sender), Pausable,AbstractCallback {
    /// @dev Struct to store market metrics for a specific token
    struct MarketMetrics {
        uint256 totalVolume;          // Total trading volume
        uint256 volume24h;            // 24-hour trading volume
        uint256 volume7d;             // 7-day trading volume
        uint256 lastSalePrice;        // Price of most recent sale
        uint256 lastSaleTimestamp;    // Timestamp of most recent sale
        uint256 vwap24h;             // Volume-weighted average price (24h)
        uint256 salesCount24h;        // Number of sales in last 24h
        uint256 highPrice24h;         // Highest price in last 24h
        uint256 lowPrice24h;          // Lowest price in last 24h
    }

    /// @dev Struct to store historical price data points
    struct PriceDataPoint {
        uint256 price;
        uint256 timestamp;
        uint256 volume;
    }

    /// @dev Reference to the royalty registry
    RoyaltyRegistry public royaltyRegistry;

    /// @dev Maximum number of historical data points to store per token
    uint256 public constant MAX_HISTORY_POINTS = 100;
    
    /// @dev Minimum time between updates (5 minutes)
    uint256 public constant UPDATE_COOLDOWN = 5 minutes;

    /// @dev Mapping of NFT contract + tokenId to market metrics
    mapping(address => mapping(uint256 => MarketMetrics)) public marketMetrics;
    
    /// @dev Mapping for historical price data
    mapping(address => mapping(uint256 => PriceDataPoint[])) private priceHistory;
    
    /// @dev Mapping of authorized data providers
    mapping(address => bool) public authorizedProviders;
    
    /// @dev Mapping of last update timestamps
    mapping(address => mapping(uint256 => uint256)) public lastUpdateTime;

    /// @dev Events
    event SaleRecorded(
        address indexed nftContract,
        uint256 indexed tokenId,
        uint256 indexed price,
        uint256 timestamp
    );
    
    event MetricsUpdated(
        address indexed nftContract,
        uint256 indexed tokenId,
        uint256 volume24h,
        uint256 vwap24h
    );
    
    event ProviderStatusUpdated(address indexed provider, bool status);

    /// @dev Custom errors
    error UnauthorizedProvider();
    error UpdateTooFrequent();
    error InvalidPrice();
    error InvalidAddress();

    /**
     * @dev Constructor
     * @param _registry Address of the royalty registry
     */
    constructor(address _callback_sender,address _registry) AbstractCallback(_callback_sender) payable {
        if (_registry == address(0)) revert InvalidAddress();
        royaltyRegistry = RoyaltyRegistry(_registry);
        
        authorizedProviders[msg.sender] = true;
    }
    receive() external payable {}

    /**
     * @dev Records a new sale and updates market metrics
     * @param nftContract Address of the NFT contract
     * @param tokenId Token ID
     * @param price Sale price
     */
    function recordSale(
        address /*sender*/,
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) external whenNotPaused {
        // if (!authorizedProviders[msg.sender]) revert UnauthorizedProvider();
        if (price == 0) revert InvalidPrice();
        
        // Check update frequency
        if (block.timestamp - lastUpdateTime[nftContract][tokenId] < UPDATE_COOLDOWN) {
            emit SaleRecorded(nftContract, tokenId, price, block.timestamp);
            revert UpdateTooFrequent();
        }
        
        _updateMetrics(nftContract, tokenId, price);
        _addPriceDataPoint(nftContract, tokenId, price);
        _cleanupOldData(nftContract, tokenId);
        
        lastUpdateTime[nftContract][tokenId] = block.timestamp;
        
        emit SaleRecorded(nftContract, tokenId, price, block.timestamp);
    }

    /**
     * @dev Updates market metrics for a token
     */
    function _updateMetrics(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) private {
        MarketMetrics storage metrics = marketMetrics[nftContract][tokenId];
        
        // Update total volume
        metrics.totalVolume += price;
        
        // Update last sale info
        metrics.lastSalePrice = price;
        metrics.lastSaleTimestamp = block.timestamp;
        
        // Update 24h metrics
        _update24hMetrics(metrics, price);
        
        // Update 7d metrics
        _update7dMetrics(metrics, price);
        
        emit MetricsUpdated(
            nftContract,
            tokenId,
            metrics.volume24h,
            metrics.vwap24h
        );
    }

    /**
     * @dev Updates 24-hour metrics
     */
    function _update24hMetrics(
        MarketMetrics storage metrics,
        uint256 price
    ) private {
        // Reset 24h metrics if last sale was more than 24h ago
        if (block.timestamp - metrics.lastSaleTimestamp > 24 hours) {
            metrics.volume24h = 0;
            metrics.salesCount24h = 0;
            metrics.highPrice24h = 0;
            metrics.lowPrice24h = type(uint256).max;
        }
        
        metrics.volume24h += price;
        metrics.salesCount24h++;
        
        // Update high/low prices
        if (price > metrics.highPrice24h) {
            metrics.highPrice24h = price;
        }
        if (price < metrics.lowPrice24h) {
            metrics.lowPrice24h = price;
        }
        
        // Update VWAP
        metrics.vwap24h = (metrics.volume24h) / metrics.salesCount24h;
    }

    /**
     * @dev Updates 7-day metrics
     */
    function _update7dMetrics(
        MarketMetrics storage metrics,
        uint256 price
    ) private {
        // Reset 7d volume if last sale was more than 7 days ago
        if (block.timestamp - metrics.lastSaleTimestamp > 7 days) {
            metrics.volume7d = 0;
        }
        
        metrics.volume7d += price;
    }

    /**
     * @dev Adds a new price data point to historical data
     */
    function _addPriceDataPoint(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) private {
        PriceDataPoint[] storage history = priceHistory[nftContract][tokenId];
        
        // Add new data point
        history.push(PriceDataPoint({
            price: price,
            timestamp: block.timestamp,
            volume: 1
        }));
    }

    /**
     * @dev Cleans up old price history data points
     */
    function _cleanupOldData(
        address nftContract,
        uint256 tokenId
    ) private {
        PriceDataPoint[] storage history = priceHistory[nftContract][tokenId];
        
        // Remove old data points if exceeding maximum
        if (history.length > MAX_HISTORY_POINTS) {
            uint256 removeCount = history.length - MAX_HISTORY_POINTS;
            for (uint256 i = 0; i < removeCount; i++) {
                // Shift array elements to remove oldest entries
                for (uint256 j = 0; j < history.length - 1; j++) {
                    history[j] = history[j + 1];
                }
                history.pop();
            }
        }
    }

    /**
     * @dev Retrieves market metrics for a token
     */
    function getMarketMetrics(
        address nftContract,
        uint256 tokenId
    ) external view returns (MarketMetrics memory) {
        return marketMetrics[nftContract][tokenId];
    }

    /**
     * @dev Retrieves price history for a token
     */
    function getPriceHistory(
        address nftContract,
        uint256 tokenId
    ) external view returns (PriceDataPoint[] memory) {
        return priceHistory[nftContract][tokenId];
    }

    /**
     * @dev Updates authorized provider status
     */
    function setProviderStatus(
        address provider,
        bool status
    ) external onlyOwner {
        if (provider == address(0)) revert InvalidAddress();
        authorizedProviders[provider] = status;
        emit ProviderStatusUpdated(provider, status);
    }

    /**
     * @dev Emergency pause function
     */
    function emergencyPause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Emergency unpause function
     */
    function emergencyUnpause() external onlyOwner {
        _unpause();
    }
    //function to withdraw ether
    function withdraw() external onlyOwner {
        address payable wallet = payable(owner());
        wallet.transfer(address(this).balance);
    }
}