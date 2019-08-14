class MstrRest{
  host = 'localhost';
  port = 8080;
  apiURL = "/Library111U2/api"
  baseURL = 'http://' + this.host + ':' + this.port + this.apiURL;
  loginMode = 1 //Standard
  token = null;
  projectsList = null;
  
  constructor(){
    
  }

  doAuthenticate(authInfo){
    let endPoint = this.baseURL + '/auth/login';
    let userInfo = {
        username: authInfo.username,
        password: authInfo.password,
        loginMode: this.loginMode
    };
    let fetchMethod = 'POST';
    let fetchHeaders = {
        'content-type': 'application/json',
        'accept': 'application/json',
      };

    return fetch ( endPoint, {
        credentials: 'include',
        method: fetchMethod,
        body: JSON.stringify(userInfo),
        headers: fetchHeaders
        })
    .then( (response) => {
        if (response.ok){
            this.token = response.headers.get('X-MSTR-AuthToken');
            localStorage.setItem('mstrInfo', JSON.stringify(this));
            return this.token;
        }
        else{
            throw("Error: " + response.status + response.statusText);
        }
    })
    .catch( (error) => {
          //Show message user interface.
          console.log("Error: " + error)
    }  );
}//End Authenticate.



getProjects(authToken){
    let endPoint = this.baseURL + '/projects';
    let fetchMethod = 'GET';
    let fetchHeaders = {
        'content-type': 'application/json',
        'X-MSTR-AuthToken': authToken,
      };
    
      fetch(endPoint, {
        credentials: 'include',
        method: fetchMethod,
        headers: fetchHeaders
      })
    .then( response.json() ) 
    .then( json => {
        this.projectsList = json;
        debugger;
    })
    .catch( (error) => {
        console.log("Error" + error);
    });
   
}

}

