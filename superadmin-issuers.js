var secret="cactus peasant return inside filter morning wasp floor museum nature iron can";
//var dappid ="48a7d6bd571d8a636bfc7d64781e03e4dc80df75c99ca98788c63697f9a2d56a";
//var HOST_URL="http://18.188.23.5:9305/api/dapps";
var dappid=localStorage.getItem("dappid");
var role=localStorage.getItem("roleId");
var company=localStorage.getItem("companyname");
var email=localStorage.getItem("email");
var belriumtoken=localStorage.getItem("belToken");
var bel=localStorage.getItem("bel");
const count_countries=253;
var countryData,countryData1,countryid,countryid1,countrycode,countrycode1;
var vals, vals1, arg, arg1;
// Interface call for adding all issuers in the table
function model(){
  console.log(role);
  if((role==="superuser")||(role==="new user")){
   var list = document.getElementById('heading_list');
  list.childNodes[5].remove();
  list.childNodes[1].remove();
 // document.getElementById("issue").remove();
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
  if(role!="new user"){
    document.getElementById("name").innerText=email;
    document.getElementById("company").innerText=company;
    document.getElementById("balance").innerText=(bel+" "+"BEL");
  }
}
var count=0;
function getIssuers(){
    if(count===0)
    {
    $.post(HOST_URL+"/"+dappid+"/"+"issuers",
    function(data)
    {
      var issuer_data='';
      var data = data.issuers; 
        $.each(data,function(key,value){

          var myDate = new Date( Number(value.timestamp));
          var timestamp = myDate.toGMTString();
            
            issuer_data += '<tr>';

            issuer_data += '<td>'+value.iid+'</td>';

            issuer_data += '<td>'+value.email+'</td>';

            issuer_data += '<td>'+value.designation+'</td>';

            issuer_data += '<td>'+timestamp+'</td>';

            issuer_data += '<td> <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#myModal">REMOVE</button> </td>';

            issuer_data += '</tr>';

         });

        $('#example').append(issuer_data);
        count++;
        remove_info();
    });
}

// getting issuer id from the table
$("#example").delegate("tbody tr td:nth-child(5)", "click", function(){
      var $name = $(this).closest("tr"),$tds = $name.find("td:nth-child(1)");            
      $.each($tds, function() {
      var x = $(this).text();
      // var res = window.confirm("Do you want remove issuer with id : "+x);
      // if(res===true){
      //   removeIssuer(x);
      // }
      document.getElementById("val").innerText=x;
   });
 });
}

// Interface call for adding all authorizers in the table
function getAuthorizers(){
if(count===0)
  {
    $.post(HOST_URL+"/"+dappid+"/"+"authorizers",
    function(data)
    {   
      var authorizer_data='';
      var data = data.authorizer;
        
        $.each(data,function(key,value){

          var myDate = new Date( Number(value.timestamp));
          var timestamp = myDate.toGMTString();
            
          authorizer_data += '<tr>';

          authorizer_data += '<td>'+value.aid+'</td>';

          authorizer_data += '<td>'+value.email+'</td>';

          authorizer_data += '<td>'+value.designation+'</td>';

          authorizer_data += '<td>'+timestamp+'</td>';

          authorizer_data += '<td> <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#myModal1">REMOVE</button> </td>';

          authorizer_data += '</tr>';

         });

        $('#example1').append(authorizer_data);
        count++;
        remove_info();
    });
  }

// getting authorizer id from the table
$("#example1").delegate("tbody tr td:nth-child(5)", "click", function(){
    var $name = $(this).closest("tr"),$tds = $name.find("td:nth-child(1)");            
    $.each($tds, function() {
    var y = $(this).text();
    // var res = window.confirm("Do you want remove authorizer with id : "+y);
    // if(res===true){
    //   removeAuthorizer(y);
    // }
    document.getElementById("val1").innerText=y;
  });
});
}

// removing issuer from the table
async function removeIssuer(x){
let result;
var inputs = {iid:x};
try{
result = await $.ajax({
    url: HOST_URL+"/"+dappid+"/"+"issuers/remove",
    type: 'post',
    data: JSON.stringify(inputs),
    contentType: 'application/json;charset=UTF-8',
    dataType: 'json'
});
if(result===true){
  getIssuers();
  timeRefresh(7000);
}
else{
  alert("unable to remove issuer");
}
}
catch (error){
if(error){
    console.log(error);
}
}
}

// removing authorizer from the table
async function removeAuthorizer(y){
let result;
var inputs = {aid:y};
try{
  result = await $.ajax({
      url: HOST_URL+"/"+dappid+"/"+"authorizers/remove",
      type: 'post',
      data: JSON.stringify(inputs),
      contentType: 'application/json;charset=UTF-8',
      dataType: 'json'
  });
  if(result===true){
    getAuthorizers();
    timeRefresh(7000);
  }
  else{
    alert("unable to remove authorizer");
  }
}
catch (error){
  if(error){
      console.log(error);
  }
}
}

function timeRefresh(timeoutPeriod) {
    setTimeout("location.href = 'superadmin-issuers.html'", timeoutPeriod);
  }

function remove_info()
{
    entries=document.getElementById('example_info');
    entries.innerText="";
    entries=document.getElementById('example1_info');
    entries.innerText="";
}

function remove(){
  removeIssuer(document.getElementById('val').innerText);
}

function remove1(){
  removeAuthorizer(document.getElementById('val1').innerText)
}

function getCountries()
{
    $.get("http://54.254.174.74:8080/api/v1/countries",function(data){
        // console.log(data);
        countryData = data;
        var x = document.getElementById("countrycode");
        for(var i=0 ;i<count_countries;i++){
            var option = document.createElement("option");
            option.text = countryData['data'][i]['countryName'];
            x.add(option);
        }
    });
}

function countryValidator(){
    var e = document.getElementById("countrycode");
    // console.log(e);
    var strUser = e.options[e.selectedIndex].text;
    // console.log(e.options[e.selectedIndex]);
    var i=e.selectedIndex-1;
    //console.log(strUser);
    console.log(countryData['data'][i]['countryCode']);
    console.log(countryData['data'][i]['countryID']);
    countrycode=countryData['data'][i]['countryCode'];
    countryid=countryData['data'][i]['countryID'];
    
}

function getCountries1()
{
    $.get("http://54.254.174.74:8080/api/v1/countries",function(data){
        // console.log(data);
        countryData1 = data;
        var x = document.getElementById("countrycode1");
        for(var i=0 ;i<count_countries;i++){
            var option = document.createElement("option");
            option.text = countryData1['data'][i]['countryName'];
            x.add(option);
        }
    });
}

function countryValidator1(){
    var e = document.getElementById("countrycode1");
    // console.log(e);
    var strUser = e.options[e.selectedIndex].text;
    // console.log(e.options[e.selectedIndex]);
    var i=e.selectedIndex-1;
    //console.log(strUser);
    console.log(countryData1['data'][i]['countryCode']);
    console.log(countryData1['data'][i]['countryID']);
    countrycode1=countryData1['data'][i]['countryCode'];
    countryid1=countryData1['data'][i]['countryID'];  

}

async function issuerRegister(){

    var email=$("#email").val().replace(/<|>/g, "");
    var designation=$("#designation").val().replace(/<|>/g, "");
    var countryId=countryid;
    var countryCode=countrycode;
    console.log(countryId+countryCode);
    var name=$("#issuername").val().replace(/<|>/g, "");
    console.log(name);
    var type=$("#type").val().replace(/<|>/g, "");
    var role=$("#role").val().replace(/<|>/g, "");
    vals={email:email,designation:designation,countryId:countryId,countryCode:countryCode,name:name,type:type,role:role,dappid:dappid};
    console.log(JSON.stringify(vals));
    arg=preprocessing(vals);

    var params={
        args:arg,
        type: 1009,
        fee:"0",
        secret:secret
      };
      console.log(JSON.stringify(params));

    const issueResponse = await addIssuer(params);
    console.log(issueResponse);

    if(issueResponse.success===true){
        getIssuers();
        document.getElementById('close').click();
        timeRefresh(11000);
    }
    else{
        alert(JSON.stringify(issueResponse.success));
    }

};

async function authorizerRegister(){

      var email1=$("#email1").val().replace(/<|>/g, "");
      var designation1=$("#designation1").val().replace(/<|>/g, "");
      var countryId1=countryid1;
      var countryCode1=countryid1;
      var name1=$("#name1").val().replace(/<|>/g, "");
      var type1=$("#type1").val().replace(/<|>/g, "");
      var role1=$("#role1").val().replace(/<|>/g, "");

  vals1={email:email1,designation:designation1,countryId:countryId1,countryCode:countryCode1,name:name1,type:type1,role:role1,dappid:dappid};
  // alert(JSON.stringify(vals1));

  arg1=preprocessing(vals1);

  var params1={
      args:arg1,
      type: 1009,
      fee:"0",
      secret:secret
    };

    const AuthorizeResponse = await addAuthorizer(params1);

    if(AuthorizeResponse.success===true){
        getAuthorizers();
        document.getElementById('close1').click();
        timeRefresh(11000);
    }
    else{
        alert(JSON.stringify(AuthorizeResponse.success));
     }
 };

 // Transaction call for issuer
async function addIssuer(params){
  let result;
  try{
      result = await $.ajax({
          url: HOST_URL+"/"+dappid+"/"+"transactions/unsigned",
          type: 'put',
          data: JSON.stringify(params),
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

// Transaction call for authorizer
async function addAuthorizer(params1){
let result;
  try{
        result = await $.ajax({
        url: HOST_URL+"/"+dappid+"/"+"transactions/unsigned",
        type: 'put',
        data: JSON.stringify(params1),
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

// preproceesing getting value pairs
  function preprocessing(obj){
      var s = "[";
      for(i in obj){
        s += "\"" + obj[i] + "\"" + ",";
      }
      s = s.substring(0,s.length - 1);
      s += "]";
      return s;
    }

function timeRefresh(timeoutPeriod) {
  setTimeout("location.href = 'superadmin-issuers.html'", timeoutPeriod);
}

function escapeInput(input) {
  return String(input)
          .replace(/&/g, '&amp;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
}