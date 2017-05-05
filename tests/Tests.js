function Tests(){
  this.index=1
  this.successfull=0
  this.failed=0
  this.output=undefined
}

Tests.prototype.fail=function(e){
  this.log('[FAIL] '+e.message)
}

Tests.prototype.log=function(msg){
  if(this.output)
    this.output.innerHTML+="<br/>\n"+msg
  console.log(msg)
}

Tests.prototype.ok=function(msg){
  this.log('[OK]   '+msg)
}

Tests.prototype.setOutput=function(o){
  this.output=o
}

Tests.prototype.test=function(msg,func){
  try{
    func()
    this.ok('Test '+this.index+': '+msg)
    this.successfull++
  }catch(e){
    this.fail(e)
    this.failed++
  }
  this.index++
}

Tests.prototype.stat=function(){
  this.log('Tests run: '+(this.index-1)+', successfull: '+this.successfull+', failed: '+this.failed)
}
