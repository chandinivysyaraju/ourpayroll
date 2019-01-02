"use strict";
//document function
$(document)
 .ajaxStart(function () {
    $.blockUI({ message: '<i  class="fa fa-circle-o-notch fa-spin" style="font-size:150px; color: #00bfff"></i>',css: {backgroundColor: 'transparent', border: '0'} });
 })
 .ajaxStop(function () {
    setTimeout(function(){$.unblockUI()},3000);
 }); // end of document function

var str;
var role=localStorage.getItem("roleId");
var company=localStorage.getItem("companyname");
var email=localStorage.getItem("email");
var belriumtoken=localStorage.getItem("belToken");
var dappid=localStorage.getItem("dappid");
var bel=localStorage.getItem("bel");
var token;
var email;
var fileName;
var fileObj;
var reqMetaFormArr=[];
var bkvsdm_token=localStorage.getItem("bkvsdm_token");
token=localStorage.getItem("belToken");
var countryCode="";
var invocation = new XMLHttpRequest();
var kycDoc1uploadedAt;
var kycDoc1uploadStatus= false;
var kycDoc1paymentStatus;
var kycDoc1verificationStatus;
var kycDoc1documentStatus;
var kycDoc2uploadedAt;
var kycDoc2uploadStatus= false;
var kycDoc2paymentStatus;
var kycDoc2verificationStatus;
var kycDoc2documentStatus;
var doc1MetaType;
var doc2MetaType;
var uploadKycDocumentTypeId ;
var uploadKycDocumenMetaId ;
var kycUserDocumentIdSel;
var kycUserDocumentID1;
var kycUserDocumentID2;
var publicKey; 
var GpassPhrase;
var metaData={ };

