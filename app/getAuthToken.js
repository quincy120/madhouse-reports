var request = require('request');

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    getAADToken().then(
    function(AADToken){
        getPowerBIEmbedToken (AADToken
        ,'670e140f-d697-4743-b3bc-d6b4af6879ca'
        ,'9712d264-c39c-463b-80b8-3ab043fa52aa')
        .then(function(embedToken){
            
              context.res = {
            // status: 200, /* Defaults to 200 */
            body: embedToken
        };
            
            context.done();
            
        })
        ;
    }
    );

    
};

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
      //console.log(AADToken);
    })
  });
}

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
      var bodyObj = JSON.parse(body);
      var embedToken=bodyObj.token;
      resolve(embedToken);

    })
  })
}



    
    

