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
            element.style.color = "#f7786b";
            
        }
        if (result["type"] === "remove"){
             //white if post not liked by other user
            element.style.color = "#f0efef"
            
        }
        
        document.querySelector(id).innerHTML=result["num_of_likes"] +" like(s)"

    })
        
    
        
}

document.addEventListener('DOMContentLoaded',function(){
    // call likefeature function when page is loaded 
   
    likefeature();
})
    
    
    





function likefeature(){

    //call updatelike whenever like button is click
    document.querySelectorAll("#like").forEach( e=> {
        
        e.onclick = function(){

            updatelike(this)
        }
    });
}

var likebutton = 0,editbutton = 0




function edit_post(postId,post_username){
    // edit post
    id = `eachpost_${postId}`
        
    display = createElement('div',null,null,null);

    fetch(`editpost/${postId}`)
    .then(response =>response.text())
    .then(text =>{
        
        result = JSON.parse(text)
        content = result["contents"]
    
        let onclickfunc = `save_post(${postId})`

        let user_id = createElement('h5',null,"post_userid",String(`${post_username}`));
        var textArea =  createTextarea("10","60",`textarea_${postId}`,"editpost",content,null)
        var submitbutton = createElement('span',null,null,'<input type= "submit" id ="savepost" name = "btn" onclick='+onclickfunc+'>')

        appendChild(parent = display,user_id,textArea,submitbutton)

        document.getElementById(`eachpost_${postId}`).innerHTML = display.innerHTML
            

        
        })
    

}

function save_post(postId){
    // save post with new content
    
    textarea = document.getElementById(`textarea_${postId}`)
    content =textarea.value
    if (content == ''){
        return
    }
    id = `eachpost_${postId}`
    
    textarea.remove()


    display = createElement('div',null,null,null);

    
    fetch(`savepost/${postId}/${content}`)
    
        .then(response =>response.text())
    
            .then(text =>{
            
                result = JSON.parse(text)
                console.log(result)
                const keys = ["result"]
                keys.forEach(key=>{

                    changed_post = result[key]
                    
                    for (i in changed_post){


                        
                        display = setup_post_groups(changed_post[i],result,display,cardCreated =true)

                    }
                
            })
            
            

           
            document.getElementById(id).innerHTML  = display.innerHTML
            //add like feature to new posts
            likefeature();
        })
            
}
function delete_post(post_id){
    
    id = `eachpost_${post_id}`
    postDiv = document.getElementById(id)
    fetch(`deletepost/${post_id}`)
    .then(response =>{
        if (!response.ok){
            throw new Error('problem with delete the post');
        }
        else{
            
            postDiv.remove();
        }
    })
}
        


