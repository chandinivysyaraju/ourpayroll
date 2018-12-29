var role=localStorage.getItem("roleId");
function model(){
  console.log(role);
  if((role==="superuser")||(role==="new user")){
   var list = document.getElementById('heading_list');
  list.childNodes[5].remove();
  list.childNodes[1].remove();
  }
  if(role==="issuer"){
      var list = document.getElementById('heading_list');
      list.childNodes[5].remove();
      list.childNodes[3].remove();
  }  
  if(role==="authorizer"){
      var list = document.getElementById('heading_list');
      list.childNodes[3].remove();
      list.childNodes[1].remove();
  }
}