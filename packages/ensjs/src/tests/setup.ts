import { ethers } from 'ethers'
import { ENS } from '../'

export default async () => {
  const provider = new ethers.providers.JsonRpcProvider(
    'http://localhost:8545',
    'ropsten',
  )

  let ENSInstance = new ENS({
    graphURI: 'http://localhost:8000/subgraphs/name/graphprotocol/ens',
  })
  await ENSInstance.setProvider(provider)

  let snapshot = await provider.send('evm_snapshot', [])

  const revert = async (customSnapshot?: any) => {
    const snapshotToUse = customSnapshot || snapshot
    await provider.send('evm_revert', [snapshotToUse])
    if (parseInt(snapshot, 16) >= parseInt(snapshotToUse, 16)) {
      snapshot = await provider.send('evm_snapshot', [])
    }

    ENSInstance = new ENS({
      graphURI: 'http://localhost:8000/subgraphs/name/graphprotocol/ens',
    })
    await ENSInstance.setProvider(provider)
    return
  }

  const createSnapshot = async () => await provider.send('evm_snapshot', [])

  return { ENSInstance, revert, createSnapshot, provider }
}