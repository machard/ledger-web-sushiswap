import Web3ProviderEngine from 'web3-provider-engine'
import CacheSubprovider from 'web3-provider-engine/subproviders/cache.js'
import { RPCSubprovider } from '@0x/subproviders/lib/src/subproviders/rpc_subprovider'
import { WindowPostMessageStream } from '@metamask/post-message-stream'
import LWClient from 'ledger-web-client'
import LedgerWebSubProvider from 'ledger-web-subprovider'

let engine
const factory = () => {
  if (engine) {
    return engine
  }

  let name = 'https://ledger-web-sushiswap.vercel.app/'

  if (process.env.NODE_ENV === 'development') {
    name = 'http://localhost:4000/'
  }

  const client = new LWClient(
    new WindowPostMessageStream({
      name,
      target: 'ledger-web-parent',
      // todo when updating: https://github.com/MetaMask/post-message-stream/pull/23
      // targetOrigin: "*",
      targetWindow: window.parent || window,
    })
  )

  engine = new Web3ProviderEngine()

  const ledgerSubprovider = new LedgerWebSubProvider({
    client,
  })
  engine.addProvider(ledgerSubprovider)
  engine.addProvider(new CacheSubprovider())
  engine.addProvider(new RPCSubprovider('https://mainnet.infura.io/v3/2e87c2891f3c431da2b024f83bd05571'))

  engine.start()

  return engine
}

export default factory
