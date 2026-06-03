const express = require('express')
const fetch = require('node-fetch')

const app = express()

app.use(express.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Access-Control-Allow-Headers', '*')
  res.header('Access-Control-Allow-Credentials', 'true')
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  next()
})

app.post('/pix', async (req, res) => {
  try {
    const publicKey = process.env.PAYSHARK_PUBLIC_KEY
    const secretKey = process.env.PAYSHARK_SECRET_KEY
    const auth = Buffer.from(`${publicKey}:${secretKey}`).toString('base64')

    const order = req.body

    const cpf = ((order.client && order.client.document) || order.cpf || '').replace(/\D/g, '')

    const payload = {
      amount: 6500,
      currency: 'BRL',
      paymentMethod: 'pix',
      pix: {
        expiresInMinutes: 15
      },
      items: [
        {
          title: 'Furadeira e Parafusadeira 48V - MAXTOOL',
          quantity: 1,
          unitPrice: 6500,
          tangible: true
        }
      ],
      customer: {
        name:  (order.client && order.client.name)  || order.nome  || 'Cliente',
        email: (order.client && order.client.email) || order.email || '',
        phone: (order.client && order.client.phone) || order.telefone || '',
        document: {
          type:   'cpf',
          number: cpf || '00000000000'
        }
      },
      externalRef: order.identifier || order.orderId || '',
      postbackUrl: 'https://leao.infinityfree.me/'
    }

    const response = await fetch('https://api.paysharkgateway.com.br/v1/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json()

    const pixCode =
      data?.pix?.code       ||
      data?.pix?.qrcode     ||
      data?.pix?.emv        ||
      data?.data?.pix?.code ||
      data?.qrCode          ||
      data?.emv             ||
      null

    if (!pixCode) {
      return res.status(502).json({
        message: data?.message || 'PIX não gerado',
        details: data
      })
    }

    return res.json({ pix: { code: pixCode } })

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
