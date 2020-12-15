// header file used by other javascript file
function formCrsf(){
    //csrf
    var crsf = document.createElement("input");
    crsf.setAttribute("type","hidden");
    crsf.setAttribute("name","csrfmiddlewaretoken");
    crsf.setAttribute("value",csrfToken);
    

    return crsf
}

function createElement(tag,className,idName,content){
    //createElement
    element = document.createElement(tag);

    if (className){element.className = className;}
    if (idName){element.id = idName;}
    if (content){element.innerHTML = content;}

    return element;

}

function createForm(method,action,onsubmit,id){
    //form

    element = document.createElement("form");
    if (method){element.setAttribute('method',method);}
    if (action){element.setAttribute('action',action);}
    if (onsubmit){element.setAttribute('onsubmit',onsubmit);}
    if (id) {element.setAttribute('id',id)}
  

    return element
}

function createButton(type,idName,className,name,value,content){
    //button

    element = document.createElement("button")
    if (type){element.type = type;}
    if (className){element.className = className;}
    if (idName){element.id = idName;}
    if (name){element.name = name;}
    if (value){element.value = value;}
    if (content){element.innerHTML = content;}

    return element
}

function createTextarea(rows,cols,id,name,content,form){
    //textarea
    element = document.createElement("textarea")
    if (rows){element.rows = rows;}
    if (cols){element.cols = cols;}
    if (id){element.id = id;}
    if (name){element.name = name;}
    if (form){element.form = form;}
    if (content){element.innerHTML = content;}
    if (form){element.form = form;}
    return element
}
function appendChild(parent,...args){
    //appendchild
    for (let i =0 ;i<args.length;i++){
        parent.appendChild(args[i]); 
    }
 
    return parent
}
