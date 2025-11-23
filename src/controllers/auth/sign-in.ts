export const signIn = (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res
			.status(400)
			.json({ message: "Username and password are required" });
	}

	return res.status(200).json({ message: "User signed in successfully" });
};
