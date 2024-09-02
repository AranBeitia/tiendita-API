const Product = require('../models/Product')
const User = require('../models/User')

const ProductController = {
	async create(req, res) {
		try {
			const product = await Product.create(req.body)
			res.status(201).send(product)
		} catch (error) {
			console.error(error)
			res
				.status(500)
				.send({ message: 'Ha habido un problema al crear el producto' })
		}
	},
	async getAll(req, res) {
		try {
			const { page = 1, limit = 10 } = req.query
			const response = await Product.find()
				.populate('reviews.userId')
				.limit(limit)
				.skip((page - 1) * limit)
			res.status(200).send(response)
		} catch (error) {
			res.status(500).send({ message: 'Problemas' })
		}
	},
	async getById(req, res) {
		try {
			const response = await Product.findById(req.params._id)
			res.status(200).send(response)
		} catch (error) {
			res.status(500).send(error)
		}
	},
	async getProductsByName(req, res) {
		try {
			// const name = new RegExp(req.params.name, 'i')
			// const products = await Product.find({ name })
			const products = await Product.find({
				$text: {
					$search: req.params.name,
				},
			})

			if (req.params.name.length > 20) {
				return res.status(400).send('Búsqueda demasiado larga')
			}

			res.send(products)
		} catch (error) {
			console.log(error)
		}
	},
	async deleteProduct(req, res) {
		try {
			const response = await Product.findByIdAndDelete(req.params._id)
			res.status(200).send({ message: 'borrado ok', response })
		} catch (error) {
			res.status(500).send(error)
		}
	},
	async update(req, res) {
		try {
			const product = await Product.findByIdAndUpdate(
				req.params._id,
				req.body,
				{ new: true }
			)
			res.send({ message: 'product successfully updated', product })
		} catch (error) {
			console.error(error)
		}
	},
	async insertComment(req, res) {
		try {
			const product = await Product.findByIdAndUpdate(
				req.params._id,
				{
					$push: {
						reviews: { comment: req.body.comment, userId: req.user._id },
					},
				},
				{ new: true }
			)
			res.send(product)
		} catch (error) {
			console.error(error)
			res.status(500).send({ message: 'There was a problem with your review' })
		}
	},
	async like(req, res) {
		try {
			const product = await Product.findByIdAndUpdate(
				req.params._id,
				{ $push: { likes: req.user._id } },
				{ new: true }
			)
			await User.findByIdAndUpdate(
				req.user._id,
				{ $push: { wishList: req.params._id } },
				{ new: true }
			)
			res.send(product)
		} catch (error) {
			console.error(error)
			res.status(500).send({ message: 'There was a problem with your request' })
		}
	},
}
module.exports = ProductController
