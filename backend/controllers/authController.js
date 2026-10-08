async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required.' });
    }

    // Demo authentication check
    const isDemoAdmin = email.toLowerCase() === 'admin@example.com';
    const user = {
      id: isDemoAdmin ? 1 : 2,
      username: isDemoAdmin ? 'admin' : 'analyst',
      email: email,
      role: isDemoAdmin ? 'SOC_ADMIN' : 'SOC_ANALYST',
      fullName: isDemoAdmin ? 'SOC Lead Security Architect' : 'Tier-2 Threat Hunter',
      token: `demo-soc-token-${Date.now()}`
    };

    res.json({
      success: true,
      message: 'Authentication successful.',
      user
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = {
  login
};
