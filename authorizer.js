//var secret="cactus peasant return inside filter morning wasp floor museum nature iron can";
var pid1;
var clickedpid=undefined;
var dappid=localStorage.getItem("dappid");
var aid=localStorage.getItem("authid");
var role=localStorage.getItem("roleId");
var company=localStorage.getItem("companyname");
var email=localStorage.getItem("email");
var belriumtoken=localStorage.getItem("belToken");
var dappid=localStorage.getItem("dappid");
var bel=localStorage.getItem("bel");

async function authorizer(){
  var params={
    aid:aid
  }
    const res1 = await pendingSigns(params);
    console.log(res1.isSuccess);
    if(res1.isSuccess===true){
      var n=res1.result;
      len=n.length;
      var i;
      console.log("hai")
      document.getElementById('pending').innerHTML="";
     for(i=0;i<len;i++){
      var myDate = new Date( Number(n[i].timestampp));
      var time = myDate.toGMTString()
       add_issuedemployee(n[i].pid,n[i].email,n[i].iid,time); 
      
    }
  }
}
function add_issuedemployee(pid,emp,iid,time){
   add_div='<a><tr> <td onclick="displaydata('+pid+')">'+pid+'</td><td>'+emp+'</td> <td>'+iid+'</td><td>'+time+'</td>  <td class="table_viewbtn"> <input type="submit" name="signin" class="sign_btn btn-success" value="Sign" data-toggle="modal" data-target="#popup1" onclick="takedata('+pid+')"></input> <input type="submit" name="signin" class="sign_btn btn-danger" data-toggle="modal" data-target="#popup2" value="Reject" onclick="takedata('+pid+')"></input> </td></tr>'
   document.getElementById('pending').innerHTML+=add_div;

 }
function takedata(pid){
  clickedpid=pid;
}

