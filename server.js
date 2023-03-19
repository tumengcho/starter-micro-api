// Load environment variables from the .env file into process.env
require("dotenv").config()

// Setup express
const express = require("express")
const app = express()
app.use(express.json())
app.use(express.static("public"))

// Setup Stripet
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)

// This is the list of items we are selling
// This will most likely come from a database or JSON file
const storeItems = new Map([
  [1, { priceInCents: 10000, name: "Learn React Today" }],
  [2, { priceInCents: 15000, name: "Learn CSS Today" }],
])

// Start up our server on port 3000


// Create a post request for /create-checkout-session
app.post("/create-checkout-session", async (req, res) => {
    try {
      // Create a checkout session with Stripe
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        // For each item use the id to get it's information
        // Take that information and convert it to Stripe's format
        line_items: req.body.items.map(({ id, quantity }) => {
          const storeItem = storeItems.get(id)
          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: storeItem.name,
              },
              unit_amount: storeItem.priceInCents,
            },
            quantity: quantity,
          }
        }),
        mode: "payment",
        // Set a success and cancel URL we will send customers to
        // These must be full URLs
        // In the next section we will setup CLIENT_URL
        success_url: `${process.env.SERVER_URL}sucess.html`,
        cancel_url: `${process.env.SERVER_URL}index.html`,
      })
  
      res.json({ url: session.url })
    } catch (e) {
      // If there is an error send it to the client
      res.status(500).json({ error: e.message })
    }
  })

 app.listen(3000)
