const M = 4294967296;
const A = 1664525;
const C = 1;
var Z = Math.floor(Math.random() * M);

function rand(){
    Z = (A * Z + C) % M;
    return Z / M - 0.5;
};


function interpolate(pa, pb, px){
    let ft = px * Math.PI;
    let f = (1 - Math.cos(ft)) * 0.5;
    return pa * (1 - f) + pb * f;
}

var x = 0,
  y = h / 2,
  amp = 100, //amplitude
  wl = 100, //wavelength
  fq = 1 / wl, //frequency
  a = rand(),
  b = rand();

while(x < w){
  if(x % wl === 0){
    a = b;
    b = rand();
    y = h / 2 + a * amp;
  }else{
    y = h / 2 + interpolate(a, b, (x % wl) / wl) * amp;
  }
  ctx.fillRect(x, y, 1, 1);
  x += 1;
}