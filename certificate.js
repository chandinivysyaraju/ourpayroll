//var dappid ="48a7d6bd571d8a636bfc7d64781e03e4dc80df75c99ca98788c63697f9a2d56a";
//var HOST_URL="http://18.188.23.5:9305/api/dapps";
//var iid= localStorage.getItem("issuerid");
var countryData,countryCode;
const count_countries=253;
var registerData;
var str;
var role=localStorage.getItem("roleId");
var company=localStorage.getItem("companyname");
var email=localStorage.getItem("email");
var belriumtoken=localStorage.getItem("belToken");
var dappid=localStorage.getItem("dappid");
var bel=localStorage.getItem("bel");
const iid = localStorage.getItem('issuerid');
var pid ="";
var selectedEmpid ='';
var prev_pid = undefined;
const calssButtons={'Pending':"btn-danger",'Authorized':'btn-primary','Issued':'btn-success','Initiated':'btn-warning'};

function model(){
    if((role==="superuser")||(role==="new user")){
        var list = document.getElementById('heading_list');
       list.childNodes[5].remove();
       list.childNodes[1].remove();
       document.getElementById("reg").remove();
       document.getElementById("reg1").remove();
       var list1 = document.getElementById('testing_list');
      list1.childNodes[5].remove();
     //  document.getElementById("issuedcerts").remove();
    //   document.getElementById('removeThis').remove();
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
           var list1 = document.getElementById('testing_list');
           list1.childNodes[5].remove();
       }
       if(role!="new user"){
        document.getElementById("company").innerText=company;
       }
       document.getElementById("username").innerText=email;
       document.getElementById("balance").innerText=(bel+" "+"BEL");
    }
var employeeCertificate;
var prev='';
let page_issuedCertificates = 1;

//Interface call for adding all employees in the table registered by issuer for particular a month and year
var month,year,offset=0,limit=10,count=0;

