"use strict"
var w3colors=["black","blue","blueviolet","brown","cadetblue","cornflowerblue","darkblue","darkcyan","darkgoldenrod","darkgreen","darkmagenta","darkolivegreen","darkorchid","darkred","darkslategray","darkviolet","dimgray","firebrick","forestgreen","gray","indigo","maroon","midnightblue","navy","purple","saddlebrown","slategray","steelblue"]

function clearElement(id){
  var gD=document.getElementById(id)
  while(gD.hasChildNodes())
    gD.removeChild(gD.childNodes[0])
}

// constructs polyline for female
function drawFemaleFigure(node,pos,h,darker){
  var xMax=h/3
  var D=xMax*.9
  var x=[xMax/2,xMax/2,0,xMax/2,xMax/2,xMax*.1,xMax*.3,xMax*.13,xMax*.3,xMax*.7,xMax*.8,xMax*.7,xMax*.9,xMax/2,xMax/2,xMax]
  var y=[xMax*.95,5*D/4,7*D/4,5*D/4,1.7*D,2.5*D,2.5*D,3*D,2.5*D,2.5*D,3*D,2.5*D,2.5*D,1.7*D,5*D/4,6.8*D/4]
  drawFigure(node,xMax,x,y,D,pos.x,pos.y,darker)
}

// draws figure according to polyline data
function drawFigure(node,xMax,x,y,D,dx,dy,darker){
  var width=xMax
  var height=3*xMax
  var tranStr='translate('+dx+','+dy+')'

  var polyStr=''
  for(var i=0;i<x.length;i++)
    polyStr+=x[i]+','+y[i]+' '
//   console.log(polyStr)
  var color=d3.color(w3colors[Math.floor(Math.random()*w3colors.length)])
  if(darker)
    color=color.darker()
  node.append('svg:polyline').attr('points',polyStr).attr('stroke-width',2).attr('stroke',color).attr('fill','none').attr('transform',tranStr)
  node.append('svg:circle').attr('cx',xMax/2).attr('cy',xMax/2).attr('r',D/2).attr('stroke-width',2.2).attr('stroke',color).attr('fill','none').attr('transform',tranStr)
}

// constructs polyline for male
function drawMaleFigure(node,pos,h,darker){
  var xMax=h/3
  var D=xMax*.9
  var x=[xMax/2,xMax/2,0,xMax/2,xMax/2,xMax*.03,xMax/2,xMax*.9,xMax/2,xMax/2,xMax]
  var y=[xMax*.95,5*D/4,7*D/4,5*D/4,2*D,3*D,2*D,3*D,2*D,5*D/4,6.8*D/4]
  drawFigure(node,xMax,x,y,D,pos.x,pos.y,darker)
}

// creates histogram filled with figures
function generateFigures(node,h,count,gcd,dy,darker){
  var sumX=55
  var figCount=count/gcd
  for(var i=0;i<figCount;i++){
    var dh=Math.random()*h*.15// vary figures in height
    if(i%2)
      drawMaleFigure(node,{x:sumX,y:dy+dh},h-dh,darker)
    else
      drawFemaleFigure(node,{x:sumX,y:dy+dh},h-dh,darker)
    sumX+=h/3+2
  }
}

function init(){
  document.getElementById('button-draw').addEventListener('click',refresh)
  refresh()
}

function refresh(){
  var counts=[[164,60,'Harrow'],
    [420,165,'Sheffield'],
    [137,58,'Doncaster'],
    [137,58,'Sefton'],
    [66,33,'Isle of Wight'],
    [113,54,'Hammersmith & Fulham']]
  var gcd=15
  var h=50

  clearElement('graph')
  var graphDiv=d3.select('#graph').append('svg:svg').attr('width',2000).attr('height',2000)

  // draw six pairs of histogram data
  var dy=10
  for(var i=0;i<counts.length;i++){
    generateFigures(graphDiv,h,counts[i][0],gcd,dy,true)
    dy+=h+10
    graphDiv.append('svg:text').attr('font-family','Helvetica').attr('font-size',12).text(counts[i][2]).attr('x',0).attr('y',dy)
    generateFigures(graphDiv,h,counts[i][1],gcd,dy,false)
    dy+=h+30
  }
}
