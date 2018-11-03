<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate,post-check=0, pre-check=0,max-age=0" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="-1" />
    <title>My Madhouse IO</title>
    <base path="/" />
    <link rel="stylesheet" href="styles/bootstrap.css" />
    <link rel="stylesheet" href="styles/app.css" />
  </head>
  <body>
    <div class="container">
      <h1>My Madhouse IO Client Profile</h1>
     <h2>Financial Statements & Reports</h2>
      <ul id="navigation" class="nav nav-pills">
          <li id="pageLogout" class="active"><a href="<?php echo getenv('APPSETTING_PAGE_LOGOUT')?>" id="logout">Logout</a></li>
          <li id="pageEditProfile" class="active"><a href="<?php echo getenv('APPSETTING_PAGE_EDIT')?>">Edit Profile</a></li>
          <li id="pageResetPassword" class="active"><a href="<?php echo getenv('APPSETTING_PAGE_RESET')?>">Reset Password</a></li>
      </ul>
     <br>
    <div id="reportstatic" class="powerbi-container"></div>
          <br>
          <p>
    		<button type="button" id="printReport" class="btn btn-warning">Print</button>
    		<button type="button" id="reloadReport" class="btn btn-warning">Refresh</button>
    		<button type="button" id="fullscreen" class="btn btn-warning">Fullscreen Mode</button>
          </p>
    </div>
    <script src="https://code.jquery.com/jquery-3.3.1.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/powerbi-client@2.6.5/dist/powerbi.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.3.5/bluebird.min.js"></script>
    <script>
  function getPowerBIEmbededToken (userProfile) {
    return new Promise(function(resolve, reject) {
        var url = '<?php echo getenv('APPSETTING_PAGE_AUTH_TOKEN')?>';
        var request = new XMLHttpRequest();
    		request.open('GET',url,true);
    		request.onreadystatechange = function () {
    			if (request.readyState == XMLHttpRequest.DONE) {
    			    var embedToken= this.responseText;
    			    resolve(embedToken);
            			}
            		};
        	request.send();
      });
    
}
function getUser() {
    return new Promise(function(resolve, reject) {
         var url = '<?php echo getenv('APPSETTING_PAGE_ME')?>';
         var request = new XMLHttpRequest();
    		 request.open('GET',url,true);
    		 request.onreadystatechange = function () {
    			if (request.readyState == XMLHttpRequest.DONE) {
    			    try{
    			        var json=this.responseText.substring(1, this.responseText.length-1);
    			        var objID = JSON.parse(JSON.stringify(JSON.parse(json).user_claims[12])).val;
                        var upn = JSON.parse(JSON.stringify(JSON.parse(json).user_claims[16])).val;
                        var userProfile = [];
                        userProfile.push(objID);
                        userProfile.push(upn);
                      resolve(userProfile);
    			    }catch(error){
            window.location.reload(true);
        }
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
                              id: '<?php echo getenv('APPSETTING_REPORT_ID')?>',
                            embedUrl: '<?php echo getenv('APPSETTING_REPORT_URL')?>', 
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
         
         
    })  
    
    
    
    </script>
  </body>
</html>