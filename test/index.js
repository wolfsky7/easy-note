var EasyNote=require('../index')
var fs=require('fs')

fs.readFile('./test/test1.js','utf8',(err,con)=>{
  let rs=EasyNote(con)
  console.log(rs)
})

fs.readFile('./test/test2.js','utf8',(err,con)=>{
  let rs=EasyNote(con,{
  funcSingleRegex:[/\/\*[\w\W]+?\*\/[\w\W]*?router\.[\w\W]*?\([\w\W]*?,/],
    getFunName:str=>{
      let method=/\.[\w\W]*?\(/.exec(str);
      if(method){
        method=method[0].slice(1,-1)
      }
      else{
        method=''
      }
      let action=str.replace(/[\w\W]*?\(/,'').replace(/['",]/,'').trim();
      return method+'-'+action
    }
  })
  console.log(rs)
})
