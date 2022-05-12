// TODO: add types
// TODO: fix ignored linter warnings
import oracle from 'adex-protocol-eth/abi/RemainingBalancesOracle.json'
import networks from 'ambire-common/src/constants/networks'
import { ethers, getDefaultProvider } from 'ethers'

import i18n from '@config/localization/localization'
import tokenList from '@modules/common/constants/tokensList.json'

const { Interface, AbiCoder, formatUnits, hexlify, isAddress } = ethers.utils
const RemainingBalancesOracle = new Interface(oracle)
const SPOOFER = '0x0000000000000000000000000000000000000001'
const blockTag = 'pending'
const remainingBalancesOracleAddr = '0xF1628de74193Dde3Eed716aB0Ef31Ca2b6347eB1'

// Signature of Error(string)
const ERROR_SIG = '0x08c379a0'
// Signature of Panic(uint256)
const PANIC_SIG = '0x4e487b71'

function isErr(hex: any) {
  return hex.startsWith(ERROR_SIG) || hex.startsWith(PANIC_SIG)
}

// ToDo check for missing data and double check for incompleted returns
async function call({ walletAddr, tokens, network }: any) {
  if (!isAddress(walletAddr))
    return {
      success: false,
      data: walletAddr,
      message: i18n.t('Wallet address is not valid eth address')
    }
  const provider = getDefaultProvider(
    networks.filter((n: any) => n.id === network)[0]?.rpc || undefined
  )
  const coder = new AbiCoder()
  const args = [
    // identityFactoryAddr
    '0xBf07a0Df119Ca234634588fbDb5625594E2a5BCA',
    // bytecode dummy.sol
    '0x6080604052348015600f57600080fd5b50604880601d6000396000f3fe6080604052348015600f57600080fd5b5000fea2646970667358221220face6a0e4f251ee8ded32eb829598230ad218691166fa0a46bc85583c202c60c64736f6c634300080a0033',
    // salt
    '0x0000000000000000000000000000000000000000000000000000000000000001',
    // txns
    [
      [
        '0x0000000000000000000000000000000000000000',
        '0x0',
        '0x0000000000000000000000000000000000000000'
      ]
    ],
    '0x000000000000000000000000000000000000000000000000000000000000000000',
    walletAddr,
    tokens.map((x: any) => x.address)
  ]
  const txParams = {
    from: SPOOFER,
    to: remainingBalancesOracleAddr,
    data: RemainingBalancesOracle.encodeFunctionData('getRemainingBalances', args)
  }
  const callResult = await provider.call(txParams, blockTag)
  if (isErr(callResult))
    throw new Error('probably one ot following tokens is not ERC20 and missing balanceOf()')
  const balances = coder.decode(['uint[]'], callResult)[0]
  const result = tokens.map((x: any, i: any) => ({
    ...x,
    balanceRaw: balances[i].toString(),
    balance: parseFloat(formatUnits(balances[i], x.decimals)).toFixed(10)
  }))
  return { success: true, data: result }
}

async function getTokenListBalance({ walletAddr, tokens, network, updateBalance }: any) {
  const result = await call({ walletAddr, tokens, network })
  if (result.success) {
    const newBalance = tokens
      .map((t: any) => {
        const newTokenBalance = result.data.filter(
          (r: any) => r.address === t.address && parseFloat(r.balance) > 0
        )[0]

        return newTokenBalance
          ? {
              type: 'base',
              network,
              address: newTokenBalance.address,
              decimals: newTokenBalance.decimals,
              symbol: newTokenBalance.symbol,
              price: newTokenBalance.price || 0,
              balance: Number(newTokenBalance.balance),
              balanceRaw: newTokenBalance.balanceRaw,
              updateAt: new Date().toString(),
              balanceUSD: Number(
                // @ts-ignore
                parseFloat(newTokenBalance.price * newTokenBalance.balance || 0).toFixed(2)
              ),
              tokenImageUrl:
                newTokenBalance.tokenImageUrl ||
                `https://storage.googleapis.com/zapper-fi-assets/tokens/${network}/${newTokenBalance.address}.png`
            }
          : t
      })
      .filter((t: any) => t && t.balance && parseFloat(t.balance) > 0)
    if (updateBalance && typeof updateBalance === 'function') updateBalance(newBalance)
    return newBalance
  }
  console.error(result.message, result.data)
  return tokens
}

// eslint-disable-next-line @typescript-eslint/no-shadow
async function getErrMsg(provider: any, txParams: any, blockTag: any) {
  // .call always returisErrns a hex string with ethers
  try {
    // uncomment if you need HEVM debugging
    // console.log(`hevm exec --caller ${txParams.from} --address ${txParams.to} --calldata ${txParams.data} --gas 1000000 --debug --rpc ${provider.connection.rpc} ${!isNaN(blockTag) && blockTag ? '--block '+blockTag : ''}`)
    const returnData = await provider.call(txParams, blockTag)
    if (returnData.startsWith(PANIC_SIG)) return returnData.slice(10)
    return returnData.startsWith(ERROR_SIG)
      ? new AbiCoder().decode(['string'], `0x${returnData.slice(10)}`)[0]
      : returnData
  } catch (e: any) {
    // weird infura case
    if (e.code === 'UNPREDICTABLE_GAS_LIMIT' && e.error) return e.error.message.slice(20)
    if (e.code === 'CALL_EXCEPTION')
      return i18n.t('no error string, possibly insufficient amount or wrong SmartWallet sig')
    if (e.code === 'INVALID_ARGUMENT') return i18n.t(`unable to deserialize: ${hexlify(e.value)}`)
    throw e
  }
}

function checkTokenList(list: any) {
  return list.filter((t: any) => {
    return isAddress(t.address)
  })
}

export { call, tokenList, getErrMsg, checkTokenList, getTokenListBalance }
