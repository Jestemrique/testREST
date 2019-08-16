class MstrRest{
  host = 'localhost';
  port = 8080;
  apiURL = "/Library111U2/api"
  baseURL = 'http://' + this.host + ':' + this.port + this.apiURL;
  loginMode = 1 //Standard
  token = null;
  projectsList = null;
  dossiersList = null;




  constructor(){
    
  }

  persistMstrInfoChanges(property, value){
    let tempMstr = JSON.parse(localStorage.getItem('mstrInfo'));
    
    switch (property) {
      case 'projectsList':
        console.log("Persisting projects");
        tempMstr['projectsList'] = value;
        break;
      case 'dossiersList':
        console.log("Persisting dossiers");
        for (let  project of tempMstr.projectsList) {
          let dossiersToInsert = value.filter( dossierElement => dossierElement.projectId === project.id);
          project.dossiersList = dossiersToInsert;
        }
        break;
      default:
        console.log("Any other option to persist.");
        break;
    }

    localStorage.setItem('mstrInfo', JSON.stringify(tempMstr));
    

  }



  // persistMstrInfoChanges(property, value){
  //   let tempMstr = JSON.parse(localStorage.getItem('mstrInfo'));
  //   tempMstr[property] = value;
  //   localStorage.setItem('mstrInfo', JSON.stringify(tempMstr));
    
  // }

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
            //this.persistLocalStorage(this);
            return this.token;
        }
        else{
            throw("Error: " + response.status + response.statusText);
        }
    })
    .catch( (error) => {
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
    
     return fetch(endPoint, {
        credentials: 'include',
        method: fetchMethod,
        headers: fetchHeaders
      })
    .then( response => response.json() ) 
    .then( json => {
        this.projectsList = json.map( project => { return {"id":project.id, "name":project.name} });
        this.persistMstrInfoChanges('projectsList', this.projectsList);
        
        return this.projectsList;
    })
    .catch( (error) => {
        console.log("Error" + error);
    });
   
}//End getProjects();



getDossiers(authToken, flagDossierInfo = 'DEFAULT'){
    let endPoint = this.baseURL + '/library?outputFlag=' + flagDossierInfo ;
    let fetchOptions= {
            credentials: 'include',
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'x-mstr-authToken': authToken
            }
    };
    return fetch(endPoint, fetchOptions)
      .then( response => response.json() )
      .then( data => {
        this.dossiersList = data.map( dossier => { return {"id": dossier.id, "name": dossier.name, "projectId": dossier.projectId}})
        this.persistMstrInfoChanges('dossiersList', this.dossiersList);
        return this.dossiersList;
      })
      .catch( (error) => {
        console.log("[jslibrary.js::getDossiersList][Error]: " + error);
      });

}//End getDossiersList()





}//End MStrREST.

