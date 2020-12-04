function updatelike(ele){
    console.log("js :updatelike")
    console.log(ele.querySelector(".fa-heart"))

    post_id = parseInt(ele.dataset.section)
    console.log(post_id)
    

    fetch(`like/${post_id}`)
    .then(response => response.text())
    .then(text => {
        console.log("click",text)
        element = ele.querySelector(".fa-heart")
        if (text === "add"){
            
            console.log("change to red") 
            element.style.color = "red";
        }
        if (text === "remove"){
            console.log("change to white")
            element.style.color = "rgb(214, 214, 214);";
        }

    })
            

           
}

