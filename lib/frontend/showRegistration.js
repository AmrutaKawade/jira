module.exports = async (req, res, next) => {
    // [TODO ] correct the urls here 
    registration_data = JSON.stringify({"name": "Jira-App",
    "url": "https://github.com/apps/Jira-App",
    "hook_attributes": {
        "url": "https://shreyayay-jira.ngrok.io/github/events",
    },
    "redirect_url": "https://shreyayay-jira.ngrok.io/ghaeRegisterComplete/",
    "callback_urls": [
        "https://shreyayay-jira.ngrok.io/github/callback"
    ],
    "setup_url": "https://shreyayay-jira.ngrok.io/github/setup",
    "default_permissions": {
        "issues": "write",
        "contents": "read",
        "metadata": "read",
        "pull_requests": "write"

      },
      "default_events": [
        "create",
        "commit_comment",
        "delete",
        "issue_comment",
        "issues",
        "pull_request",
        "pull_request_review",
        "pull_request_review_comment",
        "push"

      ],
      
    "public": true})

    return res.render("ghae_register.hbs", {
        registration_data : registration_data
    });
  };