// load function
function load()
{
    if((role==="superuser")||(role==="new user")){
        var list = document.getElementById('heading_list');
       list.childNodes[5].remove();
       list.childNodes[1].remove();
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
       document.getElementById("name").innerText=email;
       document.getElementById("company").innerText=company;
       document.getElementById("balance").innerText=(bel+" "+"BEL");
       fetchKYCDoucment();
} // end of load function
   
//fetchKYCDocument function
function fetchKYCDoucment()
{
    $.ajax({
        type: 'get',
        url: SWAGGERIP+'/users/document',
        headers: {"belrium-token" : token},
        success: function (data) {
                console.log("KYC document fetched Successful" + JSON.stringify(data));                
                // console.log("data" +  JSON.stringify(data.data.countries[0].kycDocumentTypes[0].kycDocumentMetas[0].kycUserDocument.documentStatus));
                generateTable(data);
        },
        error: function (error)
        {
            console.log("error" + error);
            if(error){
                if((error["status"] === 401) && (error["responseJSON"]["status"]==="UNAUTHORIZED")){
                    //alert(error["responseJSON"]["message"]);
                    $('#errormsg').text(error["responseJSON"]["message"]);
                    $('#ErrorModal').modal('show');
                }
                else{
                    // console.log("KYC document fecthing Failed"+ JSON.stringify(error));   
                    //alert(error["responseJSON"]["message"]);
                    $('#errormsg').text(error["responseJSON"]["message"]);
                    $('#ErrorModal').modal('show');
             }
            }
        }
    });
} // end of fetchKYCDocument function

// addRowToTable function
function addRowToTable(d1, d2, d3, d4, d5, isMandatory)
{
    let kycUserDocument = d5;
    let uploadAt="";
    let uploadStatus=false;
    let paymentStatus;
    let verificationStatus;
    let documentStatus;
    let kycUserDocumentID;
  
    if(kycUserDocument){
        documentStatus = kycUserDocument.documentStatus;
        kycUserDocumentID = kycUserDocument.kycUserDocumentID;
        uploadAt= new Date(kycUserDocument.uploadedAt).toLocaleString();
        uploadStatus=true;

        if(kycUserDocument.paymentTransaction){
           paymentStatus= kycUserDocument.paymentTransaction.transactionStatus;
        }

        if(kycUserDocument.verificationTransaction){
            verificationStatus= kycUserDocument.verificationTransaction.transactionStatus;
         }
    }
  var tbl = document.getElementById('tblKycDoc');
  var lastRow = tbl.rows.length;
  var iteration = lastRow;
  var row = tbl.insertRow(lastRow);
  var el = document.createElement('span');
  el.id = 'txtRow' + iteration;
 if(documentStatus == 'Pending'){
  el.className ="pending";
} else if(documentStatus == 'Approved'){
    el.className ="approved";
}else if(documentStatus == 'Denied'){
    el.className ="denied";
}else if(documentStatus == 'Expired'){
    el.className ="expired"; 
}

 var textPending = document.createTextNode(documentStatus);
 el.appendChild(textPending);

 var btnUpload = document.createElement('button');
 btnUpload.name = 'btnupload' + iteration;
 btnUpload.id = 'btnuload' + iteration;
 btnUpload.text = 'Upload';
 
 if(!(documentStatus =='Denied' || documentStatus =='Expired'  || documentStatus=='Approved') && (paymentStatus =='CONFIRMED') && (verificationStatus=='CONFIRMED')){

  btnUpload.disabled = true;
  btnUpload.classList="btn btn-default kyc-disabled-btn";  
}else{
    btnUpload.disabled = false;  
    btnUpload.classList="btn btn-default kyc-enabled-btn";
}   

btnUpload.onclick = function(){openUploadModal(d1, d3);}
var btnUploadText = document.createTextNode("Upload");       // Create a text node
 btnUpload.appendChild(btnUploadText);                 

//payment button creation 
 var btnPayment = document.createElement('button');

 btnPayment.name = 'btnPayment' + iteration;
 btnPayment.id = 'btnPayment' + iteration;
 btnPayment.text = 'Payment';
 btnPayment.classList="btn btn-default kyc-enabled-btn";

    if(!uploadStatus || paymentStatus=='CONFIRMED') {
        btnPayment.disabled =true;
    }
    else{
        btnPayment.disabled =false;
    }

 btnPayment.onclick=function(){openPaymentModal(kycUserDocumentID);}
 var btnPaymentText = document.createTextNode("Payment");       // Create a text node
 btnPayment.appendChild(btnPaymentText);           

 //payment button creation

 // verification button 

 var btnVerified = document.createElement('button');
 btnVerified.name = 'btnVerified' + iteration;
 btnVerified.id = 'btnVerified' + iteration;
 btnVerified.text = 'Get Verified';
 btnVerified.classList="btn btn-default kyc-enabled-btn";

 if(!uploadStatus ||paymentStatus !='CONFIRMED' || verificationStatus == 'CONFIRMED' || documentStatus=='Expired') {
    btnVerified.disabled = true;
 }
 else{
    btnVerified.disabled = false;
 }
 btnVerified.onclick=function(){sendVerification(kycUserDocumentID);}
 var btnVerifiedText = document.createTextNode("Get Verified");       // Create a text node
 btnVerified.appendChild(btnVerifiedText);           

 //verification button
  var divl = document.createElement('div');
  divl.name = 'div' + iteration;
  divl.id = 'div' + iteration;
  divl.style ='display: block;height:55px;';
  var br = document.createElement("br");

  divl.appendChild(br);
  divl.appendChild(el);

  var divUploadStatus = document.createElement('div');
  divUploadStatus.name = 'divUploadStatus' + iteration;
  divUploadStatus.id = 'divUploadStatus' + iteration;
  

  var divUploadProgressBar = document.createElement('div');
  divUploadProgressBar.name = 'divUploadProgressBar' + iteration;
  divUploadProgressBar.id = 'divUploadProgressBar' + iteration;
  
  if(uploadStatus){
    divUploadStatus.className="dot-verified-circle";
    divUploadProgressBar.className="progress-bar";
  }else{
    divUploadStatus.className="dot-unverified-circle";
    divUploadProgressBar.className="progress-barr";
  }

  var divPaymentStatus = document.createElement('div');
  divPaymentStatus.name = 'divPaymentStatus' + iteration;
  divPaymentStatus.id = 'divPaymentStatus' + iteration;
 
  var divPaymentProgressBar = document.createElement('div');
  divPaymentProgressBar.name = 'divPaymentProgressBar' + iteration;
  divPaymentProgressBar.id = 'divPaymentProgressBar' + iteration;

if(paymentStatus){              
    if(documentStatus != 'Denied'){
       divPaymentStatus.className="dot-verified-circle";
       divPaymentProgressBar.className="progress-bar";
    }
    else{              
        divPaymentStatus.className="dot-unverified-circle";
        divPaymentProgressBar.className="progress-barr";
    }
  }
  else{    
      divPaymentStatus.className="dot-unverified-circle";
      divPaymentProgressBar.className="progress-barr";
  }
 
  var divVerifiedstStatus = document.createElement('div');
  divVerifiedstStatus.name = 'divVerifiedstStatus' + iteration;
  divVerifiedstStatus.id = 'divVerifiedstStatus' + iteration;
 

  var divVerifiedProgressBar = document.createElement('div');
  divVerifiedProgressBar.name = 'divVerifiedProgressBar' + iteration;
  divVerifiedProgressBar.id = 'divVerifiedProgressBar' + iteration;

  if(verificationStatus){              
    if(documentStatus != 'Denied'){
      divVerifiedstStatus.className="dot-verified-circle";
      divVerifiedProgressBar.className="progress-bar";
        }
        else{              
            divVerifiedstStatus.className="dot-unverified-circle";
            divVerifiedProgressBar.className="progress-barr";
        }
}
else{    
    divVerifiedstStatus.className="dot-unverified-circle";
    divVerifiedProgressBar.className="progress-barr";
}
  var tr = document.createElement('tr');   

  var td1 = document.createElement('td');
  var td2 = document.createElement('td');
  var td3 = document.createElement('td');
  var td4 = document.createElement('td');
  var td5 = document.createElement('td');
  var td6 = document.createElement('td');
  var td7 = document.createElement('td');
  var text1 = document.createTextNode(d2);
  var text2 = document.createTextNode(d4);
  var spanMandetoryText = document.createTextNode('*');
  var spanMandetory = document.createElement('span');
  
  var textUploadAt = document.createTextNode(uploadAt);
    tr.style="height:80px;width:100%";
    td1.appendChild(text1);
    td2.appendChild(text2);

    if(isMandatory){
        spanMandetory.className="mandatory";    
        spanMandetory.appendChild(spanMandetoryText);    
        td2.appendChild(spanMandetory);
    }
    td3.append(textUploadAt);

    if(documentStatus){
        td4.appendChild(divl);
    }

    td5.appendChild(btnUpload);
    td5.appendChild(divUploadStatus);
    td5.appendChild(divUploadProgressBar);
    td6.appendChild(btnPayment);
    td6.appendChild(divPaymentStatus);
    td6.appendChild(divPaymentProgressBar);
    td7.appendChild(btnVerified);
    td7.appendChild(divVerifiedstStatus);
    td7.appendChild(divVerifiedProgressBar);
    td1.classList="kyc-document semi-bold";
    td1.style="width:20%";
    td2.style="width:20%";
    td2.className="kyc-document";
    td3.className="kyc-document";
    td3.style="width:20%";
    td4.className="kyc-document";
    td4.style="width:20%";
    td5.className="v-align-middle";
    td5.style="width:10%";
    td6.className="v-align-middle";
    td6.style="width:10%";
    td7.style="width:10%";
    td7.className="v-align-middle";
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td6);
    tr.appendChild(td7);
    tbl.appendChild(tr);
 } //end of addRowToTable function

 //generateTable function
    function generateTable(data)
    {
        //console.log("data"+ data);
        //$("#countryName").text(data.data.countries[0].countryName);
        localStorage.setItem("countryCode",data.data.countries[0].countryCode);
        countryCode=localStorage.getItem("countryCode");
        if(data.data.countries[0]){
           $("#countryName").text(data.data.countries[0].countryName);
           let localKYCStatus = data.data.countries[0].status;
           let blockchainKYCStatus = data.data.countries[0].blockchainStatus;
        //    alert("enablekyc2" + localKYCStatus+ ":" + blockchainKYCStatus);
           if(((localKYCStatus=='ACTIVE' && blockchainKYCStatus=='ACTIVE') || localKYCStatus=='INACTIVE'))
           {
                // alert("enablekyc");
               $("#enableKyc").disabled= true;
           }
           else{
                // alert("enablekyc1");
               $("#enableKyc").disabled= false;
           }
       }
        for (var i = 0, l =  data.data.countries[0].kycDocumentTypes.length; i < l; i++) 
        {
            let jsData = data.data.countries[0].kycDocumentTypes[i];
            // console.log("data"+ JSON.stringify(jsData));
            // console.log("d1"+ JSON.stringify(jsData.kycDocumentTypeId));
            for (var j = 0, m =  data.data.countries[0].kycDocumentTypes[i].kycDocumentMetas.length; j < m; j++) 
            {
                let jsMetaData = data.data.countries[0].kycDocumentTypes[i].kycDocumentMetas[j];    
                let kycDocumentMetaId = jsMetaData.kycDocumentMetaId;
                let documentName = jsMetaData.documentName;
                let kycUserDocument = jsMetaData.kycUserDocument;
                let isMandatory= jsMetaData.isMandatory;
                // console.log("meta"+ kycDocumentMetaId + ":" + documentName);
                addRowToTable( jsData.kycDocumentTypeId,jsData.documentType,kycDocumentMetaId, documentName, kycUserDocument, isMandatory);
            }
        }
    } //end of generateTable function

    //callOtherDomain function
    function callOtherDomain(fileObj,kycDocumentMetaId,kycDocumentTypeId,metaData,cfunc)
    {
        var url = SWAGGERIP+'/kycuserdocuments/upload';
        // console.log(url);
        if(invocation)
        {
            // console.log("invocation");
            invocation.open('POST', url, true);
            invocation.setRequestHeader('belrium-token', token);
            invocation.setRequestHeader('bkvsdm-token', bkvsdm_token);
            invocation.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                //    console.log("success");
                   cfunc(invocation);
               }
               else{
                 cfunc(invocation);
               }
            };
            var myformData = new FormData();
            // var metaData={};
            myformData.append('file', fileObj,fileObj.name);
            myformData.append('kycDocumentMetaId',kycDocumentMetaId);
            myformData.append('kycDocumentTypeId',kycDocumentTypeId);
            myformData.append('countryCode',countryCode);
            myformData.append('metaData',metaData);
            var body = myformData;
            invocation.send(body);
        }
    }  // end of callOtherDomain function

    //kycUploadStatusfunction function
    function kycUploadStatusfunction(xhttp)
    {  
        let kycResponseData = JSON.parse(xhttp.responseText);
        // console.log(xhttp.responseText);
        if(kycResponseData.isSuccess){
            let kycUserDocumentID = kycResponseData.data.kycUserDocumentID;
            // console.log(kycUserDocumentID);
            //openPaymentModal(kycUserDocumentID);
            window.location.reload();
        }
    } // end of kycUploadStatusfunction function

    //UploadKyc function
    function UploadKyc(fileObj,kycDocumentMetaId,kycDocumentTypeId,metaData)
    {
        callOtherDomain(fileObj,kycDocumentMetaId,kycDocumentTypeId,metaData,kycUploadStatusfunction);
    } //end of UploadKyc function

    //openUploadModal function
    async function openUploadModal(documentTypeId, documentMetaId)
    {
        uploadKycDocumenMetaId = documentMetaId;
        uploadKycDocumentTypeId = documentTypeId;
        const form_res=await getMetaFormFields(documentMetaId,documentTypeId);
        console.log(form_res);
        if(form_res.isSuccess)
        {
            generateMetaForm(form_res);
        }
    } //end of openUploadModal function

