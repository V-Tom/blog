'use strict'
const request = require('request')


function AccessGithub(code) {
  return new Promise((resolve, reject)=> {
    request({
      "method": "POST",
      "uri": "https://github.com/login/oauth/access_token",
      "headers": {
        "Accept": "application/json"
      },
      "form": {
        "client_id": global.config.app.userAccess.github.client_id,
        "client_secret": global.config.app.userAccess.github.client_secret,
        "code": code
      }
    }, (tokenError, tokenResponse, tokenBody)=> {
      if (tokenError) {
        reject(tokenError)
      } else {
        if (!tokenError && tokenResponse.statusCode == 200) {
          let token = JSON.parse(tokenBody);
          if (token.error) {
            reject(token)
          } else {
            request.get({
              "method": "GET",
              "uri": `https://api.github.com/user?access_token=${token.access_token}`,
              "headers": {
                "User-Agent": "Awesome-Octocat-App"
              }
            }, (userErr, UserResponse, UserBody)=> {
              if (userErr) {
                reject(userErr)
              } else {
                if (!userErr && UserResponse.statusCode == 200) {
                  resolve(JSON.parse(UserBody))
                }
              }
            })
          }
        }
      }
    })
  })
}


exports.oAuthAccess = function *(state, code) {
  state = String(state).toLocaleLowerCase()
  switch (state) {
    case 'Github':
      return AccessGithub(code)
  }
}