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
});

