const express = require('express')
const fetch = require('node-fetch')

const app = express()

app.use(express.json())

// CORS — permite chamadas do seu site
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})

// Gerar cobrança PIX
app.post('/pix', async (req, res) => {
  try {
    const response = await fetch(
      'https://app.sigilopay.com.br/api/v1/gateway/pix/receive',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-public-key': 'bruno27102021_mix4otv1naipgbc2',
          'x-secret-key': 'q7zhs88ojlnh3honex6bd0jneq9ghehdy0z1rz8kufbazgawd76xp3rnosfzk094'
        },
        body: JSON.stringify(req.body)
      }
    )
    const data = await response.json()
    res.status(response.status).json(data)
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
})

// Verificar IP do servidor
app.get('/ip', async (req, res) => {
  try {
    const response = await fetch('https://api4.ipify.org')
    const ip = await response.text()
    res.send(ip)
  } catch(err) {
    res.status(500).send(err.message)
  }
})

app.get('/', (req, res) => {
  res.send('API ONLINE')
})

app.listen(process.env.PORT || 3000)
