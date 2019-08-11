
let pageTitle = document.title;
let mstrInfo = JSON.parse( localStorage.getItem('mstrInfo'));

if (typeof mstrInfo != 'undefined'){
    let mstrInfo = new MstrRest();
}
else{
    alert(mstrInfo.host);
}



function homePageActions(){

    //let mstrConn = new MstrRest();
    let loginForm = document.getElementById('mstrLoginForm');
    
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let formAction = loginForm.action;
        let formData =  new FormData(loginForm);
        let authInfo = {
            username: formData.get('username'),
            password: formData.get('password')
        }
        debugger;
        mstrInfo.doAuthenticate(authInfo)
          .then( response => {
              window.location.replace(formAction);
          })
          .then(
            console.log("populate projects and dossiers")          
          )
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






// window.addEventListener('load', (event) =>{
//     let pageTitle = document.title;

//     //Home page.
//     function pageHomeActions(){
//         var mstrConn = new MstrRest();
//         let loginForm = document.getElementById('mstrLoginForm');
        
//         loginForm.addEventListener('submit', (event) => {
//             let formData = new FormData(loginForm);
//             let authInfo = {
//                 username: formData.get('username'),
//                 password: formData.get('password')
//             }
//             mstrConn.doAuthenticate(authInfo)
//              .then(response => {
//                  console.log(response);
//              })
//              .catch( error  => {
//                  console.log(error);
//              });
//         });
//     }

//     //Library page.
//     function pageLibraryActions(){

//     }





//     switch (pageTitle) {
//       case 'Home':
//         console.log('Title: ' + pageTitle);  
//         pageHomeActions();
//         break;
//       case 'Library':
//         console.log('Title: ' + pageTitle);
//         pageLibraryActions();
//         break;
//       default:
//         console.log('Default action:');
//     }
          
    






// });