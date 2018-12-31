var prevTextBoxText = '';
var countryData,countryCode;
const count_countries=253;
var registerData;

setInterval(function(){
  searchBoxText=document.getElementById('search').value;
  if(searchBoxText!= prevTextBoxText){
    prevTextBoxText = searchBoxText;
    find(searchBoxText);
  }
},1000);
function model(){
  var role=localStorage.getItem("roleId");
  if((role==="superuser")||(role==="new user")){
    var list = document.getElementById('heading_list');
   list.childNodes[5].remove();
   list.childNodes[1].remove();
   document.getElementById("reg").remove();
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
async function memberDashboard(){
  const res1 = await getEmployee();
  // console.log(res1);
  var n=res1.employees.length;
  var i;
  for(i=0;i<n;i++)
  add_employee(res1.employees[i].name,res1.employees[i].designation,res1.employees[i].empID);
  }

async function getEmployee(){
      let result;
        try{
              result = await $.ajax({
              url: HOST_URL+"/"+dappid+"/"+"employees",
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

function add_employee(emp_name,designation,emp_id){
      add_div = '<div class="col-xl-4 col-lg-6 col-md-6 col-12 " id='+emp_id+'><div class="col-xl-12 col-lg-12 col-md-12 col-12 member_views_details"><div class="col-xl-3 col-lg-3 col-md-3 col-12 nopadding"><a href=""><img class="propic" src="lib/img/profile.jpg" width="55"></a></div><div class="col-xl-6 col-lg-6 col-md-6 col-12 nopadding"><h6>'+emp_name+'</h6><p class="p1">'+designation+'</p><p class="p2">'+emp_id+'</p></div><div class="col-xl-3 col-lg-3 col-md-3 col-12 nopadding"><a href="#" class="member_edit"><img src="lib/img/edit.svg"></a></div></div></div>';
      document.getElementById('members_div').innerHTML+=add_div;
}

async function find(text){
document.getElementById('members_div').innerHTML="";
const res2 = await findEmployee(text);
//console.log(res2);
var n=res2.result.length;
console.log(n);
var i;
for(i=0;i<n;i++){
add_employee(res2.result[i].name,res2.result[i].designation,res2.result[i].empID);
console.log(res2.result[i].name+" "+res2.result[i].designation+" "+res2.result[i].empID);
}
}

async function findEmployee(text){
let result;
try{
    result = await $.ajax({
    url: HOST_URL+"/"+dappid+"/"+"searchEmployee",
    type: 'post',
    data:'{"text":"'+text+'","searchBy":"name","limit":10,"offset":0}',
    contentType: 'application/json;charset=UTF-8',
    dataType: 'json'
    });
    setTimeout(function(){},500);
    console.log(result)
    return result;
}
catch (error){
  if(error){
    console.log(error);
    }
  }
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
    countryCode = countryData['data'][i]['countryCode'];
    console.log(countryData['data'][i]['countryID']);
}

async function register(){
  registerData={
    countryCode:countryCode,
    email:document.getElementById("email").value,
    lastName:document.getElementById("lname").value,
    name:document.getElementById("fname").value,
    designation:document.getElementById("designation").value,
    bank:document.getElementById("rbank").value,
    accountNumber:document.getElementById("accnum").value,
    pan:document.getElementById("pannum").value,
    salary:document.getElementById("salary").value,
    dappid:dappid,
    token:token,
    groupName:groupName,
  };
console.log(registerData);
const res3 = await registerEmployee();
console.log(res3);
}

// function for registering new employee
async function registerEmployee(){
  let result;
  try{
      result = await $.ajax({
      url: HOST_URL+"/"+dappid+"/"+"registerEmployee",
      type: 'post',
      data:JSON.stringify(registerData),
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