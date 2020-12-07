







//like feature
function updatelike(ele){
                
    post_id = parseInt(ele.value)
    
    fetch(`like/${post_id}`)
    .then(response => response.text())
    .then(text => {
    result = JSON.parse(text)

    
    element = ele.querySelector(".fa-heart")
    id = `#num_likes_${post_id}`
    if (result["type"] === "add"){
        
        
        element.style.color = "red";
        
    }
    if (result["type"] === "remove"){
        
        element.style.color = "white";
        
    }
        
    document.querySelector(id).innerHTML=result["num_of_likes"]

        })
    

    
}
//like feature
document.querySelectorAll("#like").forEach( e=> {

    e.onclick = function(){
        
        updatelike(this)
    }
        
});

