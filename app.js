const http = require('http')
const express = require('express')
const app = express()
const port = 3000

let terms = ['Rob', 'Michael']
let visitCount = 0

app.get('/', (req, res) => {
    res.send('Hello, ' + terms[visitCount % 2])
    visitCount++
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

console.log('Node server running on port 3000');
