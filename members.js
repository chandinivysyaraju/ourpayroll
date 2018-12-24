async function issueDashboard(){
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
      add_div = '<div class="col-xl-4 col-lg-6 col-md-6 col-12 " id='+emp_id+' ><div class="col-xl-12 col-lg-12 col-md-12 col-12 member_views_details"><div class="col-xl-3 col-lg-3 col-md-3 col-12 nopadding"><a href=""><img class="propic" src="lib/img/profile.jpg" width="55"></a></div><div class="col-xl-6 col-lg-6 col-md-6 col-12 nopadding"><h6>'+emp_name+'</h6><p class="p1">'+designation+'</p><p class="p2">'+emp_id+'</p></div><div class="col-xl-3 col-lg-3 col-md-3 col-12 nopadding"><a href="#" class="member_edit"><img src="lib/img/edit.svg"></a></div></div></div>';
      document.getElementById('members_div').innerHTML+=add_div;
}

async function find(){
document.getElementById('members_div').innerHTML="";
const res2 = await findEmployee();
//console.log(res2);
var n=res2.length;
var i;
for(i=0;i<n;i++)
add_employee(res2[i].name,res2[i].designation,res2[i].empID);
}

async function findEmployee(){
let result;
var text=$("#search").val();
try{
    result = await $.ajax({
    url: HOST_URL+"/"+dappid+"/"+"searchEmployee",
    type: 'post',
    data:'{"text":"'+text+'"}',
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