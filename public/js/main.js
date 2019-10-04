$(document).ready(function () {
    $(".deletePerson").on("click", deletePerson);
});

function deletePerson() {
    var confirmation = confirm("Are you want to delete person");
    if(confirmation) {
        $.ajax({
            'type': 'DELETE',
            'url': '/persons/delete/'+ $('.deletePerson').data('person_id')
        }).done(function (response) {
            window.location.replace('/');
        });
        window.location.replace('/');
    } else {
        return false;
    }
}