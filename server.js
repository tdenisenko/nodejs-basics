const express = require('express')
const axios = require('axios')

const app = express()

app.use(express.json()) // to support JSON-encoded bodies
app.use(express.urlencoded({
    extended: true
})) // to support URL-encoded bodies

app.get('/homepage', function (req, res) {
    res.send("Hello World!")
})

app.post('/prices', async function (req, res) {
    const { divisor } = req.body
    let result = await axios.get("https://ethgasstation.info/api/ethgasAPI.json")
    .then(response => {
        if (response.status == 200) {
            const gasPriceGweiSafeLow = response.data["safeLow"] / divisor
            const gasPriceGweiFast = response.data["fast"] / divisor
            const gasPriceGweiFastest = response.data["fastest"] / divisor
            return {
                "safeLow": gasPriceGweiSafeLow,
                "fast": gasPriceGweiFast,
                "fastest": gasPriceGweiFastest,
            }
        }
        return null
    })
    .catch(err => {
        return null
    })
    let error = null
    if (result === null) {
        error = "Unable to get prices."
    }
    result = {
        "error": error,
        "result": result
    }
    res.json(result)
})

const nodeServer = app.listen(3000, 'localhost', function () {
    const host = nodeServer.address().address
    const port = nodeServer.address().port
    console.log(`NodeJS App is listening at http://${host}:${port}`)
})