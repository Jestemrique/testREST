
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
<<<<<<< HEAD
        };
        debugger;
=======
        }
>>>>>>> 8cef204d6ffad99eba0a532db25be244d574154d
        mstrInfo.doAuthenticate(authInfo)
          .then( response => {
              window.location.replace(formAction);
          })
          .then(
            console.log("populate projects and dossiers")          
          );
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


