var belriumtoken="f00eef6b-f8c6-4c47-ae1a-647363b8ad831545379936918";
async function issueDashboard(){

    const res1 = await totalCertsIssued();
    //console.log(res1);
    $("#totalCerts").text(res1.totalCertificates);

    const res2 = await getPendingAuthorizationCount();
    //console.log(res2);
    $("#pendingAuth").text(res2.totalUnauthorizedCertificates);

    const res3 = await totalEmployee();
    //console.log(res3);
    $("#totalEmployee").text(res3.totalEmployee);

    // const res4 = await getAddress();
    // //console.log(res4);
    // var address=res4.data.countries[0].wallets[0].address;
    // $("#address").text(address);

    // const res5 = await getBalance(address);
    // //console.log(res5);
    // var balance=JSON.parse(res5.data).balance;
    // var bel=balance/1000000000;
    // localStorage.setItem("bel",bel);
    // $("#balance").text(bel+" "+"BEL");
    // $("#balance1").text(bel+" "+"BEL");

    const res6 = await recentIssued();
    //console.log(JSON.stringify(res6));
    var n=res6.length;
    var i;
    for(i=0;i<n;i++){
        add_issuedemployee(res6[i].name,res6[i].empid);
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
            url:'http://54.254.174.74:8080/api/v1/wallets',
            type: 'get',
            headers:
            {
                'belrium-token':belriumtoken
            },
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
            url: "http://54.254.174.74:8080/api/v1/balance?address="+address,
            type: 'get',
            headers:
            {
            'belrium-token':belriumtoken
            },
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