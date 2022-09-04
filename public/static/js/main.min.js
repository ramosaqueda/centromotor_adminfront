'use strict';

var $ = window.jQuery;
$(function () {
    $("#banner").owlCarousel({
        animateOut: 'slideOutDown',
        animateIn: 'flipInX',
        loop: true,
        nav: true,
        navigation: true,
        slideSpeed: 500,
        paginationSpeed: 400,
        items: 1,
        itemsDesktop: false,
        itemsDesktopSmall: false,
        itemsTablet: false,
        itemsMobile: false,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true
    });
    $(document).on('click', '[data-toggle="lightbox"]', function (event) {
        event.preventDefault();
        $(this).ekkoLightbox();
    });
});

var App = {};
App.initialize = function () {
    App.filterTable();
    $('#client-login').on('submit', App.login);
    $('#clientRegister').on('submit', App.register);
    $('#input-quantity').on('change', App.quantity);
    $('.quantity').on('change', App.quantityUpdate);
    $('#branch_office_stock').on('change', App.stock);
    $('.file-input').on('change', App.showFileInput);
};
App.login = function (event) {
    event.preventDefault();
    var form = event.target;
    fetch(form.action, {
        method: form.method,
        body: new FormData(form)
    }).then(function (response) {
        if (response.ok) {
            return response.json();
        } else {
            throw "Error en la llamada Ajax";
        }
    }).then(function (result) {
        bootbox.alert(result.message, function () {
            if (result.state) {
                location.reload();
            }
        });
    }).catch(function (err) {
        console.error(err);
    });
};
App.stock = function (event) {
    fetch('/stocks/product/' + event.target.value + '/' + event.target.dataset.product).then(function (response) {
        return response.json();
    }).then(function (data) {
        var input_stock = $('#input-quantity');
        var form_sale = $('.form-sale button');
        var form_shopping_cart = $('.form-shopping-cart button');
        var quantity = $('.quantity');
        input_stock.val(1);
        quantity.val(1);
        $('#quantity-stock-product').html(data.stock);

        input_stock.on('change', function () {
            if (parseInt(input_stock.val(), 10) <= parseInt(data.stock, 10)) {
                active();
            } else {
                bootbox.alert('Excede el maximo de productos disponible en esta sucursal', function () {
                    input_stock.val(data.stock);
                    quantity.val(data.stock);
                });
                deactivate();
            }
        });

        if (data.stock > 0) {
            active();
            input_stock.removeAttr('disabled');
        } else {
            deactivate();
            input_stock.attr('disabled', 'true');
        }
        function active() {
            input_stock.attr('max', data.stock);
            form_sale.removeAttr('disabled');
            form_shopping_cart.removeAttr('disabled');
        }
        function deactivate() {
            input_stock.removeAttr('max');
            form_sale.attr('disabled', 'true');
            form_shopping_cart.attr('disabled', 'true');
        }
    });
};
App.quantity = function (event) {
    var value_quantity = parseInt(event.target.value, 10);
    if (value_quantity <= 0) {
        value_quantity = 1;
        event.target.value = 1;
    }
    $('.quantity').val(value_quantity);
};
App.quantityUpdate = function () {
    event.preventDefault();
    var input_quantity = event.target;
    var quantity = parseInt(input_quantity.value, 10);
    var product_id = parseInt(input_quantity.dataset.id, 10);
    if (quantity <= 0) {
        quantity = 1;
        input_quantity.value = 1;
    }
    var data = new FormData();
    data.append('product_id', product_id);
    data.append('quantity', quantity);
    fetch('/shopping-cart/update', {
        method: 'post',
        body: data
    }).then(function (response) {
        if (response.ok) {
            return response.json();
        } else {
            throw "Error en la llamada Ajax";
        }
    }).then(function (result) {
        console.log(result);
        var total = document.getElementById('PriceTotal');
        total.innerText = '$' + result.total.toLocaleString('es-CL');
    }).catch(function (err) {
        console.error(err);
    });
};
App.register = function () {
    event.preventDefault();
    var form = event.target;
    fetch(form.action, {
        method: form.method,
        body: new FormData(form)
    }).then(function (response) {
        if (response.ok) {
            return response.json();
        } else {
            throw "Error en la llamada Ajax";
        }
    }).then(function (result) {
        bootbox.alert(result.message, function () {
            if (result.state) {
                location.reload();
            }
        });
    }).catch(function (err) {
        console.error(err);
    });
};
App.filterTable = function () {
    $('.table-filter').DataTable({
        "language": {
            "lengthMenu": "Mostrar _MENU_ registros por página",
            "zeroRecords": "No existen registros",
            "info": "Mostrando la página _PAGE_ de _PAGES_",
            "infoEmpty": "No hay registros disponibles",
            "search": "Buscar:",
            "infoFiltered": "(con filtro de _MAX_ registros en total)",
            "paginate": {
                "first": "Primero",
                "last": "Último",
                "next": "Siguiente",
                "previous": "Anterior"
            }
        }
    });
};
App.showFileInput = function (event) {
    event.preventDefault();
    var inputFile = event.target;
    var filename = inputFile.files[0].name;
    var fileSize = inputFile.files[0].size;
    var allowed_extensions = ['.gif', '.png', '.jpg', '.doc', '.pdf', '.dwg'];
    var extension = filename.substring(filename.lastIndexOf('.')).toLowerCase();
    var allowed = allowed_extensions.includes(extension);
    if (fileSize > 2097152) {
        bootbox.alert('El tamaño del archivo no debe superar los 2M');
        inputFile.value = '';
    } else if (!allowed) {
        inputFile.value = '';
        bootbox.alert('El formato no es correcto');
    } else {
        inputFile.value = '';
        inputFile.dataset.before = filename;
        //$('input.file-input:before').css('content: ',filename);
        //window.getComputedStyle(inputFile,':before').getPropertyValue('content: ',filename);
        //let pseudoContent = window.getComputedStyle(inputFile,':before');
        //let result = pseudoContent.style;
        //console.log(result);
        //document.body.innerHTML += "Pseudo-element content: " + pseudoContent;
    }
    /*let file = this;
    let str = file.files[0].name;
    let fileSize = file.files[0].size;
    let allowed_extensions = [".gif",".png",".jpg",".doc",".pdf",".dwg"];
    let extension = (str.substring(str.lastIndexOf("."))).toLowerCase();
    let allowed = allowed_extensions.includes(extension);
    if(fileSize > 2097152) {
        bootbox.alert('El tamaño del archivo no debe superar los 2M');
        $(file).val('');
    } else if(!allowed){
        bootbox.alert('El formato no es correcto');
    }else{
        document.styleSheets[0].addRule('input.file-input:before','content: "'+str+'";');
    }*/
};
if (document.addEventListener) {
    window.addEventListener('load', App.initialize, false);
} else {
    window.attachEvent('onload', App.initialize);
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLm1pbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciAkID0gd2luZG93LmpRdWVyeTtcbiQoZnVuY3Rpb24gKCkge1xuICAgICQoXCIjYmFubmVyXCIpLm93bENhcm91c2VsKHtcbiAgICAgICAgYW5pbWF0ZU91dDogJ3NsaWRlT3V0RG93bicsXG4gICAgICAgIGFuaW1hdGVJbjogJ2ZsaXBJblgnLFxuICAgICAgICBsb29wOiB0cnVlLFxuICAgICAgICBuYXY6IHRydWUsXG4gICAgICAgIG5hdmlnYXRpb246IHRydWUsXG4gICAgICAgIHNsaWRlU3BlZWQ6IDUwMCxcbiAgICAgICAgcGFnaW5hdGlvblNwZWVkOiA0MDAsXG4gICAgICAgIGl0ZW1zOiAxLFxuICAgICAgICBpdGVtc0Rlc2t0b3A6IGZhbHNlLFxuICAgICAgICBpdGVtc0Rlc2t0b3BTbWFsbDogZmFsc2UsXG4gICAgICAgIGl0ZW1zVGFibGV0OiBmYWxzZSxcbiAgICAgICAgaXRlbXNNb2JpbGU6IGZhbHNlLFxuICAgICAgICBhdXRvcGxheTogdHJ1ZSxcbiAgICAgICAgYXV0b3BsYXlUaW1lb3V0OiA1MDAwLFxuICAgICAgICBhdXRvcGxheUhvdmVyUGF1c2U6IHRydWVcbiAgICB9KTtcbiAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnW2RhdGEtdG9nZ2xlPVwibGlnaHRib3hcIl0nLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgJCh0aGlzKS5la2tvTGlnaHRib3goKTtcbiAgICB9KTtcbn0pO1xuXG52YXIgQXBwID0ge307XG5BcHAuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBBcHAuZmlsdGVyVGFibGUoKTtcbiAgICAkKCcjY2xpZW50LWxvZ2luJykub24oJ3N1Ym1pdCcsIEFwcC5sb2dpbik7XG4gICAgJCgnI2NsaWVudFJlZ2lzdGVyJykub24oJ3N1Ym1pdCcsIEFwcC5yZWdpc3Rlcik7XG4gICAgJCgnI2lucHV0LXF1YW50aXR5Jykub24oJ2NoYW5nZScsIEFwcC5xdWFudGl0eSk7XG4gICAgJCgnLnF1YW50aXR5Jykub24oJ2NoYW5nZScsIEFwcC5xdWFudGl0eVVwZGF0ZSk7XG4gICAgJCgnI2JyYW5jaF9vZmZpY2Vfc3RvY2snKS5vbignY2hhbmdlJywgQXBwLnN0b2NrKTtcbiAgICAkKCcuZmlsZS1pbnB1dCcpLm9uKCdjaGFuZ2UnLCBBcHAuc2hvd0ZpbGVJbnB1dCk7XG59O1xuQXBwLmxvZ2luID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB2YXIgZm9ybSA9IGV2ZW50LnRhcmdldDtcbiAgICBmZXRjaChmb3JtLmFjdGlvbiwge1xuICAgICAgICBtZXRob2Q6IGZvcm0ubWV0aG9kLFxuICAgICAgICBib2R5OiBuZXcgRm9ybURhdGEoZm9ybSlcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICBpZiAocmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBcIkVycm9yIGVuIGxhIGxsYW1hZGEgQWpheFwiO1xuICAgICAgICB9XG4gICAgfSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGJvb3Rib3guYWxlcnQocmVzdWx0Lm1lc3NhZ2UsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChyZXN1bHQuc3RhdGUpIHtcbiAgICAgICAgICAgICAgICBsb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgfSk7XG59O1xuQXBwLnN0b2NrID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgZmV0Y2goJy9zdG9ja3MvcHJvZHVjdC8nICsgZXZlbnQudGFyZ2V0LnZhbHVlICsgJy8nICsgZXZlbnQudGFyZ2V0LmRhdGFzZXQucHJvZHVjdCkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHZhciBpbnB1dF9zdG9jayA9ICQoJyNpbnB1dC1xdWFudGl0eScpO1xuICAgICAgICB2YXIgZm9ybV9zYWxlID0gJCgnLmZvcm0tc2FsZSBidXR0b24nKTtcbiAgICAgICAgdmFyIGZvcm1fc2hvcHBpbmdfY2FydCA9ICQoJy5mb3JtLXNob3BwaW5nLWNhcnQgYnV0dG9uJyk7XG4gICAgICAgIHZhciBxdWFudGl0eSA9ICQoJy5xdWFudGl0eScpO1xuICAgICAgICBpbnB1dF9zdG9jay52YWwoMSk7XG4gICAgICAgIHF1YW50aXR5LnZhbCgxKTtcbiAgICAgICAgJCgnI3F1YW50aXR5LXN0b2NrLXByb2R1Y3QnKS5odG1sKGRhdGEuc3RvY2spO1xuXG4gICAgICAgIGlucHV0X3N0b2NrLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAocGFyc2VJbnQoaW5wdXRfc3RvY2sudmFsKCksIDEwKSA8PSBwYXJzZUludChkYXRhLnN0b2NrLCAxMCkpIHtcbiAgICAgICAgICAgICAgICBhY3RpdmUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYm9vdGJveC5hbGVydCgnRXhjZWRlIGVsIG1heGltbyBkZSBwcm9kdWN0b3MgZGlzcG9uaWJsZSBlbiBlc3RhIHN1Y3Vyc2FsJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dF9zdG9jay52YWwoZGF0YS5zdG9jayk7XG4gICAgICAgICAgICAgICAgICAgIHF1YW50aXR5LnZhbChkYXRhLnN0b2NrKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBkZWFjdGl2YXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChkYXRhLnN0b2NrID4gMCkge1xuICAgICAgICAgICAgYWN0aXZlKCk7XG4gICAgICAgICAgICBpbnB1dF9zdG9jay5yZW1vdmVBdHRyKCdkaXNhYmxlZCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGVhY3RpdmF0ZSgpO1xuICAgICAgICAgICAgaW5wdXRfc3RvY2suYXR0cignZGlzYWJsZWQnLCAndHJ1ZScpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2ZSgpIHtcbiAgICAgICAgICAgIGlucHV0X3N0b2NrLmF0dHIoJ21heCcsIGRhdGEuc3RvY2spO1xuICAgICAgICAgICAgZm9ybV9zYWxlLnJlbW92ZUF0dHIoJ2Rpc2FibGVkJyk7XG4gICAgICAgICAgICBmb3JtX3Nob3BwaW5nX2NhcnQucmVtb3ZlQXR0cignZGlzYWJsZWQnKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBkZWFjdGl2YXRlKCkge1xuICAgICAgICAgICAgaW5wdXRfc3RvY2sucmVtb3ZlQXR0cignbWF4Jyk7XG4gICAgICAgICAgICBmb3JtX3NhbGUuYXR0cignZGlzYWJsZWQnLCAndHJ1ZScpO1xuICAgICAgICAgICAgZm9ybV9zaG9wcGluZ19jYXJ0LmF0dHIoJ2Rpc2FibGVkJywgJ3RydWUnKTtcbiAgICAgICAgfVxuICAgIH0pO1xufTtcbkFwcC5xdWFudGl0eSA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciB2YWx1ZV9xdWFudGl0eSA9IHBhcnNlSW50KGV2ZW50LnRhcmdldC52YWx1ZSwgMTApO1xuICAgIGlmICh2YWx1ZV9xdWFudGl0eSA8PSAwKSB7XG4gICAgICAgIHZhbHVlX3F1YW50aXR5ID0gMTtcbiAgICAgICAgZXZlbnQudGFyZ2V0LnZhbHVlID0gMTtcbiAgICB9XG4gICAgJCgnLnF1YW50aXR5JykudmFsKHZhbHVlX3F1YW50aXR5KTtcbn07XG5BcHAucXVhbnRpdHlVcGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB2YXIgaW5wdXRfcXVhbnRpdHkgPSBldmVudC50YXJnZXQ7XG4gICAgdmFyIHF1YW50aXR5ID0gcGFyc2VJbnQoaW5wdXRfcXVhbnRpdHkudmFsdWUsIDEwKTtcbiAgICB2YXIgcHJvZHVjdF9pZCA9IHBhcnNlSW50KGlucHV0X3F1YW50aXR5LmRhdGFzZXQuaWQsIDEwKTtcbiAgICBpZiAocXVhbnRpdHkgPD0gMCkge1xuICAgICAgICBxdWFudGl0eSA9IDE7XG4gICAgICAgIGlucHV0X3F1YW50aXR5LnZhbHVlID0gMTtcbiAgICB9XG4gICAgdmFyIGRhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgICBkYXRhLmFwcGVuZCgncHJvZHVjdF9pZCcsIHByb2R1Y3RfaWQpO1xuICAgIGRhdGEuYXBwZW5kKCdxdWFudGl0eScsIHF1YW50aXR5KTtcbiAgICBmZXRjaCgnL3Nob3BwaW5nLWNhcnQvdXBkYXRlJywge1xuICAgICAgICBtZXRob2Q6ICdwb3N0JyxcbiAgICAgICAgYm9keTogZGF0YVxuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIGlmIChyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IFwiRXJyb3IgZW4gbGEgbGxhbWFkYSBBamF4XCI7XG4gICAgICAgIH1cbiAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcbiAgICAgICAgdmFyIHRvdGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ1ByaWNlVG90YWwnKTtcbiAgICAgICAgdG90YWwuaW5uZXJUZXh0ID0gJyQnICsgcmVzdWx0LnRvdGFsLnRvTG9jYWxlU3RyaW5nKCdlcy1DTCcpO1xuICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgIH0pO1xufTtcbkFwcC5yZWdpc3RlciA9IGZ1bmN0aW9uICgpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHZhciBmb3JtID0gZXZlbnQudGFyZ2V0O1xuICAgIGZldGNoKGZvcm0uYWN0aW9uLCB7XG4gICAgICAgIG1ldGhvZDogZm9ybS5tZXRob2QsXG4gICAgICAgIGJvZHk6IG5ldyBGb3JtRGF0YShmb3JtKVxuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIGlmIChyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IFwiRXJyb3IgZW4gbGEgbGxhbWFkYSBBamF4XCI7XG4gICAgICAgIH1cbiAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgYm9vdGJveC5hbGVydChyZXN1bHQubWVzc2FnZSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHJlc3VsdC5zdGF0ZSkge1xuICAgICAgICAgICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICB9KTtcbn07XG5BcHAuZmlsdGVyVGFibGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgJCgnLnRhYmxlLWZpbHRlcicpLkRhdGFUYWJsZSh7XG4gICAgICAgIFwibGFuZ3VhZ2VcIjoge1xuICAgICAgICAgICAgXCJsZW5ndGhNZW51XCI6IFwiTW9zdHJhciBfTUVOVV8gcmVnaXN0cm9zIHBvciBww6FnaW5hXCIsXG4gICAgICAgICAgICBcInplcm9SZWNvcmRzXCI6IFwiTm8gZXhpc3RlbiByZWdpc3Ryb3NcIixcbiAgICAgICAgICAgIFwiaW5mb1wiOiBcIk1vc3RyYW5kbyBsYSBww6FnaW5hIF9QQUdFXyBkZSBfUEFHRVNfXCIsXG4gICAgICAgICAgICBcImluZm9FbXB0eVwiOiBcIk5vIGhheSByZWdpc3Ryb3MgZGlzcG9uaWJsZXNcIixcbiAgICAgICAgICAgIFwic2VhcmNoXCI6IFwiQnVzY2FyOlwiLFxuICAgICAgICAgICAgXCJpbmZvRmlsdGVyZWRcIjogXCIoY29uIGZpbHRybyBkZSBfTUFYXyByZWdpc3Ryb3MgZW4gdG90YWwpXCIsXG4gICAgICAgICAgICBcInBhZ2luYXRlXCI6IHtcbiAgICAgICAgICAgICAgICBcImZpcnN0XCI6IFwiUHJpbWVyb1wiLFxuICAgICAgICAgICAgICAgIFwibGFzdFwiOiBcIsOabHRpbW9cIixcbiAgICAgICAgICAgICAgICBcIm5leHRcIjogXCJTaWd1aWVudGVcIixcbiAgICAgICAgICAgICAgICBcInByZXZpb3VzXCI6IFwiQW50ZXJpb3JcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59O1xuQXBwLnNob3dGaWxlSW5wdXQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHZhciBpbnB1dEZpbGUgPSBldmVudC50YXJnZXQ7XG4gICAgdmFyIGZpbGVuYW1lID0gaW5wdXRGaWxlLmZpbGVzWzBdLm5hbWU7XG4gICAgdmFyIGZpbGVTaXplID0gaW5wdXRGaWxlLmZpbGVzWzBdLnNpemU7XG4gICAgdmFyIGFsbG93ZWRfZXh0ZW5zaW9ucyA9IFsnLmdpZicsICcucG5nJywgJy5qcGcnLCAnLmRvYycsICcucGRmJywgJy5kd2cnXTtcbiAgICB2YXIgZXh0ZW5zaW9uID0gZmlsZW5hbWUuc3Vic3RyaW5nKGZpbGVuYW1lLmxhc3RJbmRleE9mKCcuJykpLnRvTG93ZXJDYXNlKCk7XG4gICAgdmFyIGFsbG93ZWQgPSBhbGxvd2VkX2V4dGVuc2lvbnMuaW5jbHVkZXMoZXh0ZW5zaW9uKTtcbiAgICBpZiAoZmlsZVNpemUgPiAyMDk3MTUyKSB7XG4gICAgICAgIGJvb3Rib3guYWxlcnQoJ0VsIHRhbWHDsW8gZGVsIGFyY2hpdm8gbm8gZGViZSBzdXBlcmFyIGxvcyAyTScpO1xuICAgICAgICBpbnB1dEZpbGUudmFsdWUgPSAnJztcbiAgICB9IGVsc2UgaWYgKCFhbGxvd2VkKSB7XG4gICAgICAgIGlucHV0RmlsZS52YWx1ZSA9ICcnO1xuICAgICAgICBib290Ym94LmFsZXJ0KCdFbCBmb3JtYXRvIG5vIGVzIGNvcnJlY3RvJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaW5wdXRGaWxlLnZhbHVlID0gJyc7XG4gICAgICAgIGlucHV0RmlsZS5kYXRhc2V0LmJlZm9yZSA9IGZpbGVuYW1lO1xuICAgICAgICAvLyQoJ2lucHV0LmZpbGUtaW5wdXQ6YmVmb3JlJykuY3NzKCdjb250ZW50OiAnLGZpbGVuYW1lKTtcbiAgICAgICAgLy93aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShpbnB1dEZpbGUsJzpiZWZvcmUnKS5nZXRQcm9wZXJ0eVZhbHVlKCdjb250ZW50OiAnLGZpbGVuYW1lKTtcbiAgICAgICAgLy9sZXQgcHNldWRvQ29udGVudCA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGlucHV0RmlsZSwnOmJlZm9yZScpO1xuICAgICAgICAvL2xldCByZXN1bHQgPSBwc2V1ZG9Db250ZW50LnN0eWxlO1xuICAgICAgICAvL2NvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICAgIC8vZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgKz0gXCJQc2V1ZG8tZWxlbWVudCBjb250ZW50OiBcIiArIHBzZXVkb0NvbnRlbnQ7XG4gICAgfVxuICAgIC8qbGV0IGZpbGUgPSB0aGlzO1xuICAgIGxldCBzdHIgPSBmaWxlLmZpbGVzWzBdLm5hbWU7XG4gICAgbGV0IGZpbGVTaXplID0gZmlsZS5maWxlc1swXS5zaXplO1xuICAgIGxldCBhbGxvd2VkX2V4dGVuc2lvbnMgPSBbXCIuZ2lmXCIsXCIucG5nXCIsXCIuanBnXCIsXCIuZG9jXCIsXCIucGRmXCIsXCIuZHdnXCJdO1xuICAgIGxldCBleHRlbnNpb24gPSAoc3RyLnN1YnN0cmluZyhzdHIubGFzdEluZGV4T2YoXCIuXCIpKSkudG9Mb3dlckNhc2UoKTtcbiAgICBsZXQgYWxsb3dlZCA9IGFsbG93ZWRfZXh0ZW5zaW9ucy5pbmNsdWRlcyhleHRlbnNpb24pO1xuICAgIGlmKGZpbGVTaXplID4gMjA5NzE1Mikge1xuICAgICAgICBib290Ym94LmFsZXJ0KCdFbCB0YW1hw7FvIGRlbCBhcmNoaXZvIG5vIGRlYmUgc3VwZXJhciBsb3MgMk0nKTtcbiAgICAgICAgJChmaWxlKS52YWwoJycpO1xuICAgIH0gZWxzZSBpZighYWxsb3dlZCl7XG4gICAgICAgIGJvb3Rib3guYWxlcnQoJ0VsIGZvcm1hdG8gbm8gZXMgY29ycmVjdG8nKTtcbiAgICB9ZWxzZXtcbiAgICAgICAgZG9jdW1lbnQuc3R5bGVTaGVldHNbMF0uYWRkUnVsZSgnaW5wdXQuZmlsZS1pbnB1dDpiZWZvcmUnLCdjb250ZW50OiBcIicrc3RyKydcIjsnKTtcbiAgICB9Ki9cbn07XG5pZiAoZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgQXBwLmluaXRpYWxpemUsIGZhbHNlKTtcbn0gZWxzZSB7XG4gICAgd2luZG93LmF0dGFjaEV2ZW50KCdvbmxvYWQnLCBBcHAuaW5pdGlhbGl6ZSk7XG59Il0sImZpbGUiOiJtYWluLm1pbi5qcyJ9
