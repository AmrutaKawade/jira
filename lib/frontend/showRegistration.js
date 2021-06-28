module.exports = async (req, res, next) => {
    // [TODO ] correct the urls here 
    registration_data = JSON.stringify({"name": "Jira-App",
    "url": "https://github.com/apps/Jira-App",
    "hook_attributes": {
        "url": "https://amk-jira.loca.lt/github/events",
    },
    "redirect_url": "https://amk-jira.loca.lt/ghaeRegisterComplete/",
    "callback_urls": [
        "https://amk-jira.loca.lt/github/callback"
    ],
    "setup_url": "https://amk-jira.loca.lt/github/setup",
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