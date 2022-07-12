import { create } from 'ipfs-http-client'

const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
})

export async function readFromIpfs(cid: string) {
  const stream = ipfs.cat(cid)
  const decoder = new TextDecoder()
  let data = ''
  for await (const chunk of stream) {
    // chunks of data are returned as a Uint8Array, convert it back to a string
    data += decoder.decode(chunk, { stream: true })
  }

  return data
}

export async function postToIpfs(message: string) {
  const ipfs = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
  })

  const { cid } = await ipfs.add(message)
  await readFromIpfs(cid.toString())
  return cid.toString()
}
