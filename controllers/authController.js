const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Profile } = require("../models");

const signup = async (req, res) => {
  const {
    email,
    password,
    frstname,
    lastname,
    phone,
    skills,
    current_location,
    experience,
    portfolio_url,
    career_goals,
  } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password_hash: hash });

    let profileDta = await Profile.create({
      user_id: user.id,
      frstname,
      lastname,
      phone,
      skills,
      current_location,
      experience,
      portfolio_url,
      career_goals,
    });
    console.log("profile info is ====>", profileDta);

    // const token = jwt.sign(
    //   { userId: user.id, email: user.email },
    //   process.env.JWT_SECRET,
    //   { expiresIn: "1d" }
    // );
    res.status(201).json({ user: user, message: "Signup Sucesssful" });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.status(201).json({ message: "Login succesful", token: token });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

module.exports = { signup, login };
