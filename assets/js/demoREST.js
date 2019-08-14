
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
        };
        mstrInfo.doAuthenticate(authInfo)
          .then( (authToken) => {
            window.location.replace(formAction);
          })
          .catch( error => {
            console.log("Error"  + error);
          })
    });
}

function generateProjectsMenu(listProjects){
  alert("Generating projects menu");
}



function libraryPageActions(){
    console.log("library");
    //Check mstrInfo object exists to retrieve token.
    let authToken = JSON.parse(localStorage.getItem('mstrInfo')).token;
    let mstrInfo = new MstrRest();
    let projectsList = mstrInfo.getProjects(authToken)
    .then( projectList => {
      generateProjectsMenu(projectsList);
    })
    .catch( error => {
      console.log("Error generating projects menu: " + error);
    });

    alert(projectsList);

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


