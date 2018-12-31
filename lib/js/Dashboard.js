$(document).ready(function(){
    var count=0;
    $("#registeremp").click(function()
    {
        window.location.href="../EmployeeRegistration/EmployeeRegistration.html";
    });
    var month,year;
    $("#getdate").click(function(){  
    var str=$("#MonthYear").val();
        var str1=str.split('-');
        month=str1[0];
        year=str1[1];
        if(count===0)
        {
        $.post("http://54.251.138.1:9305/api/dapps/8d2ad02c847eb9aaab012bb27e8f681639e93291f837596f40458f2cecedb591/payslip/pendingIssues",
        {month:month,year:year},
        function(data)
        {   
            var employee_data='';
            var i = 0;
            
            $.each(data,function(key,value){
                
                employee_data += '<tr>';
    
                employee_data += "<td id = 'empid" + i + "'>"+value.empID+"</td>";
    
                employee_data += '<td>'+value.name+'</td>';
    
                employee_data += '<td>'+value.designation+'</td>';
    
                employee_data += '<td> <button id="issue" >ISSUE</button> </td>';
    
                employee_data += '</tr>';
    
             });
    
            $('#employee_table').append(employee_data);
            count++;
        });
    }

        $("div").delegate("table tbody tr td:nth-child(4)", "click", function(){
            var $name = $(this).closest("tr"),$tds = $name.find("td:nth-child(1)");            
                       $.each($tds, function() {
                          var x = $(this).text();
                          var querystring="?"+x+"="+month+"="+year;
                          window.location.href="../Issue/Issue.html"+querystring;
                      });
                    });
                });

    $("#show").click(function(){
        var str=$("#MonthYear").val();
        var str1=str.split('-');
        month=str1[0];
        year=str1[1];
        var empid=$("#search").val();
        var emp={
            empid : empid,
            month : month,
            year : year
        }
    });
});