var count = 0;

function onBrand () {
    count += 1;
    if (count == 10) {
        count = 0;
        $('#myModal').modal('show');
    }
}