$(document).ready(function () {
  moment.locale('uk');
  Handlebars.registerHelper('moment', function(context, options) {
    let format = options.hash.format || 'HH:mm:ss_SSS DD/MM/YYYY';
    return moment(Number(context)).format(format);
  });

  let map;
  let bounds = new google.maps.LatLngBounds();

  map = new google.maps.Map(document.getElementById('map'), {});

  fetch('https://04u727i4b6.execute-api.us-east-1.amazonaws.com/stageTrackLoc/')
    .then(response => response.json())
    .then(data => createPath(data.locations))
    .catch((err) => {
      console.log('Fetch Error:', err);
    });

  function createPath(positions) {
    let listTemplateHtml = Handlebars.compile($("#list-template").html())({
      items: positions,
      count: positions.length
    });
    $("#listHolder").html(listTemplateHtml);

    $("#listHolder li").on('click', function(){
      let eventId = $(this).data('id');
      alert(eventId);
    });

    //let flightPlanCoordinates = [];

    positions.forEach((item) => {
      let position = new google.maps.LatLng(Number(item.latitude), Number(item.longitude));
      //flightPlanCoordinates.push(position);
      new google.maps.Marker({
        position: position,
        map: map
      });
      bounds.extend(position)
    });

    // let flightPath = new google.maps.Polyline({
    //   path: flightPlanCoordinates,
    //   geodesic: true,
    //   strokeColor: '#1E90FF',
    //   strokeOpacity: 1.0,
    //   strokeWeight: 2
    // });
    //
    // flightPath.setMap(map);
    map.fitBounds(bounds);
  }
});