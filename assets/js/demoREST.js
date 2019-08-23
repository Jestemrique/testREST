
let pageTitle = document.title;

function retrieveDossiersFromLocalStorage( projectID = null){
  let mstrInfo = JSON.parse(localStorage.getItem('mstrInfo'));
  let listProjects = mstrInfo.projectsList;
  let dossiers =  null;

  if ( projectID !== null ){
    dossiers = listProjects.find( project =>  project.id === projectID );
  }
  else{
    dossiers = listProjects.map ( (project) => {
      let tmpDossiers = [];
      for (const dossier of project.dossiersList) {
        tmpDossiers.push(dossier);
      }
      return tmpDossiers;
    });
  }

  return dossiers;
}

  // let mstrInfo = JSON.parse(localStorage.getItem('mstrInfo'));
  // let listProjects = mstrInfo.projectsList;
  // let listDossiers = [];

  // for (let i = 0; i < listProjects.length; i++) {
  //      let dossiersFromProject = listProjects[i].dossiersList.map( dossier =>{
  //        let tmpDossier = {};
  //        tmpDossier.id = dossier.id;
  //        tmpDossier.name = dossier.name;
  //        tmpDossier.projectId = dossier.projectId;
  //        return tmpDossier;
  //      });
  //      listDossiers.push(dossiersFromProject.flat());
  //   }
  // let arrayDossiers = listDossiers.flat();
  // return arrayDossiers;
//}




// function retrieveDossiersFromLocalStorage(){
//   let mstrInfo = JSON.parse(localStorage.getItem('mstrInfo'));
//   let listProjects = mstrInfo.projectsList;
//   let listDossiers = [];

//   for (let i = 0; i < listProjects.length; i++) {
//        let dossiersFromProject = listProjects[i].dossiersList.map( dossier =>{
//          let tmpDossier = {};
//          tmpDossier.id = dossier.id;
//          tmpDossier.name = dossier.name;
//          tmpDossier.projectId = dossier.projectId;
//          return tmpDossier;
//        });
//        listDossiers.push(dossiersFromProject.flat());
//     }
//   let arrayDossiers = listDossiers.flat();
//   return arrayDossiers;
// }




function generateMainMenu(){
  let mstrInfo = JSON.parse(localStorage.getItem('mstrInfo'));
  let listProjects = mstrInfo.projectsList;
  let listDossiers = retrieveDossiersFromLocalStorage();
  
  generateMenu(listProjects, 'projects');
  generateMenu(listDossiers, 'dossiers');
}//End generateMainMenus()


function generateMenu(listItems, itemsType){
  listItems.forEach( item => {
    let anchorItem = document.createElement("a");
    let anchorText = document.createTextNode(item.name);
    anchorItem.appendChild(anchorText);
    anchorItem.title = anchorItem.name;
    anchorItem.href = "#";
    anchorItem.classList.add("navbar-item");
    document.getElementById("main-menu__item--" + itemsType).appendChild(anchorItem); 
  });
}//End generateMenu()


function generatePageContent(listItems, itemsType ){
  let itemsContainer = document.getElementById(itemsType + 'PageContent');
  
  listItems.forEach( item => {
    let itemColumn = document.createElement('div');
    itemColumn.className = 'column';

    let itemComponent = document.createElement('div');
    itemComponent.className = 'card';

    let itemComponent__header = document.createElement('div');
    itemComponent__header.className= 'card-header';
    
    let itemComponent__content = document.createElement('div');
    itemComponent__content.className= 'card-content';
    
    let itemContent = document.createTextNode(item.name); 
    let itemHeader =document.createTextNode(item.id);

    itemComponent__content.appendChild(itemContent);
    itemComponent__header.appendChild(itemHeader);
    
    itemComponent.appendChild(itemComponent__header);
    itemComponent.appendChild(itemComponent__content);
    itemColumn.appendChild(itemComponent);
    itemsContainer.appendChild(itemColumn);
  });
  return itemsContainer;
}



function homePageActions(){
    let mstrInfo = new MstrRest();
    let loginForm = document.getElementById('mstrLoginForm');

    let menuProjects = null;
    let menuDossiers = null;
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let formAction = loginForm.action;
        let formData =  new FormData(loginForm);
        let authInfo = {
            username: formData.get('username'),
            password: formData.get('password')
        };
        
        mstrInfo.doAuthenticate(authInfo)
          .then( authToken => {
            return mstrInfo.getProjects(authToken)
              .then( listProjects => {
                //menuProjects = listProjects;
                return authToken
              });
            })
          .then( (authToken) => {
            return mstrInfo.getDossiers(authToken, "FILTER_TOC")
              .then( listDossiers => {
                //menuDossiers = listDossiers;
                window.location.replace(formAction);
                return authToken;
              });
          })
          .catch( error => {
            console.log("Error"  + error);
          });
    });
}//End homePageActions()



function libraryPageActions(){
  generateMainMenu();
}//End libraryPageActions();



function projectsPageActions(){
  console.log("Page: Projects");
  let mstrInfo = JSON.parse(localStorage.getItem('mstrInfo'));
  let projectsList = mstrInfo.projectsList;
  generatePageContent( projectsList, 'projects');
  generateMainMenu();
}


function dossiersPageActions(){
  console.log('Page: Dossiers');
  //Retreive list projects and dossiers.
  let mstrInfo = JSON.parse(localStorage.getItem('mstrInfo'));
  let projectsList = mstrInfo.projectsList;
  //let dossiersList = mstrInfo.dossiersList;
  /////////////// TESTING
  //B19DEDCC11D4E0EFC000EB9495D0F44F
  let dossiersList = retrieveDossiersFromLocalStorage('B19DEDCC11D4E0EFC000EB9495D0F44F');

  /////////////// TESTING
  generatePageContent( dossiersList, 'dossiers');
  generateMainMenu();
  
}

//Actions to perform in each page.
switch (pageTitle) {
  case 'Home':
    homePageActions();
    break;
  case 'Library':
    libraryPageActions();
    break;
  case 'Projects':
    projectsPageActions();
    break;
  case 'Dossiers':
    dossiersPageActions();
    break;
  default:
  
  break;
}


