var token,secret,email,password,dappid;
$(document).ready(function(){
    var email=localStorage.getItem("email");
console.log(email);
a=document.getElementById("emailid");
a.value=email;
//a.disabled="true";
    $("#login").click(async function(){
    // console.log(email,password);
    const loginResponse = await checkLogin();
    console.log(loginResponse);
    if(loginResponse["isSuccess"]===true)
    {
         console.log(loginResponse);
         console.log(loginResponse.data.token);
        token=loginResponse.data.token;
        localStorage.setItem("belToken",token);
        hyperLedgerLogin(token);
    }
 else
 {
    $("#message").text("Username or Password is incorrect");
 }
    });//endo of login onclick
});//end of document ready

//check login function
    async function checkLogin()
    {
        email=escapeInput($("#emailid").val());
        password=escapeInput($("#Password").val());
        console.log(email+password);
        var totp="";
        // if(loginValidation())
        // {
        let result;
        try {
            result = await $.ajax({
            type: 'post',
            url:  HOST_URL+"/"+SDAPP_ID+"/"+"user/login",
            data: '{"email":"' + email +'","password":"' + password +'","totp":"' + totp +'"}',
            contentType: 'application/json;charset=UTF-8',
            dataType: 'json'
            });
            return result;
            }
        catch (error) {
            if(error){
                console.log(error);
              if((error["status"] === 401) && (error["responseJSON"]["status"]==="UNAUTHORIZED")){
                  alert("error" + error["responseJSON"]["message"]);
              }else{
                  alert("error" + error["responseJSON"]["message"]);
              }
            }
            }
       //  }      
    }  //end of check login function
    
//hyperLedgerLogin function
   async function hyperLedgerLogin(token)
    {   
        $("#secret").click(async function()
        {
            var secret=escapeInput($("#secretkey").val());
             console.log("secret is : "+secret);
            localStorage.setItem("secret",secret);
            const hllogin= await checkHyperLogin(secret,token);
            console.log(hllogin);
            var k=JSON.parse(hllogin.data);
            if(hllogin["isSuccess"]===true)
                    {
                        localStorage.setItem("bkvsdm_token",k.token);
                        CheckKYCStatus(token);
                     }
                         else
                     {
                         console.log(hllogin.message);
                     }
        });
} //end of hyperLedgerLogin function
    
//checkHyperLogin function
    async function checkHyperLogin(secret,token)
    {
        let result;
        try{
            result=await $.ajax({
                type: 'post',
                url: HOST_URL+"/"+SDAPP_ID+"/"+"user/hllogin",
                data: '{"secret":"' + secret +'","token":"' + token +'"}',
                contentType: 'application/json;charset=UTF-8',
                dataType: 'json'});
                return result;
        }
        catch(error){
            if(error)
            {
                console.log(error);
            }
        }
    }// end of checkHyperLogin function

    async function getRole()
    {
        const data=await checkRole();
        console.log(JSON.stringify(data));
        var roleid=data.role;
         dappid=data.dappid;
        localStorage.setItem("roleId",roleid);
            if((roleid==="new user")||(roleid==="superuser")||(roleid==="issuer")||(roleid==="authorizer"))
            {
                localStorage.setItem("dappid",dappid)
                console.log(roleid);
                if(roleid==="authorizer"){
                    const res=await getauthid();
                    console.log(res);

                }
                if(roleid==="authorizer"){
                    const res=await getissuerid();
                    console.log(res);

                }
               window.location.href="dashboard.html";
            }
          
            else
            {
                console.log("Invalid user role identified...");
            }
}

    async function checkRole()
    {
        let result;
        try{
        result = await $.ajax({
                type: 'post',
                url: HOST_URL+"/"+SDAPP_ID+"/"+"user/dappid",
                data: '{"email":"' + email +'"}',
                contentType: 'application/json;charset=UTF-8',
                dataType: 'json'});
                return result;
        }
        catch(error)
        {
            console.log(error);
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
            var obj=result.data[0].kycstatus;
            if(true){
                getRole(email);
            }
            else{
                window.location.href="../KycUpload/KycUpload.html";
            }
        }
        catch(error)
        {
            console.log(error);
        }
    }


   async function getauthid(){
        let result;
        try{
        result = await $.ajax({
                type: 'post',
                url: HOST_URL+"/"+dappid+"/"+"authorizers/getId",
                data: '{"email":"' + email +'"}',
                contentType: 'application/json;charset=UTF-8',
                dataType: 'json'});
                return result;
        }
        catch(error)
        {
            console.log(error);
        }
        
    }
   async function getissuerid(){
        let result;
        try{
        result = await $.ajax({
                type: 'post',
                url: HOST_URL+"/"+dappid+"/"+"issuers/getId",
                data: '{"email":"' + email +'"}',
                contentType: 'application/json;charset=UTF-8',
                dataType: 'json'});
                return result;
        }
        catch(error)
        {
            console.log(error);
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

