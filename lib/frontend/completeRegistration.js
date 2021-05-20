const request = require('request');
const { GitHubAPI } = require('probot');
const events = require('events');
const url = require('url');
const fetch = require("node-fetch");
const { response } = require('../api');

module.exports = async (req, res, next) => {

    console.log(JSON.stringify(req.url))
    const { query } = url.parse(req.url, true);
    console.log(query.code)

    // parse the request and 

    url_fetch = "http://api.github.localhost/app-manifests/"+ query.code +"/conversions"
    var result = undefined

    result = await fetch(url_fetch,{
            method: "POST",
            headers:{
              "accept": "application/vnd.github.v3+json"
          }
          }).then(response => response.json()).then(data => {return data}).catch((error) => {
            console.error('Error:', error);
          });
    

    return res.render("ghae_register_complete.hbs", {
      app: JSON.stringify(result)
    });
  };