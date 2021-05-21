$('#ghae_url_id').keyup(function (event) {
    event.preventDefault()
    let ghaeInstanceHost = new URL(document.getElementById("ghae_url_id").value).hostname
    let ghaeInstance = 'https://' + ghaeInstanceHost + '/settings/apps/new?state=abc123'
    
    //add github
    document.cookie = "githubHost=" + ghaeInstanceHost;

    document.getElementById("ghae_form_id").action = ghaeInstance
})