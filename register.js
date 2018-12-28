var lastName,name,email,password,type,countryCode,countryId;
$(document).ready(function(){
var email = localStorage.getItem("Email");  
document.getElementById("email").setAttribute("value",email);
    $("#register").click(async function(){
        if(signupValidation()){
        countryCode=escapeInput($("#countryCode").val());
        countryId=escapeInput($("#countryId").val());
        email=escapeInput($("#email").val());
        lastName=escapeInput($("#name").val());
        name=escapeInput($("#name").val());
        password=escapeInput($("#password").val());
        type="merchant";
        const signupResponse= await checkSignup();
        if(signupResponse["isSuccess"]==true){
            console.log(signupResponse);
            window.location.href="../Login/Login.html";

        }
        else{
            $("#message").html("signup failed");
        }
    }
});
});
async function checkSignup()
{
    let result;
        try{
               result=await $.ajax({
                   type: 'post',
                   url: 'http://54.254.174.74:8080/api/v1/signup',
                   data: '{"countryCode":"' + countryCode +'","countryId":"' + countryId +'","email":"' + email +'","lastName":"' + lastName +'","name":"' + name +'","password":"' + password +'","type":"' + type +'"}',
                   contentType: 'application/json;charset=UTF-8',
                   dataType: 'json'
               });
               return result;
            }
            catch(error){
                if(error){
                        console.log(error);
                        if((error["status"] === 401) && (error["responseJSON"]["status"]==="UNAUTHORIZED")){
                            alert("error" + error["responseJSON"]["message"]);
                        }
                        else{
                            alert("error" + error["responseJSON"]["message"]);
                        }     
                      }
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