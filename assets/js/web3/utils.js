const ethUtil = require('ethereumjs-util')

module.exports = {
  formatBalance: formatBalance,
  generateBalanceObject: generateBalanceObject,
  parseBalance: parseBalance
}

// Takes wei Hex, returns wei BN, even if input is null
function numericBalance (balance) {
  if (!balance) return new ethUtil.BN(0, 16)
  var stripped = ethUtil.stripHexPrefix(balance)
  return new ethUtil.BN(stripped, 16)
}

// Takes  hex, returns [beforeDecimal, afterDecimal]
function parseBalance (balance) {
  var beforeDecimal, afterDecimal
  const wei = numericBalance(balance)
  var weiString = wei.toString()
  const trailingZeros = /0+$/

  beforeDecimal = weiString.length > 18 ? weiString.slice(0, weiString.length - 18) : '0'
  afterDecimal = ('000000000000000000' + wei).slice(-18).replace(trailingZeros, '')
  if (afterDecimal === '') { afterDecimal = '0' }
  return [beforeDecimal, afterDecimal]
}

// Takes wei hex, returns an object with three properties.
// Its "formatted" property is what we generally use to render values.
function formatBalance (balance, decimalsToKeep, needsParse = true) {
  var parsed = needsParse ? parseBalance(balance) : balance.split('.')
  var beforeDecimal = parsed[0]
  var afterDecimal = parsed[1]
  var formatted = 'None'
  if (decimalsToKeep === undefined) {
    if (beforeDecimal === '0') {
      if (afterDecimal !== '0') {
        var sigFigs = afterDecimal.match(/^0*(.{2})/) // default: grabs 2 most significant digits
        if (sigFigs) { afterDecimal = sigFigs[0] }
        formatted = '0.' + afterDecimal + ' ETH'
      }
    } else {
      formatted = beforeDecimal + '.' + afterDecimal.slice(0, 3) + ' ETH'
    }
  } else {
    afterDecimal += Array(decimalsToKeep).join('0')
    formatted = beforeDecimal + '.' + afterDecimal.slice(0, decimalsToKeep) + ' ETH'
  }
  return formatted
}


function generateBalanceObject (formattedBalance, decimalsToKeep = 1) {
  var balance = formattedBalance.split(' ')[0]
  var label = formattedBalance.split(' ')[1]
  var beforeDecimal = balance.split('.')[0]
  var afterDecimal = balance.split('.')[1]
  var shortBalance = shortenBalance(balance, decimalsToKeep)

  if (beforeDecimal === '0' && afterDecimal.substr(0, 5) === '00000') {
    // eslint-disable-next-line eqeqeq
    if (afterDecimal == 0) {
      balance = '0'
    } else {
      balance = '<1.0e-5'
    }
  } else if (beforeDecimal !== '0') {
    balance = `${beforeDecimal}.${afterDecimal.slice(0, decimalsToKeep)}`
  }

  return { balance, label, shortBalance }
}

function shortenBalance (balance, decimalsToKeep = 1) {
  var truncatedValue
  var convertedBalance = parseFloat(balance)
  if (convertedBalance > 1000000) {
    truncatedValue = (balance / 1000000).toFixed(decimalsToKeep)
    return `${truncatedValue}m`
  } else if (convertedBalance > 1000) {
    truncatedValue = (balance / 1000).toFixed(decimalsToKeep)
    return `${truncatedValue}k`
  } else if (convertedBalance === 0) {
    return '0'
  } else if (convertedBalance < 0.001) {
    return '<0.001'
  } else if (convertedBalance < 1) {
    var stringBalance = convertedBalance.toString()
    if (stringBalance.split('.')[1].length > 3) {
      return convertedBalance.toFixed(3)
    } else {
      return stringBalance
    }
  } else {
    return convertedBalance.toFixed(decimalsToKeep)
  }
}

function dataSize (data) {
  var size = data ? ethUtil.stripHexPrefix(data).length : 0
  return size + ' bytes'
}

// Takes a BN and an ethereum currency name,
// returns a BN in wei
function normalizeToWei (amount, currency) {
  try {
    return amount.mul(bnTable.wei).div(bnTable[currency])
  } catch (e) {}
  return amount
}

function normalizeEthStringToWei (str) {
  const parts = str.split('.')
  let eth = new ethUtil.BN(parts[0], 10).mul(bnTable.wei)
  if (parts[1]) {
    var decimal = parts[1]
    while (decimal.length < 18) {
      decimal += '0'
    }
    const decimalBN = new ethUtil.BN(decimal, 10)
    eth = eth.add(decimalBN)
  }
  return eth
}

var multiple = new ethUtil.BN('10000', 10)
function normalizeNumberToWei (n, currency) {
  var enlarged = n * 10000
  var amount = new ethUtil.BN(String(enlarged), 10)
  return normalizeToWei(amount, currency).div(multiple)
}

function readableDate (ms) {
  var date = new Date(ms)
  var month = date.getMonth()
  var day = date.getDate()
  var year = date.getFullYear()
  var hours = date.getHours()
  var minutes = '0' + date.getMinutes()
  var seconds = '0' + date.getSeconds()

  var dateStr = `${month}/${day}/${year}`
  var time = `${hours}:${minutes.substr(-2)}:${seconds.substr(-2)}`
  return `${dateStr} ${time}`
}

function isHex (str) {
  return Boolean(str.match(/^(0x)?[0-9a-fA-F]+$/))
}