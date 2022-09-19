import { create } from 'ipfs-http-client'

const infuraBase = 'https://exgrasia.infura-ipfs.io/ipfs/'

const auth =
  'Basic MjdnRkZKSEgzV2FvNzFiMXZyeHRHaWFOVlM5OjcxNWU3YzI4MGE0OWNlMjc5MmQ5NTU3MTc1OGM4Yzg1'

function createIpfs() {
  const ipfs = create({
    url: 'https://ipfs.infura.io:5001',
    headers: {
      authorization: auth,
    },
  })
  return ipfs
}

export async function postToIpfs(message: string) {
  const ipfs = createIpfs()

  // TODO: pin?
  const { cid } = await ipfs.add(message)
  return cid
}

export async function readFromIpfs(cid: string) {
  const ipfs = infuraBase + cid
  const response = await (await fetch(ipfs)).json()
  return response
}
