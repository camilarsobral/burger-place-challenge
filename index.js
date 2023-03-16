const express = require('express')
const uuid = require('uuid')

const port = 3000
const app = express()
app.use(express.json())

const orders = []

const checkOrderId = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex(order => order.id === id)

    if (index < 0) {
        return response.status(404).json({ error: "order not found" })
    }

    request.orderIndex = index
    request.orderId = id

    next()
}

const reqMethod = (request, response, next) => {
    console.log(request.method)
    console.log(request.url)

    next()
}

app.get('/order', reqMethod, (request, response) => {
    return response.json(orders)
})

app.post('/order', reqMethod, (request, response) => {
try {
    const { order, clientName, price } = request.body

    if (price < 10) throw new Error('Only orders starting at $10 allowed.')
    
    const newOrder = { id: uuid.v4(), order, clientName, price, status: 'Em preparação' }
    
    orders.push(newOrder)
    
    return response.status(201).json(newOrder)
} catch(err) {
    return response.status(400).json({ error:err.message})
} finally {
    console.log('request finished')
}
})

app.put('/order/:id', checkOrderId, reqMethod, (request, response) => {
    const { order, clientName, price } = request.body
    const index = request.orderIndex
    const id = request.orderId

    const updatedOrder = { id, order, clientName, price, status: 'Em preparação' }

    orders[index] = updatedOrder

    return response.json(updatedOrder)
})

app.delete('/order/:id', checkOrderId, reqMethod, (request, response) => {
    const index = request.orderIndex

    orders.splice(index, 1)

    return response.status(204).json()
})

app.get('/order/:id', checkOrderId, reqMethod, (request, response) => {
    const index = request.orderIndex

    return response.json(orders[index])
})

app.patch('/order/:id', checkOrderId, reqMethod, (request, response) => {
    const index = request.orderIndex
    
    orders[index].status = 'Pronto'

    return response.status(200).json(orders[index])

})


app.listen(port, () => {
    console.log('Server started on port ' + port + ' 🥑')
})