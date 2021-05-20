module.exports = async (req, res, next) => {
    // [TODO ] correct the urls here 
    registration_data = JSON.stringify({"name": "Jira-App",
    "url": "https://amkgithub.atlassian.net",
    "hook_attributes": {
        "url": "https://amk-jira.loca.lt/github/events",
    },
    "redirect_url": "https://amk-jira.loca.lt/ghaeRegisterComplete/",
    "callback_urls": [
        "https://amk-jira.loca.lt/github/callback"
    ],
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
    
    form_action_url = "http://github.localhost//settings/apps/new?state=abc123"

    return res.render("ghae_register.hbs", {
        registration_data : registration_data,
        form_action_url : form_action_url
    });
  };