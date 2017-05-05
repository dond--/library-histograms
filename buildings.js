"use strict"
var w3colors=["black","blue","blueviolet","brown","cadetblue","cornflowerblue","darkblue","darkcyan","darkgoldenrod","darkgreen","darkmagenta","darkolivegreen","darkorchid","darkred","darkslategray","darkviolet","dimgray","firebrick","forestgreen","gray","indigo","maroon","midnightblue","navy","purple","saddlebrown","slategray","steelblue"]

function clearElement(id){
  var gD=document.getElementById(id)
  while(gD.hasChildNodes())
    gD.removeChild(gD.childNodes[0])
}

// constructs house sketch
function drawHouse(g,c,t,o){
  var scale=50
  var group=g.append('svg:g').attr('stroke',c)
  var parts=[]
  parts.push(svgHouse({x:0,y:250},scale))
  parts.push(svgWindow({x:75,y:150},scale))
  var filled=[]
  filled.push(svgChimney({x:175,y:50},scale))
  filled.push(svgRoof({x:1,y:125},scale-2))
  filled.push(svgDoor({x:150,y:250},scale))
  var tiny=[]
  tiny.push(svgCurls({x:75,y:150},scale))
  var empty=[]
  empty.push('M169 200 H172')// door handle

  for(var i=0;i<parts.length;i++)
    group.append('svg:path').attr('d',parts[i]).attr('stroke-width',8).attr('fill',c).attr('fill','transparent')
  for(i=0;i<filled.length;i++)
    group.append('svg:path').attr('d',filled[i]).attr('stroke-width',8).attr('fill',c)
  for(i=0;i<tiny.length;i++)
    group.append('svg:path').attr('d',tiny[i]).attr('stroke-width',2).attr('fill','transparent')
  for(i=0;i<empty.length;i++)
    group.append('svg:path').attr('d',empty[i]).attr('stroke-width',3).attr('stroke','white').attr('fill','transparent')

  group.attr('transform',t)
  group.attr('opacity',o)
}

function init(){
  document.getElementById('button-draw').addEventListener('click',refresh)
  refresh()
}

function initHistogram(){
  document.getElementById('button-draw').addEventListener('click',refreshHistogram)
  refreshHistogram()
}

// draws actual graph
function refresh(){
  clearElement('graph')
  var g=d3.select('#graph').append('svg:svg').attr('width',750).attr('height',750)
  var x=0,y=0
  var data=[{n:343,c:'red',t:'closed',x:180,y:200},{n:174,c:'darkgreen',t:'community',x:100,y:460},{n:58,c:'navy',t:'private',x:210,y:550},{n:50,c:'orange',t:'new',x:250,y:610},{n:111,c:'magenta',t:'to be closed 2017',x:10,y:710}]
  var tY=0
  for(var i=0;i<data.length;i++){
    tY=y*30
    for(var j=0;j<data[i].n;j++){
      if(x>29){
        x=0
        y++
      }
      drawHouse(g,data[i].c,'translate('+x*25+' '+y*30+')scale(0.1)',.4)
      x++
    }
    g.append('svg:text').append('svg:tspan').attr('font-family','Helvetica').attr('font-size',(data[i].n>100?72:50)).attr('font-weight','bold').attr('fill',data[i].c).text(data[i].n+' '+data[i].t).attr('x',data[i].x).attr('y',data[i].y)
  }
}

// construct houses histogram
function refreshHistogram(){
  clearElement('graph')
  var counts=[{c:21,y:'2010',t:'4 290'},{c:19,y:'2016',t:'3 765'}]
  var g=d3.select('#graph').append('svg:svg').attr('width',950).attr('height',400)

  var h=30
  var dy=10
  g.append('svg:text').attr('font-family','Helvetica').attr('font-size',24).text(counts[0].y).attr('x',0).attr('y',h)
  var dx=generateHistogram(g,counts[0].c,0)
  g.append('svg:text').attr('font-family','Helvetica').attr('font-size',24).text(counts[0].t).attr('x',dx+h/2).attr('y',h)
  dy+=h+10
  g.append('svg:text').attr('font-family','Helvetica').attr('font-size',24).text(counts[1].y).attr('x',0).attr('y',5*h/2)
  generateHistogram(g,counts[1].c,dy)
  g.append('svg:text').attr('font-family','Helvetica').attr('font-size',24).text(counts[1].t).attr('x',dx+h/2).attr('y',5*h/2)
}

// pushes one house after another
function generateHistogram(g,count,y){
  var sumX=70
  for(var i=0;i<count;i++){
    var c=w3colors[Math.floor(Math.random()*w3colors.length)]
    drawHouse(g,c,'translate('+sumX+' '+y+')scale(0.15)',1)
    sumX+=37
  }
  return sumX
}

// SVG path
function svgChimney(p,s){
  var retStr='M'+p.x+' '+(p.y+s/8)+' V'+(p.y-s/2)+' H'+(p.x+s/4)+' V'+(p.y+s/2)
  return retStr
}

// SVG path
function svgDoor(p,s){
  var retStr='M'+p.x+' '+p.y+' V'+(p.y-2*s)+' H'+(p.x+s/2)+' V'+p.y
  return retStr
}

// SVG path
function svgHouse(p,s){
  var retStr='M'+(p.x+s/3)+' '+p.y+' H'+(p.x+14*s/3)+' M'+(p.x+s)+' '+(p.y-3*s)+' V'+p.y+' M'+(p.x+4*s)+' '+(p.y-3*s)+' V'+p.y
  return retStr
}

// SVG path
function svgRoof(p,s){
  var retStr='M'+p.x+' '+p.y+' L'+(p.x+2.5*s)+' '+(p.y-2.5*s)+' L'+(p.x+5*s)+' '+p.y
  return retStr
}

// SVG path
function svgWindow(p,s){
  var x=p.x
  var y=p.y
  var dx=Math.round(s/5)
  var dy=Math.round(s/7)

  var retStr='M'+x+' '+(y+dy)+' V'+y+' C'+(x+dx)+' '+(y-dy)
  x+=s/2
  retStr+=','+(x-dx)+' '+(y-dy)+','+x+' '+y+' C'+(x+dx)+' '+(y-dy)
  x+=s/2
  retStr+=','+(x-dx)+' '+(y-dy)+' '+x+' '+y
  y+=4*s/5
  retStr+=' V'+y+' C'+(x-dx)+' '+(y-dy)
  x-=s/2
  retStr+=','+(x+dx)+' '+(y-dy)+','+x+' '+y+' C'+(x-dx)+' '+(y-dy)
  x-=s/2
  retStr+=','+(x+dx)+' '+(y-dy)+','+x+' '+y+' V'+p.y
  return retStr
}

// SVG path for window small arcs
function svgCurls(p,s){
  var x=p.x
  var y=p.y
  var dx=Math.round(s/5)
  var dy=Math.round(s/7)
  var mx=3

  var retStr=''
  for(var i=1;i<4;i++){
    y+=s/5
    retStr+='M'+(x+mx)+' '+y
    retStr+=' C'+(x+dx)+' '+(y-dy)
    x+=s/2
    retStr+=','+(x-dx)+' '+(y-dy)+','+x+' '+y+' C'+(x+dx)+' '+(y-dy)
    x+=s/2
    retStr+=','+(x-dx)+' '+(y-dy)+' '+(x-mx)+' '+y+' '
    x=p.x
  }
  return retStr
}
