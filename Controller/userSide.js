const bcrypt = require('bcryptjs')
const joi = require('joi')
const jwt=require('jsonwebtoken')
const User=require('../Model/User')
const Payment=require('../Model/Payment')
const Subscription=require("../Model/Subscription")
const WatchList=require('../Model/Watchlist')
const Video=require('../Model/Video');
const stripe = require('stripe')

	//joi validation

// const userValidation = joi.object({
//     name: joi.string().required().messages({
//         "string.base": "Name is Required",
//     }),
//     email: joi.string().email().messages({
//         "string.base": "Email is Required",
//         "string.pattern.base": "Email must be in format",
//     }),
//     password: joi.string().messages({
//         "string.base": "Password is Required",
//     }),
// })

const signup = async (req, res) => {
    const { username, email, password } = req.body
    console.log(req.body);
    // const validate = await userValidation.validate({ name, email, password })

    // if (!validate) {
    //     res.status(400).send("Error")
    // }
    if (!(username && password && email)) {
        res.status(400).send("Fill all fields")
    }

    // check user is exist or not

    const userExist = await User.findOne({ email })
    if (userExist) {
       return res.status(401).send("user already Exist")
    }
    console.log("df",userExist)

//password bcrypt

const hashpassword=await bcrypt.hash(String(password),10)
console.log('hasg',hashpassword)
    const user = await User.create({
      username,
        email,
        password: hashpassword,
    })
console.log('user', user)
     const token = jwt.sign({ id: user._id },process.env.jwt_secret, {
        expiresIn: "2h",
      });
      console.log('token', token)
    // user.token = token;
      res.cookie("token", token);

    user.password = undefined;
    res.status(200).json({
        success: true,
        message: "Account created successfully",
    });
}

	//user login

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!(email, password)) {
        res.status(400).send("Please fill email and password")
    }
    const userData = await User.findOne({ email });
    if (!userData) {
        return res.status(400).json({
            success: false,
            message: "User not found",
        })
    }
    const passwordMatch =await bcrypt.compare(
        String(password),
        userData.password,
    )

    console.log(passwordMatch)

    if (!passwordMatch) {
        return res.status(400).json({
            success: false,
            message: "incorrect password",

        })
    }

    const token = jwt.sign({ id: userData._id }, process.env.jwt_secret, {
        expiresIn: "2h",
    })
	console.log(token);
	

    res.cookie("token", token);
    res.status(200).json({
        userData: userData,
        message: "Login Successful"
    })

}


const verifyPremium = async (req, res) => {
  const { email,amount} = req.body;
  console.log("am",amount);
  
  const { sessionId } = req.params;

  console.log("Email:", email);
 
  const user = await User.findOne({ email: email });
  console.log("User:", user);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (!sessionId) {
    return res.status(404).json({ error: 'Session not found' });
  }

  console.log('Session Details:', sessionId);

  
  const demoPlans = [
    {
      title: "Fan",
      price: 79,
      validity: "1 month",
      watchDevices: "1",
    },
    {
      title: "Mega Fan",
      price: 99,
      validity: "1 month",
      watchDevices: "4",
    },
    {
      title: "Premium Fan",
      price: 999,
      validity: "1 year",
      watchDevices: "4",
    },
  ];

  console.log("amount",  amount);


  const matchedPlan = demoPlans.find(plan => plan.price === Number(amount));

  console.log("matchedPlan", matchedPlan);

  if (!matchedPlan) {
    return res.status(400).json({ error: 'Invalid payment amount for any plan' });
  }

  
  user.role = 'premium';
  user.premiumStartDate = new Date();
  // user.name = "fff"
  user.amount = amount;
  user.currentPlan = matchedPlan.title; 
  await user.save();

  const payment = new Payment({
    userId: user._id,
    amount,
    // paymentMethod, 
    status: 'Completed', 
    transactionId:sessionId
  });
  console.log('pay', payment)

  try {
   
    // await payment.save();
  } catch (error) {
    console.error('Failed to save payment', error);
    return res.status(500).json({ error: 'Payment record could not be saved' });
  }

  
  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role,
    amount: user.amount,
    currentPlan: user.currentPlan,
  };

  const secretKey = process.env.JWT_SECRET;

  const premiumToken = jwt.sign(payload, secretKey, { expiresIn: '30d' });
  console.log("preme",premiumToken);
  
  // Send the token as a cookie
  res.cookie('premiumToken', premiumToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  // Send success response with user details
  res.status(200).json({
    success: true,
    sessionId,
    user: {
      email: user.email,
      role: user.role,
      amount,
      currentPlan: user.currentPlan,
    },
    premiumToken,
  });
};

const createPaymentIntent = async (req, res) => {
  const { amount,userEmail } = req.body;
console.log("userEmail",userEmail);

  if (!amount) {
      throw new Error('Amount is required.'); 
  }
  const amountInINR = amount * 100;
  console.log("amountInINR", amount);

  const stripeClient = new stripe(process.env.STRIPE_KEY)
  const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      ui_mode: "embedded",
      line_items: [
          {
              price_data: {
                  currency: 'usd',
                  product_data: { name: 'Sample Product' },
                   unit_amount:amountInINR,  
              },
              quantity: 1, 
          },
      ],

      return_url: 'http://localhost:3000/success/?session_id={CHECKOUT_SESSION_ID}'
  })
  
console.log("session._id,",session)

  res.status(200).json({
      clientSecret: session.client_secret,
      url: session.url,
     
     
  });
};

const getAllUsers = async (req, res) => {
	try {
	  const users = await User.find(); // Fetch all users from the database
	  res.status(200).json(users); // Send the users as a JSON response
	} catch (error) {
	  console.error("Error fetching users:", error.message);
	  res.status(500).json({ error: "Failed to fetch users" }); // Handle any errors
	}
  };  

const getEntairVideos = async (req, res) => {
	try {
	  // Fetch all videos and populate the userId and channelId references
	  const videos = await Video.find()
  
	  // Send the videos as a response
	  res.status(200).json({ videos });
	} catch (error) {
	  console.error("Error fetching videos:", error.message);
	  res.status(500).json({ error: "Failed to fetch videos" });
	}
  };
  
  const getVideoById = async (req, res) => {
	try {
	  const { videoId } = req.params;
	  console.log(videoId);
	  
  
	  // Find the video by ID and populate the userId and channelId references
	  const video = await Video.findById(videoId)
  console.log(video);
  
	  res.status(200).json(video);
	} catch (error) {
	  console.error("Error fetching one video:", error.message);
	  res.status(500).json({ error: error.message || "Failed to fetch video" });
	}
  };

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
	  const { userId}  = req.params; // Get user ID from request parameters
	 
	  
	  if (!userId) {
		return res.status(400).json({ message: "User ID is required" });
	  }
  
	  // Find the user's watchlist and populate the video details
	  const watchList = await WatchList.findOne({ user: userId }).populate('Videos')
 
	  if (!watchList) {
		return res.status(404).json({ message: "Watchlist not found" });
	  }
  
	  res.status(200).json(watchList );
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
	getAllUsers ,
	getEntairVideos,
	getVideoById,
	addToWatchList,
	getWatchList,
	deleteVideoFromWatchList,
  verifyPremium,
  createPaymentIntent
}