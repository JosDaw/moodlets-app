function firebaseErrorCodes(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "This email has already been registered! Please log in instead."

    case "auth/invalid-email":
      return "Your email is incorrect! Please try again."

    case "auth/wrong-password" || "auth/invalid-login-credentials":
      return "The password you entered was incorrect. Please try again."

    case "auth/weak-password":
      return "The password you entered was too weak. Please try another password."

    default:
      return "Something went wrong. Please try again."
  }
}

export { firebaseErrorCodes }
