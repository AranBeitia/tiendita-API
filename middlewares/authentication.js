const User = require('../models/User')
const jwt = require('jsonwebtoken')
// const { jwt_secret } = require('../config/keys.js')

require('dotenv').config()

const authentication = async (req, res, next) => {
	try {
		const token = req.headers.authorization
		const payload = jwt.verify(token, process.env.jwt_secret)
		const user = await User.findOne({ _id: payload._id, tokens: token })
		if (!user) {
			return res.status(401).send({ message: 'No estás autorizado' })
		}
		req.user = user
		next()
	} catch (error) {
		console.error(error)
		return res
			.status(500)
			.send({ error, message: 'Ha habido un problema con el token' })
	}
}

const isAdmin = async (req, res, next) => {
	const admins = ['admin', 'superadmin']
	if (!admins.includes(req.user.role)) {
		return res.status(403).send({
			message: 'You do not have permission',
		})
	}
	next()
}

module.exports = { authentication, isAdmin }
