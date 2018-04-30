
document.addEventListener("DOMContentLoaded", function(){
  doFirst();
  addListeners();
  setData();
})

function addListeners(){
  $('#unit_search').on('change', function(e){
    let val = $(this).val();
    let self = this;

    let unit = UNITS.filter(u => {
      return (u.SerialNumber == val);
    });

    console.log("UNIT: ", unit);

    
    cloner('tpl_table_row', unit, null, (s) => {
      console.log("S: ", s);
      if(s.length < 1) return;
      $(".main-table tbody").append(s);
      $(".main-table tbody").removeClass('hid');
      let option = $('option[value="' + val + '"]');
      option.remove();
      $(self).val('');
    });
  })

  $('#myModal').on('shown.bs.modal', function(e) {
      let val = $(e.relatedTarget).data('serial');
      $('.modal-title').text("UNIT SN #" + val);
      let unit = UNITS.filter(u => {
        return (u.SerialNumber == val);
      })[0];

      console.log(unit);

      $.each(unit.SENSORS, (key, sensor) => {
        sensor.status_color = sensor.STATUS == "ON" ? "#6230D1" : "red";

        if(sensor.POWER >= 75){
          sensor.RISK = "LOW";
        }else if (sensor.POWER >= 35){
          sensor.RISK = "MEDIUM";
        } else {sensor.RISK = "HIGH"}

        switch(sensor.RISK){
            case "HIGH":
              sensor.risk_color = "red";
              break;
            case "MEDIUM":
              sensor.risk_color = "yellow";
              break;
            case "LOW":
              sensor.risk_color = "green";
              break;
        }
      });
      console.log("SENSORS: ", unit.SENSORS);
      $(".sensor-table tbody").html('');
      cloner('tpl_sensor_row', unit.SENSORS, null, (s) => {
        console.log("S: ", s);
        if(s.length < 1) return;
        $(".sensor-table tbody").append(s);
        $(".sensor-table tbody").removeClass('hid');
      });
  })
}

var UNITS = [];

function setData(){
  var xhr = new XMLHttpRequest();
  xhr.open('GET',"data.json",true);
  xhr.responseType='text';
  xhr.send();

  xhr.onload = function (){
    if (xhr.status===200){
      UNITS = JSON.parse(xhr.responseText).UNIT;

      var table = $('.main-table tbody');
      
      $.each(UNITS, (key, UNIT) => {
        UNIT.status_color = UNIT.STATUS == "ON" ? "#6230D1" : "red";

        if(UNIT.POWER >= 75){
          UNIT.RISK = "LOW";
        }else if (UNIT.POWER >= 35){
          UNIT.RISK = "MEDIUM";
        } else {UNIT.RISK = "HIGH"}

        console.log(UNIT.POWER, UNIT.RISK);

        switch(UNIT.RISK){
            case "HIGH":
              UNIT.risk_color = "red";
              break;
            case "MEDIUM":
              UNIT.risk_color = "yellow";
              break;
            case "LOW":
              UNIT.risk_color = "green";
              break;
        }
      })

      // cloner('tpl_table_row', UNITS, 
      //   function(){
      //   }, () => { table.removeClass('hid'); }
      // );

      cloner('tpl_unit_searial_datalist', UNITS, null, function(s){
        $('#unit_serials').append(s);
      })
    }
  }
}

function cloner(id, data, lp, cb){
  console.log("DATA: ", data);
  try{
    var el = $('#' + id)
    var top = el;
    var template = $(el)[0].outerHTML;

    let el_arr = [];
    
    $.each(data, (key, row) => {
      var s = template;
      $.each(row, (prop, text) => {
        var regex = new RegExp('\__' + prop + '__', "g");
        s = s.replace(regex, text);
        s = s.replace(/\w*hid\b/g, '');
      })
      el_arr.push($(s));
      if(lp) lp();
    });

    cb(el_arr);
  } catch (e){
    console.error("Error during cloning " + id + " error: "  + e );
  }
}

function doFirst(){

  // Make the first chart
  var ctx = document.getElementById("chart0").getContext('2d');
  var myChart = new Chart(ctx, {
      type: 'horizontalBar',
      data: {
          labels: ["High Risk", "Medium Risk", "Low Risk", "Offline", "Online"],
          datasets: [{
              label: '# of UNITS',
              data: [10, 16, 34, 10, 50],
              backgroundColor: [
                  'rgba(255, 166, 77, .2)',
                  'rgba(255, 206, 86, .2)',
                  'rgba(54, 162, 235, .2)',
                  'rgba(175, 175, 175, .2)',
                  'rgba(102, 0, 255,.2)'
              ],
              borderColor: [
                  'rgba(255, 166, 77, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(175, 175, 175, 1)',
                  'rgba(102, 0, 255, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              xAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          }
      }
  });


  $('.hover').click(function () {
    $('.table-head').toggle();
    $('.hide-main').toggle();
  });

  $('.inner-hover').click(function () {
    $('.main-table').toggle();
    $('.inner-table-head').toggle();
    $('.inner-graph').toggle();
  });

  let k = 0;
    (function theLoop(i) {
      setTimeout(function () {
        var fruits = [
          "1&nbsp&nbsp&nbsp&nbsp     SN# 287278248338&nbsp&nbsp&nbsp&nbsp        TEMPERATURE&nbsp&nbsp&nbsp&nbsp            25 C       ON        LOW RISK        90%     BATTERY",
          "2&nbsp&nbsp&nbsp&nbsp        SN# 555629637568&nbsp&nbsp&nbsp&nbsp    HUMIDITY&nbsp&nbsp&nbsp&nbsp        80%        ON    LOW RISK    84% BATTERY",
          "3&nbsp&nbsp&nbsp&nbsp        SN# 483732359797&nbsp&nbsp&nbsp&nbsp    LOAD CELL&nbsp&nbsp&nbsp&nbsp        100     ON    MEDIUM RISK    50% BATTERY",
          "4&nbsp&nbsp&nbsp&nbsp        SN# 793273846475&nbsp&nbsp&nbsp&nbsp    ECO2&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp            1000    ON    HIGH RISK    15% BATTERY",
          "5&nbsp&nbsp&nbsp&nbsp        SN# 957439888383&nbsp&nbsp&nbsp&nbsp    TVDC&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp            100        ON    MEDIUM RISK    40%    BATTERY",
          "6&nbsp&nbsp&nbsp&nbsp   SN# 389884426582&nbsp&nbsp&nbsp&nbsp    LIGHT&nbsp&nbsp&nbsp&nbsp            1        ON    LOW RISK    85%    BATTERY",
          "7&nbsp&nbsp&nbsp&nbsp        SN# 658265769777&nbsp&nbsp&nbsp&nbsp    ACCELEROMETER&nbsp&nbsp&nbsp&nbsp    G        OFF    OFF            0%    BATTERY"
        ];
        fruits.toString();

        let div = document.createElement('div');
        div.id = `demo-${k}`;
        div.innerHTML = `<p>${fruits[k]}</p>`

        document.getElementById('content').prepend(div);

        k = k + 1;
        if (k > fruits.length - 1) {
          k = 0;
        }
        if (--i) {
          theLoop(i);
        }
      }, 500)
    })(10000);

    
}