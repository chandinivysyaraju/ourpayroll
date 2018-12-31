var str;
var role=localStorage.getItem("roleId");
var company=localStorage.getItem("companyname");
var email=localStorage.getItem("email");
var belriumtoken=localStorage.getItem("belToken");
var dappid=localStorage.getItem("dappid");
var bel=localStorage.getItem("bel");
function model(){
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
       document.getElementById("name").innerText=email;
       document.getElementById("company").innerText=company;
       document.getElementById("balance").innerText=(bel+" "+"BEL");
    }