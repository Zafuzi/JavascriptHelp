var xhr = new XMLHttpRequest();
xhr.open('GET',"data.json",true);
xhr.responseType='text';
xhr.send();

xhr.onload = function (){
  if (xhr.status===200){
    var myStuff=JSON.parse(xhr.responseText);
    console.log(myStuff);
    console.log(myStuff.UNIT["0"].SerialNumber);
    document.getElementById("serial").innerHTML=(myStuff.UNIT["0"].SerialNumber);


    for(i=0; i<myStuff.length;i++){
      console.log(myStuff.UNIT["0"].SerialNumber);

    }
  }
}
