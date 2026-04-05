const authService = require("../services/authService");

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const user = await authService.register({ name, email, password, role });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await authService.login(email, password);
    res.json({ token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};
