let pageTitle = document.title;
let baseLocalURL = 'http://localhost:4000/';
let baseLibraryURL = "http://localhost:8080/Library111U2/app/"

// let mstrInfoTemp = JSON.parse(localStorage.getItem('mstrInfo'));
// let baseLibraryURL = mstrInfoTemp.baseURL;
// alert(baseLibraryURL);


let getProjectCookie = name => {
  let nameEQ = name + "=";
  let ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
  let c = ca[i];
  while (c.charAt(0) === " ") c = c.substring(1, c.length);
  if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,
      c.length);
  }
 return null;
 };


function retrieveDossiersFromLocalStorage( projectID = null){
  let mstrInfo = JSON.parse(localStorage.getItem('mstrInfo'));
  let listProjects = mstrInfo.projectsList;
  let dossiers =  [];
  
  if ( projectID !== null ){
    dossiers = listProjects.find( project =>  project.id === projectID ).dossiersList;
  }
  else{
    for (let project of listProjects){
      for (let dossier of project.dossiersList) {
        dossiers.push(dossier);
      }
    };
  }
  return dossiers;
}

function generateMainMenu(){
  let mstrInfo = JSON.parse(localStorage.getItem('mstrInfo'));
  let listProjects = mstrInfo.projectsList;
  let listDossiers = retrieveDossiersFromLocalStorage();
  
  generateMenu(listProjects, 'projects');
  generateMenu(listDossiers, 'dossiers');
}//End generateMainMenus()


function generateMenu(listItems, itemsType){

  listItems.forEach( item => {
    //debugger;
    let anchorItem = document.createElement("a");
    let anchorText = document.createTextNode(item.name);
    anchorItem.appendChild(anchorText);
    anchorItem.title = anchorItem.name;
    
    //debugger;
    //anchorItem.href = (itemsType === 'projects') ? './dossiers.html'  : baseLibraryURL + item.projectId + '/' + item.targetId;
    
    if (itemsType === 'projects'){
      anchorItem.href = './dossiers.html';
      //alert ("Hola!");
      anchorItem.addEventListener('click', (event) => {
        //document.cookie = "currentProjectId=" + item.id + "";
        //debugger;
        sessionStorage.setItem('currentProjectId', item.id);
      });
    }
    else{
      anchorItem.href = baseLibraryURL + item.projectId + '/' + item.targetId;
    }


    anchorItem.setAttribute("data-projectId", item.id);
    anchorItem.classList.add("navbar-item");
    
    document.getElementById("main-menu__item--" + itemsType).appendChild(anchorItem); 
    //debugger;
  });
}//End generateMenu()



// function generateMenu(listItems, itemsType){
//   listItems.forEach( item => {
//     let anchorItem = document.createElement("a");
//     let anchorText = document.createTextNode(item.name);
//     anchorItem.appendChild(anchorText);
//     anchorItem.title = anchorItem.name;
//     anchorItem.href = "#";
//     anchorItem.classList.add("navbar-item");
//     document.getElementById("main-menu__item--" + itemsType).appendChild(anchorItem); 
//   });
// }//End generateMenu()


function generatePageContent(listItems, itemsType ){


  let baseUrLink = (itemsType === 'dossiers') ? baseLibraryURL  : baseLocalURL;

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

        //create link with ID of project or dossier
        let href_component = document.createElement('a');
        if ( itemsType === 'dossiers'){
          href_component.setAttribute('href', baseUrLink + item.projectId + '/' + item.targetId);  
        }
        else{
          //href_component.setAttribute('href', baseUrLink + 'dossiers.html');
          href_component.setAttribute('href', './dossiers.html');

          href_component.setAttribute("data-projectId", item.id);
          href_component.addEventListener('click', (event) => {
            //document.cookie = "currentProjectId=" + item.id + "";
            sessionStorage.setItem('currentProjectId', item.id);
          });
        }
        href_component.appendChild(itemContent);
        ///End creating element href.
    

    itemComponent__content.appendChild(href_component);
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
            return mstrInfo.getDossiers(authToken, "DEFAULT")
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


function dossiersPageActions(projectID = null){
  console.log('Page: Dossiers');
  let mstrInfo = JSON.parse(localStorage.getItem('mstrInfo'));
  let projectsList = mstrInfo.projectsList;
  let dossiersList = retrieveDossiersFromLocalStorage(projectID);
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
    //let params = new URLSearchParams(document.location.search.substring(1));
    //let projectID = params.get("projectID");
    //let projectID = getProjectCookie('currentProjectId');
    let projectID = sessionStorage.getItem("currentProjectId");
    //debugger;
    dossiersPageActions(projectID);
    break;
  default:
  
  break;
}




// //Actions to perform in each page.
// switch (pageTitle) {
//   case 'Home':
//     homePageActions();
//     break;
//   case 'Library':
//     libraryPageActions();
//     break;
//   case 'Projects':
//     projectsPageActions();
//     break;
//   case 'Dossiers':
//     let params = new URLSearchParams(document.location.search.substring(1));
//     let projectID = params.get("projectID");
//     dossiersPageActions(projectID);
//     break;
//   default:
  
//   break;
// }


