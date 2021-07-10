
var token = window.token
$('.quantity').change(function () {
    let value = $(this).val();
    var id = $(this).data('id')
    $.ajax({
        method: "POST",
        url: "/basket/api/quantity/" + id,
        data: {
            '_csrf': token,
            quantity: value
        },
        beforeSend: function () {
            load()
        }
    }).done(function (data) {
        
        data = JSON.parse(data)
        refresh(data, id)
        
        const count = document.getElementById("basket-count")
        count.children[0].innerHTML = data.count 
    }).fail(function( jqXHR, textStatus ) {
        refresh({
            total: 0,
            subtotal: 0,
            setupfee: 0,
            discount: 0,

        })
        alert( "Request failed: " + textStatus );

      })
})

$('.billing').change(function () {
    let value = $(this).val();
    var id = $(this).data('id')
    $.ajax({
        method: "POST",
        url: "/basket/api/billing/" + id,
        data: {
            '_csrf': token,
            billing: value
        },
        beforeSend: function () {
            load()
        }
    }).done(function (data) {
        
        try {
            data = JSON.parse(data)
            
        const count = document.getElementById("basket-count")
        count.children[0].innerHTML = data.count 
        if (data.empty) {

            var table = document.getElementsByTagName("tbody")[0];
            var row = table.insertRow(0);
            var cell1 = row.insertCell(0);
            cell1.innerHTML = "Basket empty";
            cell1.setAttribute('colspan', 4)

            if (count != null){
                count.remove();
            }
        }
        } catch (e){

        }
        refresh(data, id)
    }).fail(function( jqXHR, textStatus ) {
        refresh({
            total: 0,
            subtotal: 0,
            setupfee: 0,
            discount: 0,
        })
        alert( "Request failed: " + textStatus );

      })
})
$('.delete').click(function (e) {
    e.preventDefault()
    var id = $(this).data('id')
    $.ajax({
        method: "POST",
        url: "/basket/api/delete/" + id,
        data: {
            '_csrf': token,
            _method: 'DELETE'
        },
        beforeSend: function () {
            load()
        }
    }).done(function (data) {
        try {
            data = JSON.parse(data)
        deleteRow(id)

        refresh(data, id)
            
        const count = document.getElementById("basket-count")
        count.children[0].innerHTML = data.count 
        if (data.empty) {

            var table = document.getElementsByTagName("tbody")[0];
            var row = table.insertRow(0);
            var cell1 = row.insertCell(0);
            cell1.innerHTML = "Basket empty";
            cell1.setAttribute('colspan', 4)

            if (count != null){
                count.remove();
            }
        }
        } catch (e){

        }
    }).fail(function( jqXHR, textStatus ) {
        refresh({
            total: 0,
            subtotal: 0,
            setupfee: 0,
        })
        alert( "Request failed: " + textStatus );

      })
})
function deleteRow(id) {
    $('.row-' + id).remove()
}
function refresh(data, id) {
    $(".billing").removeAttr("disabled")
    $(".quantity").removeAttr("disabled")

    refreshTable('#price', data.total)
    refreshTable('#setupfee', data.setupfee)
    refreshTable('#discount', data.discount)
    refreshTable('#subtotal', data.subtotal)
    if (id != undefined) {
        refreshTable('#price-' + id, data.unit_price)
        $('#quantity-' + id).val(data.new_quantity)
    }
    token = data.token
}
function load() {
    $(".billing").attr("disabled", true)
    $(".quantity").attr("disabled", true)

    $('#price').html('<spinning-dots style="color: #535FF6;"></spinning-dots>')
    $('#subtotal').html('<spinning-dots style="color: #535FF6;"></spinning-dots>')
    $('#setupfee').html('<spinning-dots style="color: #535FF6;"></spinning-dots>')
    $('#discount').html('<spinning-dots style="color: #535FF6;"></spinning-dots>')
}

function refreshTable(id, value){

    $(id).text(new Intl.NumberFormat('fr-FR').format(value) + " " + window.CLIENTXCMSCurrency)
}
