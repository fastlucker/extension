function generateBigIntId() {
  const timestamp = BigInt(Date.now()) // Convert timestamp to BigInt
  const random = BigInt(Math.floor(Math.random() * 10000)) // Generate a random number and convert to BigInt

  const id = timestamp + random
  return id
}

export default generateBigIntId
