
const express = require('express')
const app = express()
const PORT = 3003

app.use(express.json())

let products = [
	{ id: 1, name: 'Producto A', price: 100 },
	{ id: 2, name: 'Producto B', price: 200 },
	{ id: 3, name: 'Producto C', price: 300 },
]


app.post('/products', (req, res) => {
	const { name, price } = req.body

	if (!name || price === undefined) {
		return res.status(400).send({ message: 'Nombre y precio requeridos' })
	}

	const newProduct = {
		id: products.length + 1,
		name,
		price: Number(price),
	}

	products.push(newProduct)
	res.status(201).send(newProduct)
})


app.put('/products/:id', (req, res) => {
	const id = +req.params.id
	const product = products.find((p) => p.id === id)

	if (!product) {
		return res.status(404).send({ message: 'Producto no encontrado' })
	}

	product.name = req.body.name || product.name
	product.price = req.body.price !== undefined ? Number(req.body.price) : product.price

	res.status(200).send({ message: 'Producto actualizado', product })
})


app.delete('/products/:id', (req, res) => {
	const id = +req.params.id
	const exists = products.some((p) => p.id === id)

	if (!exists) {
		return res.status(404).send({ message: 'Producto no encontrado' })
	}

	products = products.filter((p) => p.id !== id)
	res.status(200).send({ message: 'Producto eliminado' })
})


app.get('/products', (req, res) => {
	let result = products


	if (req.query.price) {
		result = result.filter((p) => p.price === +req.query.price)
	}


	if (req.query.range === 'true') {
		result = result.filter((p) => p.price >= 50 && p.price <= 250)
	}


	if (req.query.id) {
		result = result.filter((p) => p.id === +req.query.id)
	}


	if (req.query.name) {
		result = result.filter((p) => p.name.toLowerCase().includes(req.query.name.toLowerCase()))
	}

	res.status(200).send(result)
})


app.listen(PORT, () => console.log(`Server started on port ${PORT}`))







