var lastName,name,email,password,type,countrycode,countryid;
var countryData;
const count_countries=253;
$(document).ready(function(){
// var email = localStorage.getItem("Email");  
// document.getElementById("email").setAttribute("value",email);
    $("#register").click(async function(){
        //if(signupValidation()){
            console.log("hai");
        email=escapeInput($("#email").val());
        lastName=escapeInput($("#name").val());
        name=escapeInput($("#name").val());
        password=escapeInput($("#password").val());
        type=escapeInput($("#user-type").val());
        const signupResponse= await checkSignup();
        if(signupResponse["isSuccess"]==true){
            console.log(signupResponse);
            window.location.href="../Login/Login.html";

        }
        else{
            $("#message").html("signup failed");
        }
   // }
});
});
async function checkSignup()
{
    let result;
        try{
               result=await $.ajax({
                   type: 'post',
                   url: HOST_URL+"/"+SDAPP_ID+"/"+"user/signup",
                   data: '{"countryCode":"' + countrycode +'","countryId":"' + countryid +'","email":"' + email +'","lastName":"' + lastName +'","name":"' + name +'","password":"' + password +'","type":"' + type +'"}',
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

function getCountries()
{
    $.get("http://54.254.174.74:8080/api/v1/countries",function(data){
        // console.log(data);
        countryData = data;
        var x = document.getElementById("country_list");
        for(var i=0 ;i<count_countries;i++){
            var option = document.createElement("option");
            option.text = countryData['data'][i]['countryName'];
            x.add(option);
        }
    });
}

function countryValidator(){
    var e = document.getElementById("country_list");
    // console.log(e);
    var strUser = e.options[e.selectedIndex].text;
    // console.log(e.options[e.selectedIndex]);
    var i=e.selectedIndex;
    console.log(strUser);
    console.log(countryData['data'][i]['countryCode']);
    console.log(countryData['data'][i]['countryID']);
    countrycode=countryData['data'][i]['countryCode'];
    countryid=countryData['data'][i]['countryID']
}