$(function () {
    $.ajax({
        type: 'POST',
        url: IP + "/api-assessmen/medicalExamination/getByPatientAndDate",
        dataType: 'json',
        data: {
            "token": myLocal.getItem('token'),
            "patientId": myLocal.getItem('userInfo').id,
        },
        success: function(data) {
            console.log(data)
            if (data.code == '20000') {
                myLocal.setItem('results', data.result)
            } else {
                myLocal.setItem('results', '');
            }
        },
        error: function(err) {
            console.log(err)
        },
    });
})