//generateMetaForm function
function generateMetaForm(form_res)
{
    // console.log(form_res.data.formproperties[0]);
    var metaForm=document.getElementById("form-pop");
    while(metaForm.hasChildNodes())
    {
        metaForm.removeChild(metaForm.lastChild);
    }
    for (var i = 0, l =  form_res.data.formproperties.length; i < l; i++) {
        let formData=form_res.data.formproperties[i];
        let label=formData.label;
        let placeHolder=formData.placeholder;
        let inputType=formData.type;
        let validPattern=formData.jspattern;
        let required=formData.required;
        reqMetaFormArr.push(required);
        let Formlabel = document.createElement('label');
        let labelNode=document.createTextNode(label);
        Formlabel.appendChild(labelNode);
        let Forminput = document.createElement('input');
        Forminput.type = inputType;
        Forminput.id = 'FormInput' + i;
        Forminput.placeholder = placeHolder;
        Forminput.className="cls-div-date";
        Forminput.value="";
        let FormSpan = document.createElement('span');
        let spanNode=document.createTextNode("required");
        FormSpan.id="reqMsg"+i;
        FormSpan.className="mandatory";
        FormSpan.style.display="none";
        FormSpan.appendChild(spanNode);
        metaForm.appendChild(Formlabel);
        metaForm.appendChild(Forminput);
        metaForm.appendChild(FormSpan);
        Forminput.onblur = function(){validation();}
        Forminput.pattern=validPattern;
    }
    $('#myUploadModal').modal('show');
} //end of generateMetaForm function

