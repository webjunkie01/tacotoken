// const formatBalance = require('./utils').formatBalance
// const parseBalance = require('./utils').parseBalance
BigNumber.config({ DECIMAL_PLACES: 18, ROUNDING_MODE: 4, ERRORS: false })
var account;
var accounts;
var CoinContract;
var CoinInstance;
var Coin;


window.App = {
    init: function (){
        var self = this;
        self.getStats()
    },
    getStats: function() {
        var self = this;
        var meta;
        return new Promise(function(resolve, reject) {
            meta = CoinInstance
            if (meta) {
                resolve(meta)
            }else{
                reject(new Error('Cant initialize instance of coin'))
            }
        }).then(function(instance){
            meta = instance
            return new Promise(function(resolve, reject){
                meta.getStats.call(function(error, result){
                    if (!error) {
                        resolve(result)
                    }else{
                        reject(new Error(error))
                    }
                })
            })
        }).then(function(stats){
            console.log(stats.valueOf())
            var totalSupply =  new BigNumber(web3.fromWei(stats[1].valueOf())).toFormat(3)
            var totalContributions = web3.fromWei(stats[0].valueOf())
            var bonusToken = web3.fromWei(stats[2].valueOf())
            $('.totalsupplyvalue').html(totalSupply)
            $('.bonustokenvalue').html(bonusToken)
            $('.totalcontributionsvalue').html(totalContributions + ' ETH')


        })

    }


}



window.addEventListener('load', function() {

  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {

    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected.");


  }
  abi = JSON.parse('[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalContribution","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"disablePurchasing","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"enablePurchasing","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalBonusTokensIssued","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getStats","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"purchasingAllowed","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"_owner","type":"address"},{"name":"_name","type":"string"},{"name":"_symbol","type":"string"},{"name":"_totalSupply","type":"uint256"},{"name":"_decimals","type":"uint256"}],"payable":false,"type":"constructor"},{"payable":true,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}]');
  CoinContract = web3.eth.contract(abi);
  CoinInstance = CoinContract.at('0xb1657ee26f0f842C3aEc75658325Db2Ca1f4192b');



  window.App.init();



});

