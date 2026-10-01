import { User } from "../models/user.models.js";
import asyncHandler from "../utils/async-heandler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { emailVerificationMailGenContent, sendMail } from "../utils/email.js";

const generateAccessAndREfreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const acccessToken = user.generateAccressToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { acccessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating access", []);
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  const isExist = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (isExist) {
    throw new ApiError(409, "User with email and password already exists", []);
  }

  const user = await User.create({username, email, password, isEmailVerified: false});

  const { unhashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  await sendMail({
    email: user?.email,
    subject: "please verify your email",
    mailgenContent: emailVerificationMailGenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unhashedToken}`,
    ),
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken");

  if(!createdUser)
    throw new ApiError(500, "Something went wrong while regestering new user");

  return res
    .status(200)
    .json(
      new ApiResponse(200, {
        createdUser
      },
    "User registered sucessfully and email verification mail sent")
    )
});

export default registerUser;