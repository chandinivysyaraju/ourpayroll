var dappid ="48a7d6bd571d8a636bfc7d64781e03e4dc80df75c99ca98788c63697f9a2d56a";
var HOST_URL="http://18.188.23.5:9305/api/dapps";

// Interface call for adding all issuers in the table
var count=0;
function getIssuers(){
    if(count===0)
    {
    $.post(HOST_URL+"/"+dappid+"/"+"issuers",
    function(data)
    {
      var issuer_data='';
      var data = data.issuers; 
        $.each(data,function(key,value){

          var myDate = new Date( Number(value.timestamp));
          var timestamp = myDate.toGMTString();
            
            issuer_data += '<tr>';

            issuer_data += '<td>'+value.iid+'</td>';

            issuer_data += '<td>'+value.email+'</td>';

            issuer_data += '<td>'+value.designation+'</td>';

            issuer_data += '<td>'+timestamp+'</td>';

            issuer_data += '<td> <button type="button" class="btn btn-danger">REMOVE</button> </td>';

            issuer_data += '</tr>';

         });

        $('#example').append(issuer_data);
        count++;
        remove_info();
    });
}

// getting issuer id from the table
$("#example").delegate("tbody tr td:nth-child(5)", "click", function(){
      var $name = $(this).closest("tr"),$tds = $name.find("td:nth-child(1)");            
      $.each($tds, function() {
      var x = $(this).text();
      var res = window.confirm("Do you want remove issuer with id : "+x);
      if(res===true){
        removeIssuer(x);
      }
      
          });
 });
}

// Interface call for adding all authorizers in the table
function getAuthorizers(){
if(count===0)
  {
    $.post(HOST_URL+"/"+dappid+"/"+"authorizers",
    function(data)
    {   
      var authorizer_data='';
      var data = data.authorizer;
        
        $.each(data,function(key,value){

          var myDate = new Date( Number(value.timestamp));
          var timestamp = myDate.toGMTString();
            
          authorizer_data += '<tr>';

          authorizer_data += '<td>'+value.aid+'</td>';

          authorizer_data += '<td>'+value.email+'</td>';

          authorizer_data += '<td>'+value.designation+'</td>';

          authorizer_data += '<td>'+timestamp+'</td>';

          authorizer_data += '<td> <button type="button" class="btn btn-danger" >REMOVE</button> </td>';

          authorizer_data += '</tr>';

         });

        $('#example1').append(authorizer_data);
        count++;
        remove_info();
    });
  }

// getting authorizer id from the table
$("#example1").delegate("tbody tr td:nth-child(5)", "click", function(){
    var $name = $(this).closest("tr"),$tds = $name.find("td:nth-child(1)");            
    $.each($tds, function() {
    var y = $(this).text();
    var res = window.confirm("Do you want remove authorizer with id : "+y);
    if(res===true){
      removeAuthorizer(y);
    }
  });
});
}

// removing issuer from the table
async function removeIssuer(x){
let result;
var inputs = {iid:x};
try{
result = await $.ajax({
    url: HOST_URL+"/"+dappid+"/"+"issuers/remove",
    type: 'post',
    data: JSON.stringify(inputs),
    contentType: 'application/json;charset=UTF-8',
    dataType: 'json'
});
if(result===true){
  getIssuers();
  timeRefresh(7000);
}
else{
  alert("unable to remove issuer");
}
}
catch (error){
if(error){
    console.log(error);
}
}
}

// removing authorizer from the table
async function removeAuthorizer(y){
let result;
var inputs = {aid:y};
try{
  result = await $.ajax({
      url: HOST_URL+"/"+dappid+"/"+"authorizers/remove",
      type: 'post',
      data: JSON.stringify(inputs),
      contentType: 'application/json;charset=UTF-8',
      dataType: 'json'
  });
  if(result===true){
    getAuthorizers();
    timeRefresh(7000);
  }
  else{
    alert("unable to remove authorizer");
  }
}
catch (error){
  if(error){
      console.log(error);
  }
}
}

function timeRefresh(timeoutPeriod) {
    setTimeout("location.href = 'superadmin-issuers.html'", timeoutPeriod);
  }

function remove_info()
{
    entries=document.getElementById('example_info');
    entries.innerText="";
    entries=document.getElementById('example1_info');
    entries.innerText="";
}