var calculate_button = document.getElementById('calculate');

function calculateTip(){
    var amount = document.getElementById('bill_amount').value;
    var tip_percentage = document.getElementById('service_selector').value;
    var number_of_people = document.getElementById('number_of_people').value;
    var tip_per_person = document.getElementById('tip_result');
    if(amount=="" || amount<="0"){
        tip_per_person.innerText = "Invalid amount";
        alert("Invalid amount");
        document.getElementById("result_display").style.display = "block";
        return;
    }
    if(number_of_people=="" || number_of_people<="0"){
        tip_per_person.innerText = "Invalid input in number of people";
        return;
    }
    tip_per_person.innerText = ((amount*tip_percentage) / (number_of_people*100)).toFixed(2);
    document.getElementById("result_display").style.display = "block";
}

calculate_button.addEventListener('click', calculateTip);

document.getElementById('result_display').style.display = "none";