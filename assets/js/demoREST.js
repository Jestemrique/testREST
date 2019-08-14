
let pageTitle = document.title;
//var mstrInfo = JSON.parse( localStorage.getItem('mstrInfo'));




function homePageActions(){
    let mstrInfo = new MstrRest();
    let loginForm = document.getElementById('mstrLoginForm');
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let formAction = loginForm.action;
        let formData =  new FormData(loginForm);
        let authInfo = {
            username: formData.get('username'),
            password: formData.get('password')
        }
        mstrInfo.doAuthenticate(authInfo)
          .then( authToken => {
              mstrInfo.getProjects(authToken)
                .then( listProjects => {
                  console.log("Projects: " + JSON.stringify(listProjects));
                })
                .catch( error => {
                  console.log(error)
                });
              window.location.replace(formAction);
              return authToken;
          })
          .catch( error => {
            console.log("Error-: " + error);
          });
          
    });
    
}

function libraryPageActions(){
    console.log("library");
}


switch (pageTitle) {
  case 'Home':
    homePageActions();
    break;
  case 'Library':
    libraryPageActions();
    break;
  default:
  
  break;
}


