    function get_stored_path(nm) {
            return "\\\\localhost\\export_sandbox\\・岡崎";

        }

        $(window).on('beforeunload', function(e) {
            console.log('before!!!');
            if ($('input#prevent_mis').is(':checked')) {
                console.log($('input#prevent_mis').is(':checked'));
                var tx = 'Really3?';
                e.returnValue = tx;
                return tx;
            } 
        });

        $("#btn_mkdir").on('click', function(e) {
            console.log( $("#sch").val() );

            var sch = $("#sch").val();

            var path = `"${get_stored_path(sch)}\\${sch}"`;

            $("#mkdir").html("mkdir " + path);
            $("#explorer").html("explorer " + path);
            $("#photo_dir").val( path );
        });

        $(".preview").on('dragover', function(e) {
            e.preventDefault();
        });
        /*
        $(".preview").on('drop', function(e) {
            e.preventDefault();
            var files = e.dataTransfer.files;
            if (files.length === 1 && files[0].type.startsWith('image/')) {
                var ff = files[0];

                var read = new FileReader();
                read.onload = function(e) {
                    console.log(this);
                }

            }

        });
        */


//        var imgE = document.getElementById('imgE');

        Object.values(document.getElementsByClassName("preview")).forEach( function(ii) {
            ii.addEventListener( "drop", function(e) {

                var lst = e.srcElement.querySelectorAll("img");
                var imgE;
                if (lst.length === 1) {
                    imgE = lst[0];
                }

                var lst2 = e.srcElement.querySelectorAll("a");
                var anc;
                if (lst2.length === 1) {
                    anc = lst2[0];
                }

                e.preventDefault();
                var files = e.dataTransfer.files;
                console.log(files);
                if (files.length === 1 && files[0].type.startsWith('image/')) {
                console.log('A');
                    var ff = files[0];

                    var rd = new FileReader();
                    rd.onload = function(e) {
                        imgE.src = e.target.result;
                        imgE.style.display = 'block';

                        anc.href = URL.createObjectURL(ff);

                    }
                    rd.readAsDataURL(ff);
                }
            })
        });

async function postData(data = {}) {
  var key = `${data['timestamp']}_${data['inc_i']}`;
  const res = await fetch(`/save/${key}`, { method: "POST", headers:  { "Content-Type": "application/json" }, body: JSON.stringify(data) });
}

async function getData(data = {}) {

  const tt = $('#timestamp').val() ;
  const ii = $('#inc_i').val();

  var key = `${tt}_${ii}`;
  const res0 = await fetch(`/load/${key}`);
  const datax = await res0.json();
  console.log(datax);

  x = JSON.parse(datax);

  $.each(x, function(key, value) {
    console.log(key);
    console.log(value);
    $(`[name=${key}`).val(value);
  });



};

$(document).ready((event) => {
  $('#area_for_editing').on('submit', (event) => {
    event.preventDefault();
    const ff = $('#area_for_editing').get()[0];
    const form_data = new FormData(ff);
    postData(Object.fromEntries(form_data));
  });

  // Put the date string into the field.
  $('#set_today').on('click', (event) => {
    event.preventDefault();
    $('#timestamp').val( new Date().toLocaleString('ja-JP',
        { year: '2-digit', month: '2-digit', day: '2-digit'}
      ).replace(/\//g, '-'));

  });

  $('#load_data').on('click', (event) => {
    event.preventDefault();
    getData();
  });
});
