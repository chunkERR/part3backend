const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  try {
    const { username, password } = request.body

    if (!username) {
      // If the username is missing or undefined, return an error message
      return response.status(400).json({ error: 'Please provide a valid username' })
    }

    if (!password || password.length < 3) {
      // If the password is missing or too short, return an error message
      return response.status(400).json({ error: 'Please provide a stronger password' })
    }

    const user = await User.findOne({ username })

    if (!user) {
      // If the user doesn't exist, return an error message
      return response.status(401).json({ error: 'Invalid username or password' })
    }

    const passwordCorrect = await bcrypt.compare(password, user.passwordHash)
    if (!passwordCorrect) {
      // If the password is incorrect, return an error message
      return response.status(401).json({ error: 'Invalid username or password' })
    }

    // If the login is successful, create a JWT for the user
    const userForToken = {
      username: user.username,
      id: user._id,
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    // Send the token and user details as a response
    response.status(200).json({ token, username: user.username, name: user.name })
  } catch (error) {
    // Catch any unexpected errors and send a generic error response
    console.error('Error during login:', error)
    response.status(500).json({ error: 'Something went wrong' })
  }
})

module.exports = loginRouter
