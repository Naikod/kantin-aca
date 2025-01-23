const PORT = 3000
const express = require(`express`)
const app = express()
const cors = require(`cors`)
const bodyParser = require('body-parser')

const siswaRoute = require(`./routes/siswa.routes`)
const stanRoute = require(`./routes/stan.routes`)
const menuRoute = require(`./routes/menu.routes`)
const diskonRoute = require(`./routes/diskon.routes`)
const transaksiRoute = require(`./routes/transaksi.routes`)

app.use(cors())
app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use('/siswa', siswaRoute)
app.use('/stan', stanRoute)
app.use('/menu', menuRoute)
app.use('/diskon', diskonRoute)
app.use('/transaksi', transaksiRoute)



app.listen(PORT, () => {
    console.log(`Server of kantin runs on port ${PORT}`)
})

app.use((req, res, next) => {
    res.status(404).send('Endpoint nya gaada');
  });
  