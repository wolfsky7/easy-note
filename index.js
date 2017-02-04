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
    propertyRegex:/@\w*?( |$)/
}

function parseFile(content){
    var rs={
        __title:{},

    }

    //读取文件描述
    var title=defaults.noteRegex.exec(content);
    if(title){
        content=content.substr(title[0].length);

        rs.__title=parseNote(title[0]);
    }

    //functions
    var r=null;
    for(var a in defaults.funcSingleRegex){
        r=defaults.funcSingleRegex[a];
        var funcs=r.exec(content);
        while(funcs){
            var con=funcs[0];
            con=con.substr(con.lastIndexOf('/*'));
            rs[getFunName(con)]=parseNote(defaults.noteRegex.exec(con)[0]);
            funcs=r.exec(content);
        }
    }
    return rs;
}

function getFunName(con){
    return con=con.substr(0,con.length-8).replace("=","").trim(),con.substr(con.lastIndexOf(".")+1);
}

function parseNote(con){
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
    var lines=con.split("\n"),rs={},line,key,lastKey;
    for(var a in lines){
        line=parseNoteLine(lines[a]);
        if(!line)
            continue;
        key=defaults.propertyRegex.exec(line);
        if(key)
        {
            lastKey=key[0].trim().replace('@','');
            rs[lastKey]=line.substr(key[0].length).trim();
        }
        else{
            if(lastKey){
                rs[lastKey] +="\n"+line;
            }
            else{
                rs['__title'] =line;
            }
        }

    }
    return rs;
}

function parseNoteLine(line){
    line=(line||'').trim();
    if(line[0]=="*")
        line=line.substr(1);
    return line.trim();

}


module.exports=parseFile;