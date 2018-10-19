var request = require('request');
var getAADToken = function() {

  return new Promise(function(resolve, reject) {

    var url = 'https://login.microsoftonline.com/common/oauth2/token';

    var username = 'quincy@madhouseio.onmicrosoft.com';
    var password = 'Qw#92245627';
    var clientId = 'cdd5ca63-c018-4a1b-9ab4-8be318d828c9';

    var headers = {
      'Content-Type' : 'application/x-www-form-urlencoded'
    };

    var formData = {
      grant_type:'password',
      client_id: clientId,
      resource:'https://analysis.windows.net/powerbi/api',
      scope:'openid',
      username:username,
      password:password
    };

    request.post({
      url:url,
      form:formData,
      headers:headers

    }, function(err, result, body) {
      if(err) return reject(err);
      var bodyObj = JSON.parse(body);
      var AADToken=bodyObj.access_token;
      resolve(AADToken);
      console.log(AADToken);
    })
  });
}

// -------------------------------------------

var getPowerBIEmbedToken = function(accessToken, groupId, reportId) {

  return new Promise(function(resolve, reject) {

    var url = 'https://api.powerbi.com/v1.0/myorg/groups/' + groupId + '/reports/' + reportId + '/GenerateToken';

    var headers = {
      'Content-Type' : 'application/x-www-form-urlencoded',
      'Authorization' : 'Bearer ' + accessToken
    };

    var formData = {
      "accessLevel": "View"
    };

    request.post({
      url:url,
      form:formData,
      headers:headers

    }, function(err, result, body) {
      if(err) return reject(err);
      console.log(body)
      var bodyObj = JSON.parse(body);
      var embedToken=bodyObj.token;
      resolve(embedToken);
      console.log(embedToken)
    })
  })
}

getAADToken().then(
    function(AADToken){
        getPowerBIEmbedToken (AADToken,'5c26c31f-56d3-4939-b46d-49aace6bea27','891656af-57ba-49ce-95c9-31b398d03266');
    }
    );



// var token = powerbi.PowerBIToken.createReportEmbedToken(workspaceCollectionName = 'madhouse'
//     , workspaceId = '07d6f2df-3e1a-48b8-b0eb-7e6f105dbedd'
//     , reportId = '0d577cb7-1852-428b-8433-318971af5509'
//     , did = ''
//     , scp = 'Report.Read'
//     , username = ''
//     , roles = ''
//     , expiration = new Date(2905804496111));//'2062-01-29T23:54:56.111Z'

// console.log("Token: ", token);

// var jwt = token.generate(process.env.pbiAccessKey);