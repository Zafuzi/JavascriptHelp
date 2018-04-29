


document.addEventListener("DOMContentLoaded", function(){
  doFirst();
  setData();
  var provinces = [];
  const url = './provinces.json';
  if(provinces.length < 1){
    // Populate dropdown with list of provinces
    $.getJSON(url, function (data) {
      //console.log(data);
      provinces = data;
      cloner("tpl_select_province", provinces, () => {}, () => {console.log(provinces)})
    });
  }
})

function setData(){
  var xhr = new XMLHttpRequest();
  xhr.open('GET',"data.json",true);
  xhr.responseType='text';
  xhr.send();

  xhr.onload = function (){
    if (xhr.status===200){
      var myStuff = JSON.parse(xhr.responseText);
      myStuff = myStuff.UNIT;

      var table = $('.main-table tbody');
      

      cloner('tpl_table_row', myStuff, 
        function(){
        }, () => { table.removeClass('hid'); }
      );
    }
  }
}

function cloner(id, data, lp, cb){
  try{
    var elements = $('#' + id) || $('.' + id);
    if(elements.length > 1){
      console.log(elements);
    }
    console.log(elements);
    var el = $('#' + id)
    var top = el;
    var template = $(el)[0].outerHTML;

    let el_arr = [];
    
    $.each(data, (key, row) => {
      var s = template;
      $.each(row, (prop, text) => {
        var regex = new RegExp('\\${' + prop + '}', "g");
        s = s.replace(regex, text);
      })
      
      el.before($(s));
      if(lp) lp();
    });

    top.remove();
    if(cb) cb(el_arr);
  } catch (e){
    console.error("Error during cloning " + id + " error: "  + e );
  }
  
}

function doFirst(){
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