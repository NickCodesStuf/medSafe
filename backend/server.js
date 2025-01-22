const express = require('express');
const app = express();
const port = 5000;

app.get('/api/data', (req, res) => {
    res.json({message: "Expressed"});
})

app.listen(port, () => {
    console.log(`backend on port 5000`);
})