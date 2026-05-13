const express = require('express')
const fetch = require('node-fetch')

const app = express()

app.use(express.json())

app.post('/saque', async (req, res) => {

  try {

    const response = await fetch(
      'https://app.sigilopay.com.br/api/v1/gateway/transfers',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-public-key': 'SUA_PUBLIC_KEY',
          'x-secret-key': 'SUA_SECRET_KEY'
        },
        body: JSON.stringify(req.body)
      }
    )

    const data = await response.json()

    res.json(data)

  } catch(err) {

    res.status(500).json({
      error: err.message
    })

  }

})

app.get('/', (req, res) => {
  res.send('API ONLINE')
})

app.get('/ip', async (req, res) => {

  try {

    const response = await fetch('https://api.ipify.org')

    const ip = await response.text()

    res.send(ip)

  } catch(err) {

    res.status(500).send(err.message)

  }

})

app.listen(process.env.PORT || 3000)