async function pendingSigns(param){
    let result;
      try{
            result = await $.ajax({
            url: HOST_URL+"/"+dappid+"/"+"authorizers/pendingSigns",
            type: 'post',
            data:JSON.stringify(param),
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
async function sign(){
  const res1 = await authorize(clickedpid);
  console.log(JSON.stringify(res1));
 // alert(JSON.stringify(res1));
 if(res1.isSuccess===true){
   document.getElementById('tagclose1').click();
 }
 setTimeout(authorizer(),2000);
}

 async function authorize(pid){
   const secret=document.getElementById("passphrase1").value;
   console.log(secret);
   console.log(pid);
      let result;
        try{
              result = await $.ajax({
              url: HOST_URL+"/"+dappid+"/"+"authorizer/authorize",
              type: 'post',
              data:'{"aid":"'+aid+'","pid":"'+pid+'","secret":"'+secret+'"}',
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

      async function reject(){
        const res1=await rejectpayslip(clickedpid);
        console.log(res1);
       // alert(JSON.stringify(res1));
        setTimeout(authorizer(),2000);
      }

      async function rejectpayslip(pid){
        console.log(pid);
       // console.log(pid1);
        var data={
          pid:pid.toString(),
          aid:"1",
          message:"invalid"
        }
       console.log( JSON.stringify(data));
           let result;
             try{
                   result = await $.ajax({
                    url: HOST_URL+"/"+dappid+"/"+"authorizer/reject",
                    type: 'post',
                    data:JSON.stringify(data),
                    contentType: 'application/json;charset=UTF-8',
                    dataType: 'json'
                    });
                   console.log(result);
                   return result;

               }
               catch (error){
                 if(error){
                   console.log(error);
               }
             }
           }
      
async function authorizedAssets(){
  const res1=await authorizedPayslips();
  console.log(JSON.stringify(res1));
  if(res1.isSuccess===true){
    var n=res1.result;
    len=n.length;
    var i;
    document.getElementById('payslips').innerHTML="";
    console.log("hai")
   for(i=0;i<len;i++){
    var myDate = new Date( Number(n[i].timestampp));
    var time = myDate.toGMTString()   
    add_authorizedemployee(n[i].pid,n[i].email,n[i].iid,time);   
  }
}
}

function hideshow(){
            
  var phrase = document.getElementById('passphrase1');

   if(phrase.type === "password"){
    phrase.type = "text";}
  else{phrase.type = "password"}
  
  
}

function add_authorizedemployee(pid,emp,iid,time){
  console.log(pid);
add_div='<tr><td><div class="custom-control custom-checkbox"><input type="checkbox" class="custom-control-input" id="opt2" name="opt2"><label class="custom-control-label" for="opt2"></label> </div> </td><td>'+pid+'</td> <td>'+emp+'</td><td>'+iid+'</td> <td>'+time+'</td> </tr>'
console.log(add_div);
document.getElementById('payslips').innerHTML+=add_div;
}
async function authorizedPayslips(){
           let result;
             try{
                   result = await $.ajax({
                   url: HOST_URL+"/"+dappid+"/"+"authorizer/authorizedAssets",
                   type: 'post',
                   data:'{"aid":"'+aid+'"}',
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


async function displaydata(pid){
  console.log(pid);
  pid1=pid;
            const res1=await getPayslipData(pid);
            console.log(res1);
            parent = document.getElementById('testing_list');
            parent.childNodes[2].remove()
           //document.getElementById('testing').innerHTML="";
            create();
            console.log(res1.result.name);
            paycycle=res1.result.month+","+res1.result.year;
            allowances=Number(res1.result.hra)+Number(res1.result.lta)+Number(res1.result.ma);
            totaldeductions=Number(res1.result.professionalTax)+Number(res1.result.providentFund);
            earnings=allowances+Number(res1.result.basicPay);
            net=earnings-totaldeductions;
            document.getElementById("ps_empname").value=res1.result.name;
            document.getElementById("ps_pay").value=res1.result.basicPay;
            document.getElementById("ps_designation").value=res1.result.designation;
            document.getElementById("ps_idnum").value=res1.result.empid;
           document.getElementById("ps_paycycle").value=paycycle;
            document.getElementById("ps_bankdetails").value=res1.result.bank;
            document.getElementById("basic").textContent=res1.result.basicPay;
            document.getElementById("allowances").textContent=allowances;
            document.getElementById("earnings").textContent=earnings;
            document.getElementById("pt").textContent=res1.result.professionalTax;
            document.getElementById("pf").textContent=res1.result.providentFund;
            document.getElementById("total").textContent=totaldeductions;
            document.getElementById("netsalary").textContent=net;
            const value=inWords(net).toUpperCase();
            console.log(value);
            document.getElementById("words").textContent=value;
           document.getElementById('open').click();
            

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

async function getPayslipData(pid){
           let result;
             try{
                   result = await $.ajax({
                   url: HOST_URL+"/"+dappid+"/"+"payslip/getPayslip",
                   type: 'post',
                   data:'{"pid":"'+pid+'"}',
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

        function create(){
            var newItem = document.createElement("LI");
            newItem.setAttribute('class','nav_item');
            newItem.setAttribute('role','presentation');
            newItem.innerHTML+='<a id="open" href="#issue_new_certificate" aria-controls="issue_new_certificate" role="tab" data-toggle="tab" class="nav-link">AUTHORIZE PAYSLIP</a>';
          
            var list = document.getElementById("testing_list");
            list.insertBefore(newItem, list.childNodes[2]);

      // console.log("hi");
      //       add_tab='<li </li>';
      //       document.getElementById('testing').innerHTML+=add_tab;
          }
function signhere(){
  console.log("sdfghjkl");
  console.log(pid1);
sign(pid1);
}

function authorizerDashboard(){
  document.getElementById("username").innerText=email;
  document.getElementById("balance").innerText=(bel+" "+"BEL");
  document.getElementById("company").innerText=company;
}