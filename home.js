async function findEmp(){
    var email;
        email=escapeInput($("#email").val());
        console.log(email);
        localStorage.setItem("email",email);
        param={
            email:email
        }
        const data = await home(param);
        console.log(data);
      //  alert(data);
        if(data==="0" || data==="00")
        {
            window.location.href="login.html";
        }
        else if(data==="-1")
        {  
            window.location.href="register.html";
        }
        else
        {
            console.log("Invalid exist code");
        }
}

async function home(params){
        let result;
        try{
            result = await $.ajax({
                url: HOST_URL+"/"+SDAPP_ID+"/"+"user/exists",
                type: 'post',
                data:JSON.stringify(params),
                contentType: 'application/json;charset=UTF-8',
                dataType: 'json'
            });
                return result;
            }
        catch (error){
            console.log(error);
            if((error["status"] === 401) && (error["responseJSON"]["status"]==="UNAUTHORIZED")){
                alert("error" + error["responseJSON"]["message"]);
            }
            else{
                alert("error" + error["responseJSON"]["message"]);
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