function getEmployees()
{
    console.log("called");
str=escapeInput($("#MonthYear").val());
if(str == ''){
    return ;
}
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
console.log(data);
var disabled='';
$.each(data,function(key,value){
    var target='';
    var func = '';
    if(role==='superuser' || role ==='authorizer'){
        disabled='disabled';
    }
    if(value.status == 'Initiated'){
        target =' data-toggle="modal" data-target="#popup" ';
    }
    if(value.status == 'Authorized'){
        target =' data-toggle="modal" data-target="#popup1" ';
        if(value.iid != iid){
            disabled ='disabled';
        }else{
            disabled ='';
        }
        func=",setPid("+value.pid+","+key+")";
        console.log(data);
    }
    if(value.status=='Issued'){
        target =' data-toggle="modal" data-target="#popup2" ';
        
    }
    employee_data += '<tr>';
    employee_data += '<td>'+key+'</td>';
    employee_data += '<td>'+value.name+'</td>';
    employee_data += '<td>'+value.designation+'</td>';
    employee_data += '<td> <button '+target+' '+disabled+' onclick="getStatus('+'\''+value.status+'\''+',\''+key+'\''+')'+func+' " id='+key+'status class ="'+calssButtons[value.status]+'" >'+value.status+' </button> </td>';
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
        li.innerHTML +='<a href="#issue_new_certificate" aria-controls="issue_new_certificate" role="tab" data-toggle="tab" id ="tabclick"class="nav-link">ISSUE NEW CERTIFICATE</a>';
        list = document.getElementById('testing_list');
        list.insertBefore(li,list.childNodes[2]);
    }
    if(status ==='Pending'){
    console.log('{"empid":"'+empid+'"}');
    const employee = await $.ajax({
        url: HOST_URL+"/"+dappid+"/employeeData",
        type: 'post',
        data: '{"empid":"'+empid+'"}',
        contentType: 'application/json;charset=UTF-8',
        dataType: 'json'
    });
    employeeCertificate = employee;
    console.log(employee);
    document.getElementById('tabclick').click();
    fillDetails(employee);
    }
}

function escapeInput(input) {
    return String(input)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
 }
function setPid(p,e){
    pid = p;
    selectedEmpid=e;
}

 async function fillDetails(emp){
    
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
    try{
        earnings=allowances+Number(salary);
        net=earnings-totaldeductions;
    }
    catch{
        console.log('error');
    }
    document.getElementById("ps1_empname").value=name;
    document.getElementById("ps_pay").value=salary;
    document.getElementById("ps_designation").value=designation;
    document.getElementById("ps_idnum").value=empid;
    document.getElementById("ps_paycycle").value=str;
    document.getElementById("ps_bankdetails").value=bank;
    document.getElementById("basic").textContent=salary;
    document.getElementById("allowances").textContent=allowances;
    try{
    document.getElementById("earnings").textContent=earnings;}
    catch{
        console.log('error');
    }
    document.getElementById("ps_pt").textContent=pt;
    document.getElementById("ps_pf").textContent=pf;
    document.getElementById("total").textContent=totaldeductions;
    document.getElementById("netsalary").textContent=net;
    const value=inWords(net).toUpperCase() ;
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

function hideshow(){
            
    var phrase = document.getElementById('passphrase');

     if(phrase.type === "password"){
      phrase.type = "text";}
    else{phrase.type = "password"}
    
    
}
// async function issueCertificate(){

// employeeCertificate['basicPay']= employeeCertificate['salary'];
// delete employeeCertificate['salary'];
// employeeCertificate['hra']=document.getElementById("hra").value;
// employeeCertificate['lta']=document.getElementById("lta").value;
// employeeCertificate['ma']=document.getElementById("ma").value;
// employeeCertificate['providentFund']=document.getElementById("pf").value;
// employeeCertificate['providentTax']=document.getElementById("pt").value;

// employeeCertificate['grossSalary']=document.getElementById("earnings").innerText;
// employeeCertificate['totalDeductions']=document.getElementById("total").innerText;
// employeeCertificate['netSalary']=document.getElementById("netsalary").innerText;
// employeeCertificate['issuerid']='1';
// employeeCertificate['secret']=document.getElementById("passphrase").value;
// var date = document.getElementById("MonthYear").value;
// date = date.split('-');
// employeeCertificate['month']= date[0];
// employeeCertificate['year'] = date[1];
// delete employeeCertificate['success'];
// delete employeeCertificate['walletAddress'];
// console.log(employeeCertificate);
// var result = await $.ajax({
//     url: HOST_URL+"/"+dappid+"/payslip/initialIssue",
//     type: 'post',
//     data: JSON.stringify(employeeCertificate),
//     contentType: 'application/json;charset=UTF-8',
//     dataType: 'json'
// });
// if(result.isSuccess=== true){
//     console.log('Suceess baby!!');
//     employeeCertificate='';
// }
// else{
//     alert("konda");
// }
// }
setInterval(function(){
var date = document.getElementById('MonthYear').value;
if(prev!= date){
    getEmployees();
    prev=date;
}
},2000);


async function getissuedCertificates(){
    const next_page = ((page_issuedCertificates-1)*5).toString();
    const issuedCerts = await $.ajax({
        url: HOST_URL+"/"+dappid+"/issuer/issuedPayslips",
        type: 'post',
        data: '{"iid":'+iid+' ,"limit":5, "offset":'+next_page+'}',
        contentType: 'application/json;charset=UTF-8',
        dataType: 'json'
    });
    if(issuedCerts.isSuccess === undefined){
       alert('Connection error');
        return;
    }
    if(issuedCerts.isSuccess === false){
        alert('Invalid Issuer');
        return;
    }
    console.log('Success');
    document.getElementById('issuedBlock').innerHTML='';
    for(var i = 0 ; i <= issuedCerts.result.length;i++){
    let division = '<div class="col-12 member_views_details " onclick="getIssuedDetails(\''+issuedCerts.result[i].pid+'\')" id="prev'+issuedCerts.result[i].pid+'"><div class="col-xl-3 col-lg-3 col-md-3 col-12 nopadding"><img class="propic" src="lib/img/profile.jpg" width="55"></div><div class="col-xl-9 col-lg-9 col-md-9 col-12 nopadding"><h6>'+issuedCerts.result[i].name+'</h6><p class="p1">'+issuedCerts.result[i].designation+'</p><p class="p2">'+issuedCerts.result[i].empid+'</p><h6>Pay Slip Certificate</h6><p class="p4">ISSUED <span>on  '+Date(issuedCerts.result[i].timestampp)+'</span></p></div></div>';
        document.getElementById('issuedBlock').innerHTML+=division;
    }
}

async function getIssuedDetails(pid){
    console.log(pid);
    if(prev_pid != undefined){
        console.log('i am here');
        document.getElementById('prev'+prev_pid).classList='col-12 member_views_details';
    }
    prev_pid=pid;
    document.getElementById('prev'+pid).classList='col-12 member_views_details active';
    const payslipDetails = await $.ajax({
        url: HOST_URL+"/"+dappid+"/payslip/getPayslip",
        type: 'post',
        data: '{"pid":'+pid+'}',
        contentType: 'application/json;charset=UTF-8',
        dataType: 'json'
    });
    if(payslipDetails.isSuccess===undefined){
        alert("Connection Error");
        return;
    }
    if(payslipDetails.isSuccess===false){
        alert('Invalid Payslip');
        return;
    }
    console.log('Success');
    console.log(payslipDetails);
    document.getElementById('issued_empname').value=payslipDetails.result['name'];
    document.getElementById('issued_pay').value=payslipDetails.result['basicPay'];
    document.getElementById('issued_designation').value=payslipDetails.result['designation'];
    document.getElementById('issued_idnum').value=payslipDetails.result['empid'];
    document.getElementById('issued_paycycle').value=payslipDetails.result['month']+' '+payslipDetails.result['year'];
    document.getElementById('issued_bankdetails').value=payslipDetails.result['bank'];
    document.getElementById('issuedBasic').innerText=payslipDetails.result['basicPay'];
    let allowances = Number(payslipDetails.result['hra'])+ Number(payslipDetails.result['lta']) + Number(payslipDetails.result['ma']);
    document.getElementById('issuedAllowances').innerText=(allowances).toString();
    document.getElementById('issuedEarnings').innerText = (Number(payslipDetails.result['basicPay'])+allowances).toString();
    document.getElementById('issuedPT').innerText=payslipDetails.result['professionalTax'];
    document.getElementById('issuedPF').innerText=payslipDetails.result['providentFund'];
    document.getElementById('issuedNetSalary').innerText=payslipDetails.result['netSalary'];
    document.getElementById('issuedSalaryWords').innerText=inWords(Number(payslipDetails.result['netSalary']));
    document.getElementById('issuedTotal').innerText=( Number(payslipDetails.result['providentFund']) + Number(payslipDetails.result['professionalTax']) ).toString();

}


async function initialIssue(){
    var issuedetails = {};
    issuedetails["empid"] = document.getElementById('employeeid').value;
    issuedetails["name"] = document.getElementById('name').value
    issuedetails["employer"] = '1';
    monthyear = (document.getElementById('MonthYear').value).split('-');
    issuedetails["month"] = monthyear[0]
    issuedetails["year"] = monthyear[1]
    issuedetails["designation"] = document.getElementById('designation').value
    issuedetails["bank"] = document.getElementById('bank').value
    issuedetails["accountNumber"] = document.getElementById('accountnumber').value
    issuedetails["pan"] = document.getElementById('pan').value
    issuedetails["basicPay"] = document.getElementById('salary').value
    issuedetails["hra"] = document.getElementById('hra').value
    issuedetails["lta"] = document.getElementById('lta').value
    issuedetails["ma"] = document.getElementById('ma').value
    issuedetails["providentFund"] = document.getElementById('pf').value
    issuedetails["professionalTax"] = document.getElementById('pt').value
    issuedetails["grossSalary"] = document.getElementById('earnings').innerText
    issuedetails["totalDeductions"] = document.getElementById('total').innerText
    issuedetails["netSalary"] = document.getElementById('netsalary').innerText
    issuedetails["issuerid"] = '1'
    issuedetails["secret"] = document.getElementById('passphrase').value
    const result =await $.ajax({
        url: HOST_URL+"/"+dappid+"/payslip/initialIssue",
        type: 'post',
        data: JSON.stringify(issuedetails),
        contentType: 'application/json;charset=UTF-8',
        dataType: 'json'
    });
    console.log(result);
    if(result.isSuccess === undefined){
        alert("Connection Error");
        document.getElementById('tagclose').click();
        return;
    }
    if(!result.isSuccess){
        alert("EmployeeId : "+issuedetails['empid']+' is not issued');
        return;
    }
    console.log("IT was a success");
    document.getElementById(issuedetails["empid"]+'status').innerText = "Initiated";
    document.getElementById(issuedetails["empid"]+'status').setAttribute('data-target','#popup');
    document.getElementById(issuedetails["empid"]+'status').setAttribute('data-toggle','modal');
    document.getElementById(issuedetails["empid"]+'status').setAttribute('onclick','');
    document.getElementById(issuedetails["empid"]+'status').setAttribute('class',calssButtons['Initiated']);

    document.getElementById('tagclose').click();
}

//Register new employee functions

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
    designation:document.getElementById("designation1").value,
    bank:document.getElementById("rbank").value,
    accountNumber:document.getElementById("accnum").value,
    pan:document.getElementById("pannum").value,
    salary:document.getElementById("salary1").value,
    dappid:dappid,
    token:"",
    groupName:"Dapps",
  };
console.log(registerData);
const res3 = await registerEmployee();
console.log(res3);
if(res3.isSuccess===true){
    console.log("hai this is gudla")
  document.getElementById("close").click();
}
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

async function finalIssue(){
    var payslip ={
        "pid": pid,
        "fee": "0",
        "iid": iid,
        "secret": document.getElementById('passphrase1').value,
        "dappid": dappid
    };
    let result;
    console.log(payslip);
  try{
        result = await $.ajax({
        url: HOST_URL+"/"+dappid+"/issueTransactionCall",
        type: 'post',
        data: JSON.stringify(payslip),
        contentType: 'application/json;charset=UTF-8',
        dataType: 'json'
        });
        console.log(result);
        if(result.isSuccess == false){
            alert("Failed to issue");
            return;
        }
        if(result.transactionId != undefined){
        document.getElementById(selectedEmpid+"status").value='Issued';
        document.getElementById(selectedEmpid+'status').setAttribute('id','#popup2');
        }
    }
    catch (error){
      if(error){
        console.log(error);
    }
  }

}

