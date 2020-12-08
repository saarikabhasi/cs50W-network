
//update like feature
function updatelike(ele){
        
    post_id = parseInt(ele.value)
    
    fetch(`like/${post_id}`)
    .then(response => response.text())
    .then(text => {

        result = JSON.parse(text)
        element = ele.querySelector(".fa-heart")
    
        id = `#num_likes_${post_id}`
        if (result["type"] === "add"){
            
            //red if liked by user
            element.style.color = "red";
            
        }
        if (result["type"] === "remove"){
             //white if not liked by user
            element.style.color = "white";
            
        }
        
        document.querySelector(id).innerHTML=result["num_of_likes"]

    })
        
    
        
}
likefeature();
function likefeature(){
    document.querySelectorAll("#like").forEach( e=> {

        e.onclick = function(){
    
            updatelike(this)
        }
    });
}

var likebutton = 0,editbutton = 0


function save_btns (id){
    //save like and edit button to display after editing the the post
    parent  = document.getElementById(id)
    likebutton = parent.querySelectorAll("#like")
    editbutton = parent.querySelectorAll("#edit")
    
    return 1
}

function edit_post(postId,post_username){
    
    id = `eachpost_${postId}`
    
    if (save_btns (id)){
        
        display = createElement('div',null,null,null);

        fetch(`editpost/${postId}`)
        .then(response =>response.text())
        .then(text =>{
            
            result = JSON.parse(text)
            content = result["contents"]
        
            let onclick = `save_post(${postId},"${post_username}")`
            console.log("click",onclick)
            let user_id = createElement('h5',null,"post_userid",String(`${post_username}`));

            var textArea =  createTextarea("10","60",`textarea_${postId}`,"editpost",content,null)
            var submitbutton = createElement('span',null,null,'<input type= "submit" id ="savepost" name = "btn" onclick='+onclick+'>')

            appendChild(parent = display,user_id,textArea,submitbutton)

            document.getElementById(`eachpost_${postId}`).innerHTML = display.innerHTML
            console.log("new",document.getElementById(`eachpost_${postId}`))

        
        })
    }

}

function save_post(postId,post_username){
    console.log("save post")
    
    textarea = document.getElementById(`textarea_${postId}`)
    content =textarea.value
    if (content == ''){
        return
    }
    id = `eachpost_${postId}`
    parent = document.getElementById(id) 
    
    
    parent.querySelectorAll(`#textarea_${postId}`)[0].style.display = "none"
    


    post_div = createElement('div',null,id,null);

    //display = createElement('div',null,null,null);
    
    fetch(`savepost/${postId}/${content}`)
    
        .then(response =>response.text())
    
            .then(text =>{
            
                result = JSON.parse(text)
                console.log("text",result)

                
                const keys = ["result"]
                keys.forEach(key=>{

                    changed_post = result[key]
                    
                    for (i in changed_post){
                        
                        let user_id = createElement('h5',null,"post_userid",String(`${post_username}`));
                        
                        let contents = createElement('p',null,"post_content",String(changed_post[i]["contents"]));
                        let date_and_time = createElement('p',null,"post_dateandtime",String(new Date(changed_post[i]["date_and_time"])));     
                        let num_of_likes = createElement('p',null,`num_likes_${postId}`,String(changed_post[i]["num_of_likes"]));
                        
                        appendChild(parent = post_div,user_id,contents,date_and_time,num_of_likes,likebutton[0],editbutton[0]);
                        
                    }
                
            })


            
            document.getElementById(id).innerHTML  = post_div.innerHTML
            //implement like feature to new posts
            likefeature();
        })
            
}






