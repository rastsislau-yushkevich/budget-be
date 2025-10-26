import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (_, res) => {
	res.send("Server is running!");
});

app.listen(PORT, () => {
	console.log(`🚀 Server started on http://localhost:${PORT}`);
});
