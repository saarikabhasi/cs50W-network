function formCrsf(){

    var crsf = document.createElement("input");
    crsf.setAttribute("type","hidden");
    crsf.setAttribute("name","csrfmiddlewaretoken");
    crsf.setAttribute("value",csrfToken);
    console.log("crsf",csrfToken);

    return crsf
}

function createElement(tag,className,idName,content){

    element = document.createElement(tag);

    if (className){element.className = className;}
    if (idName){element.id = idName;}
    if (content){element.innerHTML = content;}

    return element;

}

function createForm(method,action){

    element = document.createElement("form");
    element.setAttribute('method',method);
    element.setAttribute('action',action);

    return element
}
function appendChild(parent,...args){

    for (let i =0 ;i<args.length;i++){
        parent.appendChild(args[i]); 
    }
 
    return parent
}