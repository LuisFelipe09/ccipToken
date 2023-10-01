// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */
contract SourceToken {

	// Custom errors to provide more descriptive revert messages.
	error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees); // Used to make sure contract has enough balance to cover the fees.
	error NothingToWithdraw(); // Used when trying to withdraw Ether but there's nothing to withdraw.
	error FailedToWithdrawEth(address owner, address target, uint256 value); // Used when the withdrawal of Ether fails.

	IRouterClient public router;
	LinkTokenInterface public linkToken;
	uint64 public destinationChainSelector;
	address public owner;
	address public destinationMinter;

	event MessageSent(bytes32 messageId);

	constructor(address destMinterAddress) {
    	owner = msg.sender;

    	// from Fuji
    	// https://docs.chain.link/ccip/supported-networks#avalanche-fuji
    	address routerAddressFuji = 0x554472a2720E5E7D5D3C817529aBA05EEd5F82D8;
    	router = IRouterClient(routerAddressFuji);
    	linkToken = LinkTokenInterface(0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846);
    	linkToken.approve(routerAddressFuji, type(uint256).max);

    	// to Sepolia
    	// https://docs.chain.link/ccip/supported-networks#ethereum-sepolia
    	destinationChainSelector = 16015286601757825753;
    	destinationMinter = destMinterAddress;
	}

	function transferOnSepolia(address ownerToken,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s ) external {
    	Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
        	receiver: abi.encode(destinationMinter),
        	data: abi.encodeWithSignature("permit(address,address,uint256,uint256,uint8,bytes32,bytes32)", 
			        ownerToken, spender, value, deadline, v, r, s),
        	tokenAmounts: new Client.EVMTokenAmount[](0),
        	extraArgs: Client._argsToBytes(
            	Client.EVMExtraArgsV1({gasLimit: 500_000, strict: false})
        	),
        	feeToken: address(linkToken)
    	});

    	// Get the fee required to send the message
    	uint256 fees = router.getFee(destinationChainSelector, message);

    	if (fees > linkToken.balanceOf(address(this)))
        	revert NotEnoughBalance(linkToken.balanceOf(address(this)), fees);

    	bytes32 messageId;
    	// Send the message through the router and store the returned message ID
    	messageId = router.ccipSend(destinationChainSelector, message);
    	emit MessageSent(messageId);
	}

	modifier onlyOwner() {
    	require(msg.sender == owner);
    	_;
	}

	function linkBalance (address account) public view returns (uint256) {
    	return linkToken.balanceOf(account);
	}

	function withdrawLINK(
    	address beneficiary
	) public onlyOwner {
    	uint256 amount = linkToken.balanceOf(address(this));
    	if (amount == 0) revert NothingToWithdraw();
    	linkToken.transfer(beneficiary, amount);
	}
}
