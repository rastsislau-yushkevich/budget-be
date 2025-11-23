export const signOut = (req, res) => {
	return res.status(200).json({ message: "User signed out successfully" });
};
