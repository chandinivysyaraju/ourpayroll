var dappid ="48a7d6bd571d8a636bfc7d64781e03e4dc80df75c99ca98788c63697f9a2d56a";
var HOST_URL="http://18.188.23.5:9305/api/dapps";
var str;
var role=localStorage.getItem("roleId");
function model(){
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
//Interface call for adding all employees in the table registered by issuer for particular a month and year
var month,year,offset=0,limit=10,count=0;

function getEmployees()
{
str=escapeInput($("#getDate").val());
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


 async function fillDetails(emp){
    document.getElementById("email").value=emp.email;
    document.getElementById("employeeid").value=emp.empID;
    document.getElementById("name").value=emp.name;
    document.getElementById("designation").value=emp.designation;
    document.getElementById("bank").value=emp.bank;
    document.getElementById("accountnumber").value=emp.accountNumber;
    document.getElementById("pan").value=emp.pan;
    document.getElementById("salary").value=emp.salary;
    document.getElementById("date").value=str;
 }

 function generate(){
    var email,empid,name,designation,bank,accountnumber,pan,salary,lta,ma,hra,pf,pt;
    email=document.getElementById("email").value;
    empid=document.getElementById("employeeid").value;
    name=document.getElementById("name").value;
    designation=document.getElementById("designation").value;
    bank=document.getElementById("bank").value;
    accountnumber=  document.getElementById("accountnumber").value;
    pan= document.getElementById("pan").value;
    salary=document.getElementById("salary").value;
    lta=document.getElementById("lta").value;
    ma=document.getElementById("ma").value;
    hra=document.getElementById("hra").value;
    pf=document.getElementById("pf").value;
    pt=document.getElementById("pt").value;
              //paycycle=res1.month+","+res1.year;
              allowances=Number(hra)+Number(lta)+Number(ma);
              totaldeductions=Number(pt)+Number(pf);
              earnings=allowances+Number(salary);
              net=earnings-totaldeductions;
              document.getElementById("ps_empname").value=name;
              document.getElementById("ps_pay").value=salary;
              document.getElementById("ps_designation").value=designation;
              document.getElementById("ps_idnum").value=empid;
              document.getElementById("ps_paycycle").value=str;
              document.getElementById("ps_bankdetails").value=bank;
              document.getElementById("basic").textContent=salary;
              document.getElementById("allowances").textContent=allowances;
              document.getElementById("earnings").textContent=earnings;
              document.getElementById("pt").textContent=pt;
              document.getElementById("pf").textContent=pf;
              document.getElementById("total").textContent=totaldeductions;
              document.getElementById("netsalary").textContent=net;
              const value=inWords(net).toUpperCase();
              console.log(value);
              document.getElementById("words").textContent=value;
    }

    function inWords (num) {
        var a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
        var b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];
         if ((num = num.toString()).length > 9) return 'overflow';
         n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
         if (!n) return; var str = '';
         str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
         str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
         str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
         str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
         str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
         return str;
      }