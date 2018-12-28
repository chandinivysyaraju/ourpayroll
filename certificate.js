var dappid ="48a7d6bd571d8a636bfc7d64781e03e4dc80df75c99ca98788c63697f9a2d56a";
var HOST_URL="http://18.188.23.5:9305/api/dapps";

//Interface call for adding all employees in the table registered by issuer for particular a month and year
var month,year,offset=0,limit=10,count=0;

function getEmployees()
{
var str=escapeInput($("#getDate").val());
var str1=str.split('-');
month=str1[0];
year=str1[1];

if(count===0)
{
$.post(HOST_URL+"/"+dappid+"/"+"payslip/month/status",
{month:month,year:year,limit:limit,offset:offset},
function(data)
{   
var data = data.result;
var employee_data='';

$.each(data,function(key,value){
    employee_data += '<tr>';
    employee_data += '<td>'+key+'</td>';
    employee_data += '<td>'+value.name+'</td>';
    employee_data += '<td>'+value.designation+'</td>';
    employee_data += '<td> <button  onclick="getStatus('+'\''+value.status+'\''+',\''+key+'\''+')">'+value.status+'</button> </td>';
    employee_data += '</tr>';
    });

$('#example').append(employee_data);
count++;
    });
  }
}

async function getStatus(status, empid){
    list = document.getElementById('testing_list');
    console.log(status);
    if(status === 'Pending' &&  list.childElementCount<3){
        li = document.createElement('li');
        li.setAttribute('role','presentation');
        li.setAttribute('class','nav_item');
        li.innerHTML +='<a href="#issue_new_certificate" aria-controls="issue_new_certificate" role="tab" data-toggle="tab" class="nav-link">ISSUE NEW CERTIFICATE</a>';
        list = document.getElementById('testing_list');
        list.insertBefore(li,list.childNodes[2]);
    }
    console.log('{"empid":"'+empid+'"}');
    const employee = await $.ajax({
        url: HOST_URL+"/"+dappid+"/employeeData",
        type: 'post',
        data: '{"empid":"'+empid+'"}',
        contentType: 'application/json;charset=UTF-8',
        dataType: 'json'
    });
    console.log(employee);
    fillDetails(employee);

}

function escapeInput(input) {
    return String(input)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
 }