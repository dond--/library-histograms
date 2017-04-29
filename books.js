"use strict"

var marginX=20
var marginY=20
var canvasWidth=2000
var canvasHeight=1000
var wMin=12
var wMax=25
var w3colors=["aliceblue","antiquewhite","aqua","aquamarine","azure","beige","bisque","black","blanchedalmond","blue","blueviolet","brown","burlywood","cadetblue","chartreuse","chocolate","coral","cornflowerblue","cornsilk","crimson","cyan","darkblue","darkcyan","darkgoldenrod","darkgray","darkgreen","darkgrey","darkkhaki","darkmagenta","darkolivegreen","darkorange","darkorchid","darkred","darksalmon","darkseagreen","darkslateblue","darkslategray","darkslategrey","darkturquoise","darkviolet","deeppink","deepskyblue","dimgray","dimgrey","dodgerblue","firebrick","floralwhite","forestgreen","fuchsia","gainsboro","ghostwhite","gold","goldenrod","gray","green","greenyellow","grey","honeydew","hotpink","indianred","indigo","ivory","khaki","lavender","lavenderblush","lawngreen","lemonchiffon","lightblue","lightcoral","lightcyan","lightgoldenrodyellow","lightgray","lightgreen","lightgrey","lightpink","lightsalmon","lightseagreen","lightskyblue","lightslategray","lightslategrey","lightsteelblue","lightyellow","lime","limegreen","linen","magenta","maroon","mediumaquamarine","mediumblue","mediumorchid","mediumpurple","mediumseagreen","mediumslateblue","mediumspringgreen","mediumturquoise","mediumvioletred","midnightblue","mintcream","mistyrose","moccasin","navajowhite","navy","oldlace","olive","olivedrab","orange","orangered","orchid","palegoldenrod","palegreen","paleturquoise","palevioletred","papayawhip","peachpuff","peru","pink","plum","powderblue","purple","rebeccapurple","red","rosybrown","royalblue","saddlebrown","salmon","sandybrown","seagreen","seashell","sienna","silver","skyblue","slateblue","slategray","slategrey","snow","springgreen","steelblue","tan","teal","thistle","tomato","turquoise","violet","wheat","white","whitesmoke","yellow","yellowgreen"]

function clearGraph(){
  var gD=document.getElementById('graph')
  while(gD.hasChildNodes())
    gD.removeChild(gD.childNodes[0])
}

function constructBook(shelfHeight){
  var book={}
  book.width=Math.floor(Math.random()*(wMax-wMin))+wMin
  book.height=Math.floor(Math.random()*(shelfHeight/3))+(2*shelfHeight/3)
  return book
}

function createGraph(){
  clearGraph()
  var graphDiv=d3.select('#graph').append('svg:svg').attr('width',canvasWidth).attr('height',canvasHeight)
  var posY=marginY
  for(var i=1;i<4;i++){// iterate over three graphs
    var gW=parseInt(document.getElementById('test-'+i+'-width').value)
    var gH=parseInt(document.getElementById('test-'+i+'-height').value)
//     console.log(gW+', '+gH)
    graphDiv.append('svg:rect').attr('x',marginX).attr('y',posY).attr('height',gH).attr('width',gW).attr('fill','transparent').attr('stroke','#eee')

    var xSum=0
    var b
    var count=1
    while(xSum<gW-wMax){
      b=constructBook(gH)
      drawBook(b,marginX+xSum,posY+gH-b.height,graphDiv)
      xSum+=b.width
  //     console.log('mark: '+xSum+', h: '+b.height)
      count++
    }
    var lb=constructBook(gH)
    drawLastBook(lb,marginX+xSum,posY+gH-lb.height,graphDiv,(0.907*lb.height)>b.height?true:false)
    // render label with book count
    graphDiv.append('svg:text').attr('x',4*marginX+xSum).attr('y',posY+marginY+gH/2).text(count).attr('font-size',30).attr('font-family','Helvetica')

    posY+=gH+marginY
  }
}

function drawBook(book,x,y,canvas){
  drawBook(book,x,y,canvas,0,false)
}
                  
function drawBook(book,x,y,canvas,angle,kerning){
  // draw book rectangle
  var box=canvas.append('svg:rect')
  box.attr('x',x).attr('y',y).attr('height',book.height).attr('width',book.width)
  var color=d3.color(w3colors[Math.floor(Math.random()*w3colors.length)])
  box.attr('fill',color).attr('stroke',color.darker(2)).attr('stroke-width',2)
  box.attr('rx',1)
  // draw title / author letter-like line
  var line=canvas.append('svg:line')
  var y1=y+Math.random()*book.height/5+book.height/10
  line.attr('x1',x+book.width/3).attr('y1',y1).attr('x2',x+book.width/3).attr('y2',y1+Math.random()*book.height*0.7).attr('stroke',color.darker(2)).attr('stroke-width',2)
  // sometimes draw subtitle / author
  var secondLine
  if(Math.round(Math.random())){
    secondLine=canvas.append('svg:line')
    secondLine.attr('x1',x+2*book.width/3).attr('y1',y1).attr('x2',x+2*book.width/3).attr('y2',y1+Math.random()*book.height*0.4).attr('stroke',color.darker()).attr('stroke-width',1.5)
  }                                                            

  // tilt last book
  if(angle){
    var transStr='translate('+(kerning?-3:0)+',3)rotate('+angle+','+x+','+y+')'
//     console.log('transform: '+transStr)
    box.attr('transform',transStr)
    line.attr('transform',transStr)
    if(secondLine)
      secondLine.attr('transform',transStr)
  }
}

function drawLastBook(book,x,y,canvas,kerning){
   drawBook(book,x,y,canvas,-13,kerning)
}

function init(){
  for(var i=1;i<4;i++){// iterate over three graphs
    document.getElementById('test-'+i+'-width').addEventListener('change',refresh)
    document.getElementById('test-'+i+'-height').addEventListener('change',refresh)
  }
  document.getElementById('button-draw').addEventListener('click',refresh)
  refresh()
}

function refresh(){
  createGraph()
}
