
const googleAuthCallback = async (req, res) => {
    try {
      const user = req.user;
      if (user) {
        req.session.user = {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
        res.redirect('/');
      } else {
        res.redirect('/login');
      }
    } catch (error) {
      console.log("Error in googleAuthCallback:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  module.exports = {
    googleAuthCallback,
  };
  