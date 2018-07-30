/**简单的注释匹配
 * Created by wolfs on 2016/10/18.
 */
/*
* @return
* @title
* @desc
* @[]
* @funcs
* @desc
* @params[]
* @key
* @note*/
var defaults={
    noteRegex:/\/\*[\w\W]+?\*\//,//注释
    funcSingleRegex:[/\/\*[\w\W]+?\*\/[\w\W]*?this\.[^\n]+?function/g,/\/\*[\w\W]+?\*\/[\w\W]*?\.prototype\.[^\n]*?function/g],//实例函数
    getFunName:con=>(con=con.substr(0,con.length-8).replace("=","").trim(),con.substr(con.lastIndexOf(".")+1)),
    propertyRegex:/@\w*?( |$)/
}

class ParseNote{
    constructor(opts){
        this.config=Object.assign({},defaults,opts)
    }

    parseFile(content){
        var rs={
            __title:{},
        }
    
        //读取文件描述
        var title=this.config.noteRegex.exec(content);
        if(title){
            content=content.substr(title[0].length);
    
            rs.__title=this.parseNote(title[0]);
        }
    
        //functions
        var r=null;
        for(var a in this.config.funcSingleRegex){
            r=this.config.funcSingleRegex[a];
            var funcs=r.exec(content);
            let s=content;
            while(funcs){
                var con=funcs[0];
                s=s.substr(funcs.index+funcs.length)
                con=con.substr(con.lastIndexOf('/*'));
                let desc=this.config.noteRegex.exec(con)
                if(desc) rs[this.config.getFunName(con)]=this.parseNote(desc[0]);
                funcs=r.exec(s);
            }
        }
        return rs;
    }

    parseNote(con){
         //
        //从最后一个/* 开始计算
        var index=con.lastIndexOf('/*');
        // while(rs){
        //     index=rs.index;
        //     bc=bc.substr(index);
        //     rs=r.exec(bc)
        // }
        con=con.substr(index);
        con=con.substr(2,con.length-4);
        var lines=con.split("\n"),rs={'__title':''},line,key,lastKey="__title",objStack=[],lastCount=0;
        for(var a in lines){
            let {line,count}=this.parseNoteLine(lines[a]);
            if(!line)
                continue;
            key=defaults.propertyRegex.exec(line);
            if(key)
            {
                let l1=line.substr(key[0].length).trim();
                key=key[0].trim().replace('@','');

                if(!count){
                    rs[key]={
                        _text:l1,
                    }
                    objStack=[rs[key]]
                }
                else{
                    if(objStack.length){
                        objStack.slice(-1)[key]={
                            _text:l1
                        }
                    }
                }

                lastCount=count;
                if(l1){
                   
                }
                else{
                    rs[lastKey]={}
                    
                }
                if(count){
                    objStack.slice(-1)[lastKey]=l1;
                }
            }
            else{
                if(lastKey){
                    rs[lastKey] +="\n"+line;
                }
            }

        }
        return rs;
    }

    parseNoteLine(line){
        line=(line||'').trim();
    if(line[0]=="*")
        line=line.substr(1);
    // 找出tab 个数  实现嵌套
    var i=0,len=line.length,count=0;
    while(i<len){
        if(line[i++]=="\t")count++;
        else break;
    }

    return {line:line.trim(),count:count};

    }
}


const fun=function (con,opts){
    return new ParseNote(opts).parseFile(con)
}

fun.ParseNote=ParseNote;

module.exports=fun;