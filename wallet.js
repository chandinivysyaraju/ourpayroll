var role,bel,user,companyname,email,wallet,address,token,dappid;
async function model(){
role=localStorage.getItem("roleId");
bel=localStorage.getItem("bel");
email=localStorage.getItem("email");
address=localStorage.getItem("address");
dappid = localStorage.getItem('dappid');
companyname=localStorage.getItem("companyname")
document.getElementById("name").innerText=email;
document.getElementById("balance").innerText=(bel+" "+"BEL");
if(role!="new user"){
document.getElementById("company").innerText=companyname;
}
// document.getElementById("valid").innerText=
document.getElementById("wallet").innerText=(bel+" "+"BEL");
document.getElementById("address").innerText=address;
//document.getElementById("dapp").innerText=bel
  console.log(role);
  if((role==="superuser")||(role==="new user")){
   var list = document.getElementById('heading_list');
  list.childNodes[5].remove();
  list.childNodes[1].remove();
  if(role==='superuser')
  document.getElementById("regdapp").remove();
  }
  if(role==="issuer"){
      var list = document.getElementById('heading_list');
      list.childNodes[5].remove();
      list.childNodes[3].remove();
      document.getElementById("regdapp").remove();
  }  
  if(role==="authorizer"){
      var list = document.getElementById('heading_list');
      list.childNodes[3].remove();
      list.childNodes[1].remove();
      document.getElementById("regdapp").remove();
  }
  var response = await getDappBalance();
  if( response == undefined){
      response='0';
  }
  document.getElementById('dapp1').innerText= response + " BEL";
}

async function getDappBalance(){
    var result;
    try
       {
        result = await $.ajax({
            type: 'get',
            url: HOST_URL+"/"+dappid+"/"+"accounts/balance",            
            data:{"dappId":dappid, "address":address}
    });
            console.log(result);
            return result['account']['balances'][0];
        }
        catch(error)
        {
            console.log(error);
        }
}

async function registerdapp(){
    token=localStorage.getItem("belToken");
  const result=await CheckKYCStatus(token)
  console.log(result);
    // if(bel>50)
    if(true)
    {
  var passphrase=document.getElementById("passphrase1").value;
  var dappname=document.getElementById("dappname").value;
  var description=document.getElementById("description").value;
  var company=document.getElementById("company1").value;
    var country=localStorage.getItem("country");
    var email=localStorage.getItem("email");

var params={
secret:passphrase,
  des:description,
    email:email,
    company:company,
    country:country,
    name:dappname,
    country:"india"
}
console.log(params);
const res=await dappreg(params);
console.log(res);
if(res["isSuccess"]===true){
    alert("Your DAPP got "+JSON.stringify(res));
    localStorage.setItem("dappid",res["dappid"]);
    document.getElementById("close").click();
    document.getElementById("logout").click();

    }
}
    else
    {
        alert("Please recharge your Wallet");
    }
}
async function dappreg(data){
    let result;
    try
    {
    result = await $.ajax({
        type: 'post',
        url: HOST_URL+"/"+SDAPP_ID+"/"+"makeDapp",
        data: JSON.stringify(data),
        contentType: 'application/json;charset=UTF-8',
        dataType: 'json'});
        return result;
    }
    catch(error){
    if(error){
        console.log(error);
      if((error["status"] === 401) && (error["responseJSON"]["status"]==="UNAUTHORIZED")){
          alert("error" + error["responseJSON"]["message"]);
      }else{
          alert("error" + error["responseJSON"]["message"]);
      }
    }
}
}

async function CheckKYCStatus(token)
   {
       let result;
       try
       {
        result = await $.ajax({
            type: 'get',
            url: 'http://54.254.174.74:8080/api/v1/user/countries/kyc',
            headers: {"belrium-token" : token}});
            // console.log(result);
            return result;
        }
        catch(error)
        {
            console.log(error);
        }
    }

