// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "AbstractCallback.sol";
import "./RoyaltyRegistry.sol";
import "Dynamic NFT Pricing/MarketMonitor.sol";

contract DynamicRoyaltyNFT is 
    ERC721,
    ERC721Enumerable,
    Ownable,
    IERC2981,
    AbstractCallback
{
    /// @dev References to core contracts
    RoyaltyRegistry public royaltyRegistry;
    MarketMonitor  public marketMonitor;
    
    /// @dev Base URI for token metadata
    string private _baseTokenURI;

    address public curSeller;
    
    /// @dev Initial sale price for newly minted NFTs
    uint256 public constant INITIAL_SALE_PRICE = 0.01 ether;

    /// @dev Mapping to store token listings
    mapping(uint256 => bool) public isTokenListed;
    mapping(uint256 => uint256) public tokenListingPrice;
    
    /// @dev Events
    event RoyaltyRegistryUpdated(address indexed newRegistry);
    event TokenMinted(address indexed to, uint256 indexed tokenId);
    event TokenBurned(uint256 indexed tokenId);
    event MarketMonitorUpdated(address indexed newMonitor);
    event RoyaltyInfo(address beneficiary, uint amount);
    event RoyaltyDistributed(address beneficiary, uint256 royaltyAmount, address seller, uint256 sellerAmount);
    event TransferFromSuccessfull(address indexed from, uint256 indexed tokenId, uint256 indexed value);
    event TokenListed(address indexed  owner,uint256 indexed tokenId, uint256 indexed price);
    event TokenUnlisted(uint256 indexed tokenId);
    event lockNFT(uint256 indexed tokenId);

    /// @dev Custom errors
    error UnauthorizedMinter();
    error InvalidTokenId();
    error InvalidRoyaltyRegistry();
    error InvalidAddress();
    error InsufficientPayment();
    error TransferFailed();
    error InvalidSalePrice();
    error TokenNotListed();
    error TokenAlreadyListed();
    error NotTokenOwner();
    error InvalidListingPrice();

    constructor(
        address _callback_sender,
        string memory name,
        string memory symbol,
        address registry,
        address payable monitor
    ) ERC721(name, symbol) Ownable(msg.sender) AbstractCallback(_callback_sender) payable  {
        if (registry == address(0)) revert InvalidRoyaltyRegistry();
        royaltyRegistry = RoyaltyRegistry(registry);
        
        if (monitor == address(0)) revert InvalidAddress();
        marketMonitor = MarketMonitor(monitor);
    }
    receive() external payable {}

    function listToken(uint256 tokenId) external {
        uint256 requiredPrice;
        if (ownerOf(tokenId) != msg.sender) revert NotTokenOwner();
        if (isTokenListed[tokenId]) revert TokenAlreadyListed();
        try this.ownerOf(tokenId) returns (address ) {
            
                requiredPrice = marketMonitor.getMarketMetrics(address(this),tokenId).lastSalePrice;
                if (requiredPrice == 0) {
                    requiredPrice = INITIAL_SALE_PRICE;
                }
            
        } catch {
            revert InvalidTokenId();
        }
        
        isTokenListed[tokenId] = true;
        tokenListingPrice[tokenId] = requiredPrice;
        
        // Approve the contract to handle the transfer
        approve(address(this), tokenId);
        
        emit TokenListed(msg.sender,tokenId, requiredPrice);
    }

    function unlistToken(uint256 tokenId) external {
        if (ownerOf(tokenId) != msg.sender) revert NotTokenOwner();
        if (!isTokenListed[tokenId]) revert TokenNotListed();
        
        isTokenListed[tokenId] = false;
        tokenListingPrice[tokenId] = 0;
        
        // Remove approval
        approve(address(0), tokenId);
        
        emit TokenUnlisted(tokenId);
    }
    

     function purchase(uint256 tokenId) external payable {
        if (!isTokenListed[tokenId]) revert TokenNotListed();
        
        address tokenOwner = ownerOf(tokenId);
        uint256 requiredPrice = tokenListingPrice[tokenId];
        
        // Verify payment
        if (msg.value != requiredPrice) {
            revert InsufficientPayment();
        }

        // Store current seller for royalty distribution
        curSeller = tokenOwner;

        // Remove listing
        isTokenListed[tokenId] = false;
        tokenListingPrice[tokenId] = 0;

        // Perform the transfer
        // transferFrom(tokenOwner, msg.sender, tokenId);
        this.burn(tokenId);
        this.mint(msg.sender, tokenId);

        emit TransferFromSuccessfull(address(this), tokenId, msg.value);
        emit TokenUnlisted(tokenId);

    }
    function sendNFTToKopli(address /*sender*/,uint256 amountInKopli,uint256 tokenId) external{

        uint256 amountInETH=amountInKopli/100;
        if (!isTokenListed[tokenId]) revert TokenNotListed();
        address tokenOwner=ownerOf(tokenId);
        if (address(this).balance < amountInETH) {
            revert InsufficientPayment();
        }
        curSeller=tokenOwner;
        isTokenListed[tokenId] = false;
        tokenListingPrice[tokenId] = 0;
        
        // transferFrom(tokenOwner,address(this), tokenId);
        this.burn(tokenId);
        this.mint(address(this), tokenId);
        this.royaltyInfo2(address(0),tokenId,amountInETH);
        emit TokenUnlisted(tokenId);
        emit lockNFT(tokenId);
    }

    
    function distributeETH(
        address beneficiary,
        uint256 royaltyAmount,
        uint256 salePrice
    ) internal {
        if (address(this).balance < salePrice) {
            revert InsufficientPayment();
        }

        // Calculate seller's share
        uint256 sellerAmount = salePrice - royaltyAmount;

        // Transfer royalty to beneficiary
        (bool successBeneficiary,) = beneficiary.call{value: royaltyAmount}("");
        if (!successBeneficiary) {
            revert TransferFailed();
        }

        // Transfer remaining amount to seller
        if (curSeller != address(0) && sellerAmount > 0) {
            (bool successSeller,) = curSeller.call{value: sellerAmount}("");
            if (!successSeller) {
                revert TransferFailed();
            }
        }

        // Reset current seller
        curSeller = address(0);

        emit RoyaltyDistributed(beneficiary, royaltyAmount, curSeller, sellerAmount);
    }

    /**
     * @dev Updates the market monitor address
     */
    function updateMarketMonitor(address payable newMonitor) external onlyOwner {
        if (newMonitor == address(0)) revert InvalidAddress();
        marketMonitor = MarketMonitor(newMonitor);
        emit MarketMonitorUpdated(newMonitor);
    }

    /**
     * @dev Mints a new token
     * @param to Recipient address
     * @param tokenId Token ID to mint
     */
    function mint(address to, uint256 tokenId) external {
        _safeMint(to, tokenId);
        emit TokenMinted(to, tokenId);
    }

    /**
     * @dev Burns a token
     * @param tokenId Token ID to burn
     */
    function burn(uint256 tokenId) external {
        address owner = ownerOf(tokenId);
        address approved = getApproved(tokenId);
        if (msg.sender != owner && msg.sender != approved && !isApprovedForAll(owner, msg.sender)) {
            revert UnauthorizedMinter();
        }
        _burn(tokenId);
        emit TokenBurned(tokenId);
    }

    /**
     * @dev Updates the royalty registry address
     * @param newRegistry New registry address
     */
    function updateRoyaltyRegistry(address newRegistry) external onlyOwner {
        if (newRegistry == address(0)) revert InvalidRoyaltyRegistry();
        royaltyRegistry = RoyaltyRegistry(newRegistry);
        emit RoyaltyRegistryUpdated(newRegistry);
    }

    /**
     * @dev Sets base URI for token metadata
     * @param baseURI New base URI
     */
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    /**
     * @dev Returns the base URI for token metadata
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev ERC2981 royalty info implementation - wrapper function
     * @param tokenId Token ID
     * @param salePrice Sale price
     * @return receiver Royalty recipient
     * @return royaltyAmount Royalty amount
     */
    function royaltyInfo(
        uint256 tokenId,
        uint256 salePrice
    ) external view override returns (address receiver, uint256 royaltyAmount) {
       try this.ownerOf(tokenId) returns (address) {
            RoyaltyRegistry.RoyaltyConfig memory config = royaltyRegistry.getRoyaltyInfo(
                address(this),
                tokenId
            );
            
            royaltyAmount = royaltyRegistry.calculateRoyalty(
                address(this),
                tokenId,
                salePrice
            );
            return (config.beneficiary, royaltyAmount);
            
        } catch {
            revert InvalidTokenId();
        }
    }

    function royaltyInfo2(
        address /*sender*/,
        uint256 tokenId,
        uint256 salePrice
    ) external  returns (address receiver, uint256 royaltyAmount) {
        try this.ownerOf(tokenId) returns (address) {
            RoyaltyRegistry.RoyaltyConfig memory config = royaltyRegistry.getRoyaltyInfo(
                address(this),
                tokenId
            );
            
            royaltyAmount = royaltyRegistry.calculateRoyalty(
                address(this),
                tokenId,
                salePrice
            );
            distributeETH(config.beneficiary,royaltyAmount,salePrice);
            return (config.beneficiary, royaltyAmount);
            
        } catch {
            revert InvalidTokenId();
        }
    }

   

    /**
     * @dev Override for _increaseBalance from both ERC721 and ERC721Enumerable
     */
    function _increaseBalance(address account, uint128 value) internal virtual override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    /**
     * @dev Override for _update from both ERC721 and ERC721Enumerable
     */
    function _update(address to, uint256 tokenId, address auth) internal virtual override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, IERC165)
        returns (bool)
    {
        return
            interfaceId == type(IERC2981).interfaceId ||
            super.supportsInterface(interfaceId);
    }
    //function to withdraw ether
    function withdraw() external onlyOwner {
        address payable wallet = payable(owner());
        wallet.transfer(address(this).balance);
    }
}