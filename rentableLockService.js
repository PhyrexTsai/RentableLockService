// 當頁面載入完成時
$(function() {
	// 連結 enode
	var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
	var eth = web3.eth

	var rentableLockServiceABI = [{
		"constant": true,
		"inputs": [],
		"name": "renter",
		"outputs": [{
			"name": "",
			"type": "address"
		}],
		"payable": false,
		"type": "function"
	}, {
		"constant": true,
		"inputs": [],
		"name": "endTime",
		"outputs": [{
			"name": "",
			"type": "uint256"
		}],
		"payable": false,
		"type": "function"
	}, {
		"constant": true,
		"inputs": [],
		"name": "locked",
		"outputs": [{
			"name": "",
			"type": "bool"
		}],
		"payable": false,
		"type": "function"
	}, {
		"anonymous": false,
		"inputs": [{
			"indexed": false,
			"name": "renter",
			"type": "address"
		}, {
			"indexed": false,
			"name": "lease",
			"type": "uint256"
		}, {
			"indexed": false,
			"name": "timestamp",
			"type": "uint256"
		}],
		"name": "Rented",
		"type": "event"
	}, {
		"anonymous": false,
		"inputs": [{
			"indexed": false,
			"name": "tryingrenter",
			"type": "address"
		}, {
			"indexed": false,
			"name": "realrenter",
			"type": "address"
		}, {
			"indexed": false,
			"name": "timestamp",
			"type": "uint256"
		}],
		"name": "InUse",
		"type": "event"
	}, {
		"anonymous": false,
		"inputs": [{
			"indexed": false,
			"name": "renter",
			"type": "address"
		}, {
			"indexed": false,
			"name": "returneddeposit",
			"type": "uint256"
		}, {
			"indexed": false,
			"name": "timestamp",
			"type": "uint256"
		}],
		"name": "NormalReturned",
		"type": "event"
	}, {
		"anonymous": false,
		"inputs": [{
			"indexed": false,
			"name": "renter",
			"type": "address"
		}, {
			"indexed": false,
			"name": "timestamp",
			"type": "uint256"
		}],
		"name": "Timeout",
		"type": "event"
	}, {
		"anonymous": false,
		"inputs": [{
			"indexed": false,
			"name": "renter",
			"type": "address"
		}, {
			"indexed": false,
			"name": "timestamp",
			"type": "uint256"
		}],
		"name": "Locked",
		"type": "event"
	}, {
		"anonymous": false,
		"inputs": [{
			"indexed": false,
			"name": "renter",
			"type": "address"
		}, {
			"indexed": false,
			"name": "timestamp",
			"type": "uint256"
		}],
		"name": "Unlocked",
		"type": "event"
	}, {
		"constant": false,
		"inputs": [],
		"name": "rent",
		"outputs": [],
		"payable": true,
		"type": "function"
	}, {
		"constant": false,
		"inputs": [],
		"name": "return_",
		"outputs": [],
		"payable": false,
		"type": "function"
	}, {
		"constant": false,
		"inputs": [],
		"name": "lock",
		"outputs": [],
		"payable": false,
		"type": "function"
	}, {
		"constant": false,
		"inputs": [],
		"name": "unlock",
		"outputs": [],
		"payable": false,
		"type": "function"
	}]

	// 以 eth.contract 參照 ABI 製造出合約正本
	var rentableLockServiceContract = web3.eth.contract(rentableLockServiceABI)


	// 放置 web3 deploy 程式碼
	// 在其中的 callback 中，呼叫 contractControl
	var rentableLockService = rentableLockServiceContract.new({
		from: web3.eth.accounts[0],
		data: '60606040526002805460ff191660011790556105388061001f6000396000f3606060405236156100615760e060020a60003504632e88ab0b81146100665780633197cbb61461007d57806382996d9f1461008b57806391d5114414610105578063a69df4b51461019f578063cf30901214610227578063f83d08ba14610238575b610002565b34610002576102c5600054600160a060020a031681565b34610002576102e260015481565b6102f460025460ff16151560011480156100b0575060008054600160a060020a031614155b1561030a5760005460408051600160a060020a0333811682529290921660208301524282820152517fdb9e809daeb7deb5c5da859b1aea2d6715766ff39b69c8b5d1b1e8dbae82634f9181900360600190a15b565b34610002576102f46002805460015460ff1991909116909155429003662386f26fc100008102600082118015610149575060005433600160a060020a039081169116145b1561040c5760005460408051600160a060020a03929092168252602082018390524282820152517fae2d043d563b327edf66cc1ffec2c522ee0ec2b0144cb2cef2d9946edd7ef5d59181900360600190a15b5050565b34610002576102f460025460ff16151560011480156101cd5750600054600160a060020a0390811633909116145b156104d6576002805460ff1916905560005460408051600160a060020a03909216825242602083015280517f0f0bc5b519ddefdd8e5f9e6423433aa2b869738de2ae34d58ebc796fc749fa0d9281900390910190a1610103565b34610002576102f660025460ff1681565b34610002576102f45b60025460ff16151560001480156102675750600054600160a060020a0390811633909116145b156104d6576002805460ff1916600117905560005460408051600160a060020a0392909216825242602083015280517f9f1ec8c880f76798e7b793325d625e9b60e4082a553c98f42b6cda368dd600089281900390910190a1610103565b60408051600160a060020a03929092168252519081900360200190f35b60408051918252519081900360200190f35b005b604080519115158252519081900360200190f35b60008054600160a060020a0316141561010357600280546000805460ff19929092169092556064349081044290810160015573ffffffffffffffffffffffffffffffffffffffff1990921633179283905560408051600160a060020a03949094168452602084019190915282810191909152517f7c9d2ac912c28eb5f87522b3a227c33e0884aa9c28bf987198e395fe62c491389181900360600190a17f9f1ec8c880f76798e7b793325d625e9b60e4082a553c98f42b6cda368dd60008600060009054906101000a9004600160a060020a0316426040518083600160a060020a031681526020018281526020019250505060405180910390a1610103610241565b600054600160a060020a039081163390911614156100615760005460408051600160a060020a0392909216825242602083015280517f48f41610c1ed8e474ea2df3e4c778c8e152b4b5d0f4f91a992a4901a948256619281900390910190a17fae2d043d563b327edf66cc1ffec2c522ee0ec2b0144cb2cef2d9946edd7ef5d5600060009054906101000a9004600160a060020a03166000426040518084600160a060020a03168152602001838152602001828152602001935050505060405180910390a161019b565b60005433600160a060020a03908116911614156100615760005460408051600160a060020a03909216825242602083015280517f48f41610c1ed8e474ea2df3e4c778c8e152b4b5d0f4f91a992a4901a948256619281900390910190a161010356',
		gas: 4700000
	}, function(e, contract) {
		// 因為此 callback 會被呼叫兩次，所以要判斷 contract.address 是否為存在，存在表示已經部署成功
		if (typeof contract.address !== 'undefined') {
			console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash)

			// 載入我們設計的介面接合
			contractControl(rentableLockService, eth)
		}
	})
})

