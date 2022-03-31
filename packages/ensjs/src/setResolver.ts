import { ethers } from 'ethers'
import { ENSArgs } from '.'

export default async function (
  { contracts, provider }: ENSArgs<'contracts' | 'provider'>,
  name: string,
  contract: 'registry' | 'nameWrapper',
  resolver?: string,
  options?: { addressOrIndex?: string | number },
) {
  const address = await provider
    ?.getSigner(options?.addressOrIndex)
    .getAddress()

  if (!address) {
    throw new Error('No signer found')
  }

  if (!resolver) {
    resolver = (await contracts?.getPublicResolver()!).address
  }

  switch (contract) {
    case 'registry': {
      const registry = (await contracts?.getRegistry())!.connect(
        provider?.getSigner(options?.addressOrIndex)!,
      )
      return registry.setResolver(ethers.utils.namehash(name), resolver)
    }
    case 'nameWrapper': {
      const nameWrapper = (await contracts?.getNameWrapper())!.connect(
        provider?.getSigner(options?.addressOrIndex)!,
      )
      return nameWrapper.setResolver(ethers.utils.namehash(name), resolver)
    }
    default: {
      throw new Error(`Unknown contract: ${contract}`)
    }
  }
}