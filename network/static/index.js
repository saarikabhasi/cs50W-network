/* 
1. Like feature
2. 2. edit and save post
 */


function updatelike(ele){
       //update like  
    post_id = parseInt(ele.value)
    
    fetch(`like/${post_id}`)
    .then(response => response.text())
    .then(text => {

        result = JSON.parse(text)
        element = ele.querySelector(".fa-heart")
    
        id = `#num_likes_${post_id}`

        if (result["type"] === "add"){
            
            //red if post is liked by user
            element.style.color = "red";
            
        }
        if (result["type"] === "remove"){
             //white if post not liked by other user
            element.style.color = "rgb(168, 168, 168)"
            
        }
        
        document.querySelector(id).innerHTML=result["num_of_likes"]

    })
        
    
        
}
// call likefeature function when page is loaded
likefeature();

function likefeature(){
    //call updatelike whenever like button is click
    document.querySelectorAll("#like").forEach( e=> {

        e.onclick = function(){
    
            updatelike(this)
        }
    });
}

var likebutton = 0,editbutton = 0


function save_btns (id){
    //save like and edit button after editing the the post
    parent  = document.getElementById(id)
    likebutton = parent.querySelectorAll("#like")
    editbutton = parent.querySelectorAll("#edit")
    
    return 1
}

function edit_post(postId,post_username){
    // edit post
    id = `eachpost_${postId}`
    // save the like and edit button.
    //so that after editing content, the same like and edit button could be used for post new content
    if (save_btns (id)){
        
        display = createElement('div',null,null,null);

        fetch(`editpost/${postId}`)
        .then(response =>response.text())
        .then(text =>{
            
            result = JSON.parse(text)
            content = result["contents"]
        
            let onclickfunc = `save_post(${postId},"${post_username}")`

            let user_id = createElement('h5',null,"post_userid",String(`${post_username}`));
            var textArea =  createTextarea("10","60",`textarea_${postId}`,"editpost",content,null)
            var submitbutton = createElement('span',null,null,'<input type= "submit" id ="savepost" name = "btn" onclick='+onclickfunc+'>')

            appendChild(parent = display,user_id,textArea,submitbutton)

            document.getElementById(`eachpost_${postId}`).innerHTML = display.innerHTML
            

        
        })
    }

}

function save_post(postId,post_username){
    // save post with new content
    
    textarea = document.getElementById(`textarea_${postId}`)
    content =textarea.value
    if (content == ''){
        return
    }
    id = `eachpost_${postId}`
    parent = document.getElementById(id) 
    
    parent.querySelectorAll(`#textarea_${postId}`)[0].style.display = "none"
    
    post_div = createElement('div',null,id,null);

    
    fetch(`savepost/${postId}/${content}`)
    
        .then(response =>response.text())
    
            .then(text =>{
            
                result = JSON.parse(text)
                const keys = ["result"]
                keys.forEach(key=>{

                    changed_post = result[key]
                    
                    for (i in changed_post){
                        // create dom elements to display new content
                        let user_id = createElement('h5',null,"post_userid",String(`${post_username}`));
                        
                        let contents = createElement('p',null,"post_content",String(changed_post[i]["contents"]));
                        let date_and_time = createElement('p',null,"post_dateandtime",String(new Date(changed_post[i]["date_and_time"])));     
                        let num_of_likes = createElement('p',null,`num_likes_${postId}`,String(changed_post[i]["num_of_likes"]));
                        
                        appendChild(parent = post_div,user_id,contents,date_and_time,num_of_likes,likebutton[0],editbutton[0]);
                        
                    }
                
            })


            
            document.getElementById(id).innerHTML  = post_div.innerHTML
            //add like feature to new posts
            likefeature();
        })
            
}






