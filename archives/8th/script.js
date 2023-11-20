$(document).ready((event) => {
  $("#save").on("click", function(ee) {
    ee.preventDefault();
    const form_area = $('#for_editing').get()[0];
    const form_data = new FormData(form_area);
    const data      = Object.fromEntries(form_data);

    console.log(data);

    var nn = document.getElementById('managedNumber').value;
    var dt = document.getElementById('date').value;
    console.log(`number:{nn} date:{dt}`);

    const query_string = (new URLSearchParams({ "number" : nn, "date" : dt })).toString();
    const fetch_url    = `/save?${query_string}`;
    alert(fetch_url);

    fetch(fetch_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json: charset=utf-8'  },
      body: JSON.stringify(data) 
    })
    .then(response => response.text())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Err:', error);
    });
  });

  $("#restore").on("click", function(ee) {
    ee.preventDefault();
    var nn = document.getElementById('managedNumber').value;
    var dt = document.getElementById('date').value;
    const query_string = (new URLSearchParams({ "number" : nn, "date" : dt })).toString();

	  var fetch_url = `/restore?${query_string}`;
    console.log(fetch_url);

	  fetch(fetch_url, {
      method: "GET",
      headers: { 'Content-Type' : 'application/json: charset=utf-8' }
    })
    .then(res => {
      console.log("RES");
      console.log(res);
      if (!res.ok) {
        throw new Error("network response waste");
      }
      return res.json();
    })
    .then(data => {
      var data = JSON.stringify(data, null, 2);
      document.getElementById("result").textContent = data;

      console.log(data);
      var edata = JSON.parse(data);
      $.each(edata, function(kk, vv) {
        console.log(kk);
        console.log(vv);
        $('#' + kk).val(vv);
      });

    })
    .catch(err => {
      console.error(`Fetch Error: ${err}`);
    });
  });

  $("#set_today").on("click", function(ee) {
    ee.preventDefault();
    $("#timestamp").val(datestring());

  });
  $("#set_today2").on("click", function(ee) {
    ee.preventDefault();
    $("#date").val(datestring());
  });

  $("input:text, textarea").each(function() {
    const id = $(this).attr("id");
    $(this).attr("name", id);
  });



});

function datestring() {
  const date = new Date();
  const str =  new Intl.DateTimeFormat('en-US',
   { month: '2-digit', day: '2-digit', year: 'numeric'}).format(date).replaceAll('/', '');
  return str;
}
