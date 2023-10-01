// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {USDF} from "./USDF.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */
contract DestinationToken is CCIPReceiver {
	USDF public token;    

	event MintCallSuccessfull();
	// https://docs.chain.link/ccip/supported-networks#ethereum-sepolia
	address routerSepolia = 0xD0daae2231E9CB96b94C8512223533293C3693Bf;

	constructor(address tokenAddress) CCIPReceiver(routerSepolia) {
    	token = USDF(tokenAddress);
	}

	function _ccipReceive(
    	Client.Any2EVMMessage memory message
	) internal override {
    	(bool success, ) = address(token).call(message.data);
    	require(success);
    	emit MintCallSuccessfull();
	}
}
