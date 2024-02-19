const numX = 17;
const numY = 17;
const delaySnake = 100; // miliseconds

// Initialize papan and emptyPapan arrays
const papan = [];
const emptyPapan = [];

for (let i = 0; i < numY; i++) {
  const rowPapan = [];
  const rowEmptyPapan = [];

  for (let j = 0; j < numX; j++) {
    const cell = `${i}-${j}`;
    rowPapan.push(cell);
    rowEmptyPapan.push(undefined); // Use undefined for empty cells
  }

  papan.push(rowPapan);
  emptyPapan.push(rowEmptyPapan);
}

let xBaru, yBaru;
// ekor
let ekor = [];

const xLength = papan[0].length;
const yLength = papan.length;



// posisi tengah
let x = Math.floor(papan[0].length / 2);
let y = Math.floor(papan.length / 2);
let posisiTengah = papan[x][y];
ekor.push(papan[x][y]);
// console.log(papan[x][y]);
let delayTimer;
let looping;
let point = 0;
let hitWall = false;
let hitSelf = false;
let posisi;
// random buah
let yBuah, xBuah;
let arrow;
let eat = new Audio('eat.wav');
let die = new Audio('die.wav');
let move = new Audio('move.wav');
document.getElementById(x+'-'+y).classList.add("ular");
emptyPapan[x][y] = "Ular";


// memasikan jika awal spawn buah tidak pada user ular
let randomLoop1 = true;
while(randomLoop1){
  yBuah = Math.floor(Math.random() * papan[0].length);
  xBuah = Math.floor(Math.random() * papan.length);
  // console.log(xBuah + '-' + yBuah);
  if(emptyPapan[xBuah][yBuah] !== "Ular"){
    // meletakan buah di papan memory
    emptyPapan[xBuah][yBuah] = "Buah";
    randomLoop1 = false;
  }
}

// menampilkan buah di papan
let lokasiBuah = papan[xBuah][yBuah];
document.getElementById(lokasiBuah).classList.add("buah");

[xBaru, yBaru] = lokasiBuah.split('-');
// console.log(lokasiBuah);


// kiri = 37
// bawah = 38 
// kanan = 39
// atas = 40

let respondToKeyboardInput = true;

let keyProcessing = false;
document.onkeydown = (e)=> {

  if (keyProcessing) {
    return;
  }

  keyProcessing = true;

  clearTimeout(delayTimer);
  delayTimer = setTimeout(function () {
    keyProcessing = false;
  }, 100);

  if (!respondToKeyboardInput) {
    return;
  }
  if(
    (!(e.keyCode == 40 && arrow == 38) && !(e.keyCode == 38 && arrow == 40)) &&
    (!(e.keyCode == 37 && arrow == 39) && !(e.keyCode == 39 && arrow == 37)) &&
    !(e.keyCode == arrow)
  ){
    arrow = e.keyCode;
    move.play();
  }

  if(arrow === 37 || arrow === 38 || arrow === 39 || arrow === 40){
    if(looping !== null || looping !== undefined){
      clearInterval(looping);
    }
    hitWall = false;
    hitSelf = false;

    // kiri
    if(arrow === 37) {
      looping = setInterval(() =>{

        x = x - 1;
        template();
        updateEkor(posisi);
        
        if(hitWall){
          clearInterval(looping);
          respondToKeyboardInput = false;
          return;
        } else if(hitSelf){
          clearInterval(looping);
          respondToKeyboardInput = false;
          return;
        }
      }, delaySnake);
    } 

    // bawah
    else if (arrow === 38){
      looping = setInterval(() => {
        
        y = y - 1;
        template();
        updateEkor(posisi);
        
        if(hitWall){
          clearInterval(looping);
          respondToKeyboardInput = false;
          return;
        } else if(hitSelf){
          clearInterval(looping);
          respondToKeyboardInput = false;
          return;
        }

      }, delaySnake);
    } 

    // kanan
    else if (arrow === 39){
      looping = setInterval(() => {

        x = x + 1;
        template();
        updateEkor(posisi);
        
        if(hitWall){
          clearInterval(looping);
          respondToKeyboardInput = false;
          return;
        } else if(hitSelf){
          clearInterval(looping);
          respondToKeyboardInput = false;
          return;
        }

      }, delaySnake);
    } 

    // atas
    else if (arrow === 40){
      looping = setInterval(() => {

        y = y + 1;
        template();
        updateEkor(posisi);

        if(hitWall){
          clearInterval(looping);
          respondToKeyboardInput = false;
          return;
        } else if(hitSelf){
          clearInterval(looping);
          respondToKeyboardInput = false;
          return;
        }

      }, delaySnake);
    } 
  }
}


function updateEkor(newVal) {
  
  const table = document.getElementById("myTable");

  const rows = table.getElementsByTagName("tr");
  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("td");
    for (let j = 0; j < cells.length; j++) {
      const isOddRow = i % 2 === 0;
      const isOddColumn = j % 2 === 0;

      if (isOddRow && isOddColumn) {
        cells[j].style.backgroundColor= "#A2D149";
      } else if (isOddRow || isOddColumn) {
        cells[j].style.backgroundColor= "#AAD851";
      } else {
        cells[j].style.backgroundColor= "#A2D149";
      }
    }
  }


  // ambil yg terakhir
  let ekorTerakhir = ekor.pop();
  // tambah yang baru di awal
  ekor.unshift(newVal);

  [xBaru, yBaru] = ekorTerakhir.split('-');
  emptyPapan[xBaru][yBaru] = "";
  document.getElementById(ekorTerakhir).classList.remove("ular");

  for(let i = 0; i < ekor.length; i++){ 
    document.getElementById(lokasiBuah).classList.add("buah");
    document.getElementById(ekor[i]).classList.add("ular");
    // console.log(ekor);
    [xBaru, yBaru] = ekor[i].split('-');
    emptyPapan[xBaru][yBaru] = "Ular";
  }
  // console.log(emptyPapan);
}

function template(){
  // console.log(papan[x][y]);
  if(x < 0 || x > xLength - 1 || y < 0 || y > yLength - 1){
    hitWall = true; 
    die.play();
    alert("Mati tabrak tembok");
    return hitWall;
  } else if(emptyPapan[x][y] === "Ular"){
    hitSelf = true;
    die.play();
    alert("Mati tabrak diri sendiri");
    return hitSelf;
  }
  
  posisi = papan[x][y];
  if(posisi == lokasiBuah){
    eat.play()
    lokasiBuahSebelumnya = lokasiBuah;
    [xBaru, yBaru] = lokasiBuahSebelumnya.split('-');
    
    let randomLoop2 = true;
    while(randomLoop2){
      yBuah = Math.floor(Math.random() * papan.length);
      xBuah = Math.floor(Math.random() * papan[yBuah].length);
      if(emptyPapan[xBuah][yBuah] !== "Ular" && emptyPapan[xBuah][yBuah] !== "Buah"){
        emptyPapan[xBuah][yBuah] = "Buah";
        document.getElementById(xBuah+"-"+yBuah).classList.add("buah");
        lokasiBuah = papan[xBuah][yBuah];
        randomLoop2 = false;
      }
    }
    
    // buah sebelumnya akan dihapus
    document.getElementById(xBaru+"-"+yBaru).classList.remove("buah");
    emptyPapan[xBaru][yBaru] = "";

    point++;
    if(point % 2 == 0){
      ekor.unshift(posisi);
    }
    document.getElementById('point').innerHTML = point;
  }
}