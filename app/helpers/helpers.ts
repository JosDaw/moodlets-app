/**
 * Generates a unique code by combining the current timestamp and a random string
 * @returns A string representing the unique code
 */
function generateUniqueCode(name: string): string {
  // Get the current time in milliseconds
  const timestamp = name.substring(0, 5).toUpperCase()

  // Generate a random number and convert it to a string
  const randomPart = Math.random().toString(36).substring(2, 7)

  // Combine both parts to form a unique code
  return timestamp + randomPart.toUpperCase()
}

export { generateUniqueCode }
