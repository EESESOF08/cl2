$(document).ready((event) => {
  $("#sendButton").on("click", function(ee) {
    ee.preventDefault();
    const form_area = $('#area_for_editing').get()[0];
    const form_data = new FormData(form_area);
    const data      = Object.fromEntries(form_data);

    fetch('/receive-json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
  $("#getButton").on("click", function(ee) {
    ee.preventDefault();
    fetch('/data', {
      method: "GET",
      headers: { 'Content-Type' : 'application/json' }
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
});

