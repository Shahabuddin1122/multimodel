const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
    try {
        const response = await axios.post("http://localhost:11434/v1/chat/completions", {
            model: req.body.model,
            messages: [{"role": "user", "content": req.body.prompt}]
        });
        res.json(response.data);
    } catch (error) {
        console.log("error");
        res.status(500).json({ error: error.message });
    }
});

app.get("/", (req,res)=>{
    res.json("Hello")
})

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
