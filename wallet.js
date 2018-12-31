var role,bel,user,company,email,wallet;
function model(){
role=localStorage.getItem("roleId");
bel=localStorage.getItem("bel");
user=localStorage.getItem("username");
company=localStorage.getItem("company");
localStorage.getItem("address");
document.getElementById("name").innerText=user;
document.getElementById("balance").innerText=(bel+" "+"BEL");
document.getElementById("company").innerText=company;
// document.getElementById("valid").innerText=
document.getElementById("wallet").innerText=(bel+" "+"BEL");
document.getElementById("address").innerText=address;
//document.getElementById("dapp").innerText=bel
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
async function registerdapp(){
    if(bel>50)
    {
       registerDapp();
   }
   else
   {
       alert("Please recharge your Wallet");
   }
  var passphrase=document.getElementById("passphrase1").innerText;
  var dappname=document.getElementById("dappname").innerText;
  var description=document.getElementById("description").innerText;
    var country=localStorage.getItem("country");
    var email=localStorage.getItem("email");

var params={
secret:passphrase,
  description:description,
    email:email,
    dappid:dappid,
    company:company,
    country:country,
    name:dappname
}
const res=await dappreg(params);
console.log(res);
if(res["isSuccess"]===true){
    alert("Your DAPP got "+JSON.stringify(res));
    localStorage.setItem("dappid",res["dappid"]);
    window.location.href="../Admin/AdminDashboard.html";
    }
}
async function dappreg(data){
    let result;
    try
    {
    result = await $.ajax({
        type: 'post',
        url: HOST_URL+"/"+SDAPP_ID+"/"+"makeDapp",
        data: data,
        contentType: 'application/json;charset=UTF-8',
        dataType: 'json'});
        return result;
    }
    catch(error)
    {
        console.log(error);
    }
}
