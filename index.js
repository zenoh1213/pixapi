const express = require('express')
const fetch = require('node-fetch')

const app = express()

app.use(express.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})

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

// Rota de teste — mostra resposta completa da SigiloPay
app.post('/teste', async (req, res) => {
  try {
    const body = {
      identifier: 'teste_' + Date.now(),
      amount: 1,
      client: {
        name: 'Teste Silva',
        email: 'teste@teste.com',
        phone: '(11) 99999-9999',
        document: '123.456.789-00'
      }
    }
    const response = await fetch(
      'https://app.sigilopay.com.br/api/v1/gateway/pix/receive',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-public-key': 'bruno27102021_mix4otv1naipgbc2',
          'x-secret-key': 'q7zhs88ojlnh3honex6bd0jneq9ghehdy0z1rz8kufbazgawd76xp3rnosfzk094'
        },
        body: JSON.stringify(body)
      }
    )
    const data = await response.json()
    res.json({ status: response.status, data })
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
})

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
