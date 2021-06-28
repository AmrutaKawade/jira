module.exports = async (req, res) => {
  const jiraHost = req.query.xdm_e;
  const githubHost = req.query.githubHost;

  req.session.jiraHost = jiraHost;
  req.session.githubHost = githubHost;
  
  return res.redirect('/github/login');
};