//validation function
function validation()
{
    var isFormValid=false;
    if(reqMetaFormArr.length===0)
    {
        isFormValid=true;
    }
    for(var i=0;i<reqMetaFormArr.length;i++)
    {
        let data=document.getElementById('FormInput' + i).value;
        //metaData={"ExpirationDate": data};
        // console.log(data);
        if(reqMetaFormArr[i])
        {
            if(data.trim().length>0)
            {
                isFormValid=true;
                document.getElementById("reqMsg"+i).style.display="none";
                metaData={"ExpirationDate": data};
            }
            else
            {
                isFormValid=false;
                document.getElementById("reqMsg"+i).style.display="block";
            }
        }
        else
        {
            isFormValid=true;
            document.getElementById("reqMsg"+i).style.display="none";
            metaData={ };
        } 
    }
    if(isFormValid)
    {
        if(fileObj)
        {
            document.getElementById("uploadFile").disabled=false;
        }
    }
} //end of validation functiion

//uploadFile function
async function UploadFile()
{
    $("#myUploadModal").modal("hide");
    console.log("metaData"+JSON.stringify(metaData));
    UploadKyc(fileObj,uploadKycDocumenMetaId,uploadKycDocumentTypeId,JSON.stringify(metaData));
}//end of uploadFile function