function contractControl(rentablelockservice, eth) {
	// 事件們要怎麼呈現在介面上可以自由決定，這主要是為了大家能方便處理邏輯
	// 可以 alert() 出來，也可以直接 console.log()
	rentablelockservice.Rented({}, function(err, event) {
		// 當成功租用時的事件發生要如何 handle
		console.log('Rent success!');
	})
	rentablelockservice.InUse({}, function(err, event) {
		// 想要租用，然而這個鎖正在被使用中時的事件發生要如何 handle
		console.log('Already in use!');
	})
	rentablelockservice.NormalReturned({}, function(err, event) {
		// 當成功正常歸還時的事件發生要如何 handle
		console.log('Return success!');
	})
	rentablelockservice.Timeout({}, function(err, event) {
		// 當嘗試操作鎖或歸還時已經逾時的事件發生要如何 handle
		console.log('Timoeut');
	})
	rentablelockservice.Locked({}, function(err, event) {
		// 當成功鎖住鎖時的事件發生要如何 handle
		console.log('Lock');
	})
	rentablelockservice.Unlocked({}, function(err, event) {
		// 當成功解鎖鎖時的事件發生要如何 handle
		console.log('Unlock');
	})

	$('#rent').on('click', function() {
		// 當有人按租用按鈕要如何 handle
		var time = $('#deposit').val();
		var ether = time * 1000000000000000000;
		$('#renttimedata').text(time * 100);
		$('#renterbalancedata').text(eth.getBalance(eth.coinbase));
		$('#rentablelockbalancedata').text($('#deposit').val());
		var txRentHash = rentableLockService.rent({
			from: eth.coinbase,
			gas: ether
		});
	})
	$('#return').on('click', function() {
		// 當有人按歸還按鈕要如何 handle
		var txReturnHash = rentableLockService.return_({
			from: eth.coinbase
		});
	})
	$('#lock').on('click', function() {
		// 當有人按上鎖按鈕要如何 handle
		var txLockHash = rentableLockService.lock({
			from: eth.coinbase
		});
	})
	$('#unlock').on('click', function() {
		// 當有人按解鎖按鈕要如何 handle
		var txLockHash = rentableLockService.unlock({
			from: eth.coinbase
		});
	})
}
