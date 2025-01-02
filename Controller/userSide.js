const bcrypt = require('bcryptjs')
const User=require('../Model/User')
const WatchList=require('../Model/Watchlist')
const Video=require('../Model/Video');

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

const addToWatchList = async (req, res) => {
  try {
    const { userId, videoId } = req.body;

    // Validate inputs
    if (!userId || !videoId) {
      return res.status(400).json({ message: "User ID and Video ID are required" });
    }

    // Check if the video exists
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Find or create a watchlist for the user
    let watchList = await WatchList.findOne({ user: userId });
    if (!watchList) {
      watchList = new WatchList({ user: userId, Videos: [] });
    }

    // Check if the video is already in the watchlist
    const isVideoAlreadyInWatchList = watchList.Videos.some(
      (item) => item.toString() === videoId
    );

    if (isVideoAlreadyInWatchList) {
      return res.status(400).json({ message: "Video already in watchlist" });
    }

    // Add the video to the watchlist
    watchList.Videos.push(videoId);
    await watchList.save();

    res.status(200).json({
      message: "Video added to watchlist successfully",
      watchList,
    });
  } catch (error) {
    console.error("Error adding to watchlist:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const getWatchList = async (req, res) => {
	try {
	  const { userId } = req.params; // Get user ID from request parameters
  
	  if (!userId) {
		return res.status(400).json({ message: "User ID is required" });
	  }
  
	  // Find the user's watchlist and populate the video details
	  const watchList = await WatchList.findOne({ user: userId }).populate("Videos");
  
	  if (!watchList) {
		return res.status(404).json({ message: "Watchlist not found" });
	  }
  
	  res.status(200).json({ watchList });
	} catch (error) {
	  console.error("Error fetching watchlist:", error.message);
	  res.status(500).json({ message: "Internal server error", error: error.message });
	}
  };

  const deleteVideoFromWatchList = async (req, res) => {
	try {
	  const { userId, videoId } = req.params;
  
	  // Validate input
	  if (!userId || !videoId) {
		return res.status(400).json({ message: "User ID and Video ID are required" });
	  }
  
	  // Find the user's watchlist
	  const watchList = await WatchList.findOne({ user: userId });
  
	  if (!watchList) {
		return res.status(404).json({ message: "Watchlist not found for the user" });
	  }
  
	  // Remove the video from the watchlist
	  const updatedVideos = watchList.Videos.filter(
		(video) => video.toString() !== videoId
	  );
  
	  if (updatedVideos.length === watchList.Videos.length) {
		return res.status(404).json({ message: "Video not found in the watchlist" });
	  }
  
	  watchList.Videos = updatedVideos;
	  await watchList.save();
  
	  res.status(200).json({
		message: "Video removed from watchlist successfully",
		watchList,
	  });
	} catch (error) {
	  console.error("Error deleting video from watchlist:", error.message);
	  res.status(500).json({ message: "Internal server error", error: error.message });
	}
  };

module.exports = {
	signup,
	login,
	addToWatchList,
	getWatchList,
	deleteVideoFromWatchList
}