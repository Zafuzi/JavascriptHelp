var UNITS = [];
var visible_units = [];

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
    console.log(unit)
  
    visible_units.push(unit[0]);
    updateUnits();

    var option = $("option[value=" + val + "]");
    console.log(option);
    option.remove();
    $(self).val('');
  })

  $('.main-table .sensor-table').on('click', (e) => {
    e.stopPropagation();
  });
}

function setData(){
  var xhr = new XMLHttpRequest();
  xhr.open('GET',"data.json",true);
  xhr.responseType='text';
  xhr.send();

  xhr.onload = function (){
    if (xhr.status===200){
      UNITS = JSON.parse(xhr.responseText).UNIT;
      clone('tpl_unit_serial_datalist', UNITS)
    }
  }
}

function updateUnits(){
  var table = $('.main-table tbody');
      
      $.each(visible_units, (key, UNIT) => {
        UNIT.status_color = UNIT.STATUS == "ON" ? "#6230D1" : "red";

        if(UNIT.POWER >= 75){
          UNIT.RISK = "LOW";
        }else if (UNIT.POWER >= 35){
          UNIT.RISK = "MEDIUM";
        } else {UNIT.RISK = "HIGH"}

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

      clone('tpl_table_row', []);
      clone('tpl_table_row', visible_units, (e,d,i)=>{
        $(e).on('click', (evt) => {
          let self = evt.currentTarget;
          let isChild = $(evt.target).parent().is(self) ? true : false;
          if(!isChild) return;

          $.each(d.SENSORS, (key, sensor) => {
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
          clone('tpl_sensor_row_' + d._id, []);
          clone('tpl_sensor_row_' + + d._id, d.SENSORS);
          $(self).find(".sensor-table tbody").removeClass('hid');
          
          let me = $(self).find('.collapse');
          let notMe = $('.collapse').not(me);
          notMe.slideUp(300);
          me.slideToggle(300);
          console.log("NOT ME: ", notMe);
        })
      })
      table.removeClass('hid');
}

clone = function(id, data, cb){
  if( !clone.templates ){
    clone.sequence = 1;
    clone.templates = {};
  }

  clone.substitute = ( str, data ) => {
    $.each(data, (key) => {
      var re = new RegExp( "__" + key + "__", "g" );
      str = str.replace( re, ""+(data[ key ]) );
    })
    return str;
  }
  clone.inject = ( e, data ) => {
    e.innerHTML = clone.substitute( e.innerHTML, data );
    var attrs = e.attributes;
    if( navigator.appName == "Microsoft Internet Explorer" ) {
      for( var k in attrs ) {
        var val = e.getAttribute( k );
        if( val ) {
          if( typeof val === "string" ) {
            if( val.match( /__/ ) ) {
              val = clone.substitute( val, data );
              e.setAttribute( k, val );
            }
          }
        }
      }
    }
    else {
      for( var i = 0 ; i < attrs.length ; i++ ) {
        var attr = attrs[ i ];
        var val = attr.value;
        if( val ) {
          if( typeof val === "string" ) {
            if( val.match( /__/ ) ) {
              attr.value = clone.substitute( val, data );
            }
          }
        }
      }
    }
  }

  if(typeof id === "undefined") {
		return;
	}

	if( ! ( data instanceof Array ) ) {
		throw new Error( "clone: replication data is not an array" );
	}
	// check first element in array
	if(data.length > 0 && typeof data[0] !== "object") {
		throw new Error( "clone: replication data array does not contain objects" );
	}

	var tem = null;

	if( id instanceof HTMLElement ) { //typeof id === "object" ) 
		// an element is being passed in rather than an element id
		var e = id;
		id = e.id;
		if( ! id ) {
			id = "clone_" + clone.seq;
			clone.seq += 1;
			e.id = id;
		}
	}

	if( typeof id === "string" ) {
		tem = document.getElementById( id );
		if(!tem) {
			tem = clone.templates[ id ];
			if( ! tem ) {
				throw new Error( "clone: template not found: " + id );
			}
		}
		else {
			tem.sib = tem.nextSibling 			// remember sibling - might be null
			tem.mom = tem.parentNode;			// remember mommy
		}
	}
	else {
		throw new Error( "clone: invalid template or element id");
	}

	clone.templates[ id ] = tem;		// store the template in cache

	if(tem.parentNode) {
		tem.parentNode.removeChild( tem );	// take template out of the DOM
	}

	// remove from the DOM, all the clones that I created and inserted last time around for this same template
	if(tem.clones) {
		tem.clones.forEach(function(clone) {
			clone.parentNode.removeChild(clone); //remove();        // IE is so fuckin stupid.
		});
	}
	tem.clones = [];

	// clone the template by cloning it and injecting the data into it.
	// replace existing clones as we go (as opposed to removing them all first then recreateing, which
	// is disruptive to the UI, and can dramatically change currently viewed page position).
	var l = data.length
	var mom = tem.mom;
	for( var i = 0 ; i < l ; i++ ) {
		var d = data[ i ]					// get the data src

		var e = tem.cloneNode( true )		// clone the template
		e.removeAttribute( "id" );			// clear the id from the cloned element

		mom.insertBefore( e, tem.sib );	// insert the clone into the dom

		tem.clones.push(e); //[i] = e;

		clone.inject( e, d );			// inject the data into the element

		if( cb ) {
			cb( e, d, i );			// lets caller do stuff after each clone is created
		}
  }
}

function doFirst(){

  // Make the first chart
  var ctx = document.getElementById("chart0").getContext('2d');
  var myChart = new Chart(ctx, {
      type: 'bar',
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
              yAxes: [{
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