
let pageTitle = document.title;


function generateMainMenu(){
  let mstrInfo = JSON.parse(localStorage.getItem('mstrInfo'));

  let listProjects = mstrInfo.projectsList;

  let tmpListDossiers = [];
  listProjects.forEach( project => {
    tmpListDossiers.push(project.dossiersList.flat());
  });

  let listDossiersFlat = tmpListDossiers.flat();
  debugger;



  // listItems.forEach( item => {
  //   let anchorItem = document.createElement("a");
  //   let anchorText = document.createTextNode(item.name);
  //   anchorItem.appendChild(anchorText);
  //   anchorItem.title = anchorItem.name;
  //   anchorItem.href = "#";
  //   anchorItem.classList.add("navbar-item");
  //   document.getElementById("main-menu__item--" + itemsType).appendChild(anchorItem); 
  // });
}//End generateMainMenus()




// function generateMainMenus(listItems, itemsType){
//   listItems.forEach( item => {
//     let anchorItem = document.createElement("a");
//     let anchorText = document.createTextNode(item.name);
//     anchorItem.appendChild(anchorText);
//     anchorItem.title = anchorItem.name;
//     anchorItem.href = "#";
//     anchorItem.classList.add("navbar-item");
//     document.getElementById("main-menu__item--" + itemsType).appendChild(anchorItem); 
//   });
// }//End generateMainMenus()


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

function libraryPageActions(){
  console.log("library");
  let authToken = JSON.parse(localStorage.getItem('mstrInfo')).token;
  let mstrInfo = new MstrRest();
  mstrInfo.getProjects(authToken)
  .then( projectsList => {
    //generateMainMenus(projectsList, 'projects');
    return projectsList;
  })
  .then( projectsList => {
      //debugger;
      mstrInfo.getDossiers(authToken, "FILTER_TOC")
        .then( dossiersList => {
          //generateMainMenus(dossiersList, 'dossiers');
        })
  })
  .catch( error => {
    console.log("Error [Library]: " + error);
  });
}//End libraryPageActions();




function projectsPageActions(){
  //console.log('Page: Projects');
  //Retreive list projects and dossiers.
  debugger;
  let mstrInfo = JSON.parse(localStorage.getItem('mstrInfo'));
  let projectsList = mstrInfo.projectsList;
  let dossiersList = mstrInfo.dossiersList;
  //generateMainMenus(projectsList, 'projects');
  //generateMainMenus(dossiersList, 'dossiers');
  generatePageContent( projectsList, 'projects');
  generateMainMenu();
}







// function projectsPageActions(){
//   //console.log('Page: Projects');
//   //Retreive list projects and dossiers.
//   debugger;
//   let mstrInfo = JSON.parse(localStorage.getItem('mstrInfo'));
//   let projectsList = mstrInfo.projectsList;
//   let dossiersList = mstrInfo.dossiersList;
//   generateMainMenus(projectsList, 'projects');
//   generateMainMenus(dossiersList, 'dossiers');
//   generatePageContent( projectsList, 'projects');
// }



function dossiersPageActions(){
  console.log('Page: Dossiers');
  //Retreive list projects and dossiers.
  let mstrInfo = JSON.parse(localStorage.getItem('mstrInfo'));
  let projectsList = mstrInfo.projectsList;
  let dossiersList = mstrInfo.dossiersList;
  generateMainMenus(projectsList, 'projects');
  generateMainMenus(dossiersList, 'dossiers');
  generatePageContent( dossiersList, 'dossiers');
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


