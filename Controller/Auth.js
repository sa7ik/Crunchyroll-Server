const bcrypt = require('bcryptjs')
const User=require('../Model/User')

const signup = async (req, res) => {
    
	try {
        
		const { username,email, password} = req.body;

		if (!email || !password || !username) {
			return res.status(400).json({ success: false, message: "All fields are required" });
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailRegex.test(email)) {
			return res.status(400).json({ success: false, message: "Invalid email" });
		}

		if (password.length < 6) {
			return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
		}

		const existingUserByEmail = await User.findOne({ email: email });

		if (existingUserByEmail) {
			return res.status(400).json({ success: false, message: "Email already exists" });
		}

		const existingUserByUsername = await User.findOne({ username: username });

		if (existingUserByUsername) {
			return res.status(400).json({ success: false, message: "Username already exists" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		

		const newUser = new User({
			email,
			password: hashedPassword,
			username,
			
		});

        await newUser.save()
res.status(200).json(newUser)
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
}

const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ success: false, message: "All fields are required" });
		}

		const user = await User.findOne({ email: email });
		if (!user) {
			return res.status(404).json({ success: false, message: "Invalid credentials" });
		}

		const isPasswordCorrect = await bcrypt.compare(password, user.password);

		if (!isPasswordCorrect) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

        res.status(200).json(user)

		// generateTokenAndSetCookie(user._id, res);

		// res.status(200).json({
		// 	success: true,
		// 	user: {
		// 		...user._doc,
		// 		password: "",
		// 	},
		// });
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
}

module.exports = {signup,login}