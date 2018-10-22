function getPowerBIEmbededToken (userProfile) {
     //alert(userProfile);
    return new Promise(function(resolve, reject) {
        var url = 'https://madhouse-functions.azurewebsites.net/api/getPowerBIEmbededToken';
        var request = new XMLHttpRequest();
    		request.open('GET',url,true);
    		request.onreadystatechange = function () {
    			if (request.readyState == XMLHttpRequest.DONE) {
    			    var embedToken= this.responseText;
    			    embedToken=embedToken.substring(1, embedToken.length-1)
    			    resolve(embedToken);
            			}
            		};
        	request.send();
      });
}

function getMethods(obj) {
  var result = [];
  for (var id in obj) {
    try {
      if (typeof(obj[id]) == "function") {
        result.push(id + ": " + obj[id].toString());
      }
    } catch (err) {
      result.push(id + ": inaccessible");
    }
  }
  return result;
}


function getUser() {
    return new Promise(function(resolve, reject) {
         var url = 'https://my.madhouseio.org/.auth/me';
         var request = new XMLHttpRequest();
    		 request.open('GET',url,true);
    		 request.onreadystatechange = function () {
    			if (request.readyState == XMLHttpRequest.DONE) {
    			        var json=this.responseText.substring(1, this.responseText.length-1);
    			        var objID = JSON.parse(JSON.stringify(JSON.parse(json).user_claims[12])).val;
                        var upn = JSON.parse(JSON.stringify(JSON.parse(json).user_claims[16])).val;
                        var userProfile = [];
                        userProfile.push(objID);
                        userProfile.push(upn);
                      resolve(userProfile);
            			}
            		};
        	request.send();
      });
}

document.getElementById("logout").addEventListener("click",function(e){
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    });

document.addEventListener("DOMContentLoaded", function(event) { 
    var models = window['powerbi-client'].models; 
    var staticReportContainer = $("#reportstatic");
    var permissions = models.Permissions.All;    
    
     getUser().then(function(userProfile){
            getPowerBIEmbededToken(userProfile).then(function(embedToken){
                  embedConfig={
                          type: 'report',
                        tokenType: models.TokenType.Embed,
                        accessToken:embedToken,
                          id: '9712d264-c39c-463b-80b8-3ab043fa52aa',
                        embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=9712d264-c39c-463b-80b8-3ab043fa52aa&groupId=670e140f-d697-4743-b3bc-d6b4af6879ca', 
                          permissions: permissions,
                          settings: {
                              filterPaneEnabled: false
                              ,navContentPaneEnabled: true
                            }
                          };
          
          var staticReport = powerbi.embed(staticReportContainer.get(0), embedConfig); 

                     $('#fullscreen').click(function(e){
                            staticReport.fullscreen();
                      });
                      
                     $('#reloadReport').click(function(e){
                        staticReport.reload()
                    	.catch(function(error) { alert(error); });
                      });
                      
                      $('#printReport').click(function(e){
                        staticReport.print();
                      });
                    });
        });
});



