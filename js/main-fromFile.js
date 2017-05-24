$(document).ready(function () {
  moment.locale('uk');
  Handlebars.registerHelper('moment', function(context, options) {
    let format = options.hash.format || 'HH:mm:ss_SSS DD/MM/YYYY';
    return moment(context).format(format);
  });
  let map;
  let bounds = new google.maps.LatLngBounds();

  let $fileInput = $('#fileInput');
  $fileInput.on('change', function() {
    console.log($fileInput[0].files[0]);
    let file = $fileInput[0].files[0];
    if (file.type.match('application/json')) {
      let reader = new FileReader();
      reader.onload = (e) => { fileUploaded(e.target.result) };
      reader.readAsText(file);
    } else {
      alert("File not supported!");
    }
  });

  function fileUploaded(result) {
    let locations = JSON.parse(result);
    console.log('jsonResult');
    console.log(locations);

    populateList(locations);

    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 8
    });

    locations.forEach((item) => {
      if(item.latitude && item.longitude){
        let position = new google.maps.LatLng(Number(item.latitude), Number(item.longitude));
        new google.maps.Marker({
          position: position,
          map: map
        });
        bounds.extend(position)
      }
    });
    map.fitBounds(bounds);
  }

  function populateList(positions) {
    let listTemplateHtml = Handlebars.compile($("#list-template").html())({
      items: positions,
      count: positions.length
    });
    $("#listHolder").append(listTemplateHtml);
    $("#listHolder li").on('click', function(){
      let eventId = $(this).data('id');
      alert(eventId);
    });
  }

});