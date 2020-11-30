function form_crsf(){
    var crsf = document.createElement("input");
    crsf.setAttribute("type","hidden");
    crsf.setAttribute("name","csrfmiddlewaretoken");
    crsf.setAttribute("value",csrfToken);
    console.log("crsf",csrfToken)
}