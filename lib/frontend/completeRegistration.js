const url = require('url');
const fetch = require("node-fetch");
const { AppSecrets } = require('../models');

module.exports = async (req, res, next) => {

    console.log(JSON.stringify(req.url))
    const { query } = url.parse(req.url, true);
    console.log(query.code)

    // parse the request and 

    url_fetch = "https://ghaebuild50276.ghaekube.net/api/v3/app-manifests/"+ query.code +"/conversions"
    var result = undefined

    result = await fetch(url_fetch,{
            method: "POST",
            headers:{
              "accept": "application/vnd.github.v3+json"
          }
          }).then(response => response.json()).then(data => {return data}).catch((error) => {
            console.error('Error:', error);
          });
    
    const secrets = await AppSecrets.insert({
      clientId: result.client_id, 
      clientSecret: result.client_secret, 
      privateKey: result.pem, 
      appId: result.id,
      githubHost: new URL(result.html_url).hostname
    });
    return res.render("ghae_register_complete.hbs", {
      app: JSON.stringify(result)
    });
  };