//getMetaFormFields function
async function getMetaFormFields(documentMetaId,documentTypeId)
{
    let result;
    try{
        result=await $.ajax({
            type: 'get',
            url: SWAGGERIP+"/kycdocs/kycdocformfieldmetas?kycDocumentMetaId="+documentMetaId+"&kycDocumentTypeId="+documentTypeId+"&countryCode="+countryCode,
            headers: {"belrium-token" : token},
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
} // end of getMetaFormFields function

//openVerificationModal function
function openVerificationModal(docID){
    if(docID == 1){
        kycUserDocumentIdSel = kycUserDocumentID1;
    }
    else{
        kycUserDocumentIdSel = kycUserDocumentID2;
    }
    setTimeout(function() {sendVerification(kycUserDocumentIdSel)},20000);
} //end of openVerificationModal function

//openPaymentModal function
function openPaymentModal(docID){
    kycUserDocumentIdSel = docID;
    $('#myModal').modal('show');
} // end of openPaymentModal function


$('#myModal').on('shown.bs.modal',function()
{
    $('#myInput').trigger('focus');
});

//callPayment function
function callPayment(){
    var secret = $('#secret').val();
    if(kycUserDocumentIdSel)
    {
        getPublicKey(secret, kycUserDocumentIdSel);
    }
} // end of callPayment function

//kycPayment function
function kycPayment(kycUserDocumentID, secret) 
{
    $.blockUI({ message: '<i  class="fa fa-circle-o-notch fa-spin" style="font-size:150px; color: #00bfff"></i>',css: {backgroundColor: 'transparent', border: '0'} });
    setTimeout(function(){$.unblockUI()},12000);
    $.ajax({
        url: SWAGGERIP+'/kycuserdocuments/payment',
        type: 'put',
        headers: {"belrium-token": token},
        data: '{"kycUserDocumentID":"' + kycUserDocumentID +'","publicKey":"' + publicKey +'","secondSecret":"' + " " +'","secret":"' + secret +'","senderCountryCode":"' + countryCode +'"}',
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        success: function (data) {
            // console.log(data);
            var i=0;
            while(data.status==="confirmed" || i<3)
            {
                $.blockUI({ message: '<i  class="fa fa-circle-o-notch fa-spin" style="font-size:150px; color: #00bfff"></i>',css: {backgroundColor: 'transparent', border: '0'} });
                setTimeout(function(){$.unblockUI()},10000);
                i++;
                //window.location.reload();
            }
            if(data.status==="confirmed")
            {
                sendVerification(kycUserDocumentID);
                $('#errormsg').text("Payment Successful");
                $('#ErrorModal').modal('show');
                $('#myModal').modal('hide');
                window.location.reload();
            }
            else 
            {
                $('#errormsg').text("Try Again");
                $('#ErrorModal').modal('show');
                $('#myModal').modal('hide');
               // $.unblockUI();
                window.location.reload();
                // console.log(data);
            }
        },
        error: function (error)
        {   
            $('#errormsg').text(error);
            $('#ErrorModal').modal('show');
            $('#myModal').modal('hide');
            window.location.reload();
            console.log(error);
        }
});
}//end of kycPayment function

//sendVerification function
function sendVerification(kycUserDocumentID)
{
    $.ajax({
        url: SWAGGERIP+'/kycuserdocuments/send/verification?kycUserDocumentID='+kycUserDocumentID,
        type: 'post',
        headers: {"belrium-token": token,"bkvsdm-token": bkvsdm_token},
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        success: function (data) {
            window.location.reload();
            // console.log(data);
        },
        error: function (error)
        {   
            window.location.reload();
            console.log(error);
        }
});
}// end of sendVerification function

//getPublicKey function
function getPublicKey(passPhrase, kycUserDocumentID)
{
    $.post("https://node1.belrium.io/api/accounts/open",
      {secret:passPhrase,countryCode:countryCode},
      function(data){
        if(data.success===true)
        {
        //    console.log("Public key: " + data.account.publicKey);
           localStorage.setItem("publicKey",data.account.publicKey);
           localStorage.setItem("passPhrase",passPhrase);
           publicKey=data.account.publicKey;
           GpassPhrase=passPhrase;
           setTimeout(function() {kycPayment(kycUserDocumentID, passPhrase)},20000);
        }
        else
        {
            publicKey=" ";
            GpassPhrase=" ";
        }
        });
  } //end of getPublicKey function

async function enableKycgetPublicKey()
{
    var secret = $('#enableKycSecret').val();
    // alert(secret);
    $.post("https://node1.belrium.io/api/accounts/open",
      {secret:secret,countryCode:countryCode},
      function(data){
        if(data.success===true)
        {
        //    console.log("Public key: " + data.account.publicKey);
           publicKey=data.account.publicKey;
          doEnableKYC(publicKey,secret);
          //window.location.reload();
        //   $('#errormsg').text("Enabled KYC");
        //   $('#ErrorModal').modal('show');
        }
        });
  } //end of EnableKycgetPublicKey function

 async function doEnableKYC(publicKey,secret)
  {
    let result;
    var body={
        countryCode:countryCode,
        publicKey: publicKey,
        secondSecret: " ",
        secret: secret
    };
    try{
        result=await $.ajax({
            type: 'put',
            url: SWAGGERIP+"/transactions/enable/account",
            headers: {"belrium-token" : token},
            data:JSON.stringify(body),
            contentType: 'application/json;charset=UTF-8',
            dataType: 'json'});
            if(result)
            {
                setTimeout(function(){window.location.href="dashboard.html"},5000);
            }
            return result;
    }
    catch(error){
        if(error)
        {
            console.log(error);
            $('#errormsg').text(error["responseJSON"]["message"]);
            $('#ErrorModal').modal('show');
        }
    }
  }// end of doEnableKYC function

  //openEnableKycModal function
function openEnableKycModal(){
    // alert("open enable modal");
    $('#enableKycModal').modal('show');
} // end of openEnableKycModal function

//readURL function
function readURL(input) {
    fileObj=input.files[0];
    if (input.files && input.files[0]) {
        var reader = new FileReader();   
        reader.onload = function (e) {
        $('#blah').attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
        validation();
    }
} //end of readURL function
