var role=localStorage.getItem("roleId");
var company=localStorage.getItem("companyname");
var email=localStorage.getItem("email");
var belriumtoken=localStorage.getItem("belToken");
var dappid=localStorage.getItem("dappid");
var kycStatus=localStorage.getItem("kycStatus");
var bel;

async function model(){
    console.log(role);
    const res4 = await getAddress();
    console.log("res4: "+res4);
    var address=res4.data.countries[0].wallets[0].address;
    console.log(address);
    localStorage.setItem("address",address);
    const res5 = await getBalance(address);
    console.log("res5 :"+res5);
    var balance=JSON.parse(res5.data).balance;
    bel=balance/10000000000;
    console.log(bel);
    localStorage.setItem("bel",bel);
    $("#address").text(address);
    $("#balance").text(bel+" "+"BEL");
    $("#balance1").text(bel+" "+"BEL");
    console.log("kycStatus: "+kycStatus);
    if(kycStatus==="false")
    {
        window.location.href="kyc.html";
    }
    else
    {
        if((role==="superuser")||(role==="new user")){
            var list = document.getElementById('heading_list');
            list.childNodes[5].remove();
            list.childNodes[1].remove();
            document.getElementById("issue").remove();
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
 }

async function issueDashboard(){
    document.getElementById("username").innerText=email;
    if(role!="new user"){
    document.getElementById("company").innerText=company;
    const res1 = await totalCertsIssued();
    //console.log(res1);
    $("#totalCerts").text(res1.totalCertificates);

    const res2 = await getPendingAuthorizationCount();
    //console.log(res2);
    $("#pendingAuth").text(res2.totalUnauthorizedCertificates);

    const res3 = await totalEmployee();
    //console.log(res3);
    $("#totalEmployee").text(res3.totalEmployee);

    const res6 = await recentIssued();
    //console.log(JSON.stringify(res6));
    var n=res6.length;
    var i;
    for(i=0;i<n;i++){
        add_issuedemployee(res6[i].name,res6[i].empid);
    }
    }
}

async function totalCertsIssued(){
    let result;
      try{
            result = await $.ajax({
            url: HOST_URL+"/"+dappid+"/"+"totalCertsIssued",
            type: 'post',
            contentType: 'application/json;charset=UTF-8',
            dataType: 'json'
            });
            return result;
        }
        catch (error){
          if(error){
            console.log(error);
        }
      }
    }

async function getPendingAuthorizationCount(){
    let result;
        try{
            result = await $.ajax({
            url: HOST_URL+"/"+dappid+"/"+"getPendingAuthorizationCount",
            type: 'post',
            contentType: 'application/json;charset=UTF-8',
            dataType: 'json'
            });
            return result;
        }
        catch (error){
            if(error){
            console.log(error);
        }
      }
    }

async function totalEmployee(){
    let result;
        try{
            result = await $.ajax({
            url: HOST_URL+"/"+dappid+"/"+"totalEmployee",
            type: 'post',
            contentType: 'application/json;charset=UTF-8',
            dataType: 'json'
            });
            return result;
        }
        catch (error){
            if(error){
            console.log(error);
        }
      }
    }

async function getAddress(){
    let result;
        try{
            result = await $.ajax({
            url:HOST_URL+"/"+SDAPP_ID+"/"+"user/wallet",
            type: 'post',
            data:'{"token":"' + belriumtoken +'"}',
            contentType: 'application/json;charset=UTF-8',
            dataType: 'json'
            });
            return result;
        }
        catch (error){
            if(error){
            console.log(error);
        }
      }
    }

async function getBalance(address){
    let result;
        try{
            result = await $.ajax({
            url: HOST_URL+"/"+SDAPP_ID+"/"+"user/balance",
            type: 'post',
            data: '{"address":"' + address +'","belriumtoken":"' + belriumtoken +'"}',
            contentType: 'application/json;charset=UTF-8',
            dataType: 'json'
            });
            return result;
        }
        catch (error){
            if(error){
            console.log(error);
        }
      }
    }

async function recentIssued(){
    let result;
        try{
            result = await $.ajax({
            url: HOST_URL+"/"+dappid+"/"+"recentIssued",
            type: 'post',
            data:'{"limit":"'+10+'"}',
            contentType: 'application/json;charset=UTF-8',
            dataType: 'json'
            });
            return result;
        }
        catch (error){
            if(error){
            console.log(error);
        }
      }
    }

function add_issuedemployee(name,empid){

   add_div=' <tr><td class="table_prppic"><a href=""><img src="lib/img/profile.jpg" width="40"></a></td><td class="table_proname">'+name+' <br><span>emp'+empid+'</span></td><td class="table_issued">Issued</td><td class="table_viewbtn"><a href="#">View Certificate</a></td></tr> ';
   document.getElementById('recent_div').innerHTML+=add_div;
}