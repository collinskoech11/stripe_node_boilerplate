require('dotenv').config
const express = require('express')
const app = express()

app.use(express.json())
app.use(express.static('public'))

const stripe = require("stripe")("sk_test_51LApQHJt9QgggVy71YelU0F3PHk7LNLnj2ygU4uaXhHFWdTZQHeXDQ9F0wOIEECO11o1cVMEdCLeXh48usm2VslO00SYneAItG")

const storeItems = new Map([
    [1, { priceInCents: 10000, name: "chair"}],
    [2, { priceInCents: 20000, name: "table"}],
])

app.post('/create-checkout-session', async (req, res) => {
    try{
        const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: req.body.items.map(item => {
            const storeItem = storeItems.get(item.id)
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: storeItem.name
                    },
                    unit_amount: storeItem.priceInCents
                },
                quantity: item.quantity
            }
        }),
        success_url:`http://localhost:3000/success.html`,
        cancel_url:`http://localhost:3000/cancel.html`
        })
        res.json({ url:session.url})
    }catch (e){
        res.status(500).json({error: e.message })
    }
    
})

app.listen(3000)

// STRIPE_PRIVATE_KEY=sk_test_51LApQHJt9QgggVy71YelU0F3PHk7LNLnj2ygU4uaXhHFWdTZQHeXDQ9F0wOIEECO11o1cVMEdCLeXh48usm2VslO00SYneAItG