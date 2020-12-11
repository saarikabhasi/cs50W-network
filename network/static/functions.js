//RESULT
function setup_result(display){
    //setup dom element display to result 
    document.querySelector("#result").innerHTML = display.innerHTML;
}

//MYPOSTs and MYLIKES
function setup_post_groups(val,result="",display){

    user_id = val["id"]
  
    post_content = val["contents"]
    post_date_and_time = val["date_and_time"]
    number_of_likes = val["num_of_likes"]

    var post_username = username
    let edit_button = null

    let card =createElement('div',"card",`eachpost_${user_id}`,null);
    let span = createElement('span',null,null,null);


    
 
    if ("user_id_id" in val && "post_liked_user_id_and_username" in result){
        //only for mylikes 
        if (val["user_id_id"] in result["post_liked_user_id_and_username"]){
            post_username = result["post_liked_user_id_and_username"][val["user_id_id"]]
        } 
        else{
            post_username = ""
        }
    }


    
    
    if (post_username.toLowerCase() == username.toLowerCase()){
        
        edit_button = createButton('submit','edit',null,"edit",user_id,'<i class="fa fa-edit" style = "color:#f7786b"></i>')
        edit_button.setAttribute('onclick',`edit_post(${user_id},"${post_username}")`)
        
    }

    let poster = createElement('h2',"card-title","post_userid",null);
    poster.innerHTML = post_username
        

        
    
        
       
    

  
    
   
    let post = createElement('h3',null,"post_content",String(post_content));
    let Date_time = createElement('h4',null,"post_dateandtime",String(new Date(post_date_and_time)));     
    let like_count = createElement('h4',null,`num_likes_${user_id}`,`${String(number_of_likes)} like(s)`);
    
    let likebutton =0
    if ((parseInt (number_of_likes)> 0 ) && (result["post_liked_ids"].length >0) && (result["post_liked_ids"].includes(user_id))){
        likebutton = createButton(null,"like",null,null,user_id,'<i class="fa fa-heart" style = "color:#f7786b">') 
        
    } 
    else{
        likebutton = createButton(null,"like",null,null,user_id,'<i class="fa fa-heart" style = "color:#b0aac0">') 
    }              

    
    if(edit_button){
        appendChild(parent = span,edit_button,poster,post,Date_time,like_count,likebutton);
    }
    else{
        appendChild(parent = span,poster,post,Date_time,like_count,likebutton);
    }
    
    appendChild(parent = card,span);
    
    appendChild(parent =display,card);
    return display
}

// NETWORK

function setup_network_groups(val,result="",section="",display){
   //to setup network divs
       
    user_id = val["id"]
    let loc = "/network/connect"           
    var following = '<input type= "hidden" class="btn btn-primary" name = "change"  value =' + user_id +' /> <input type= "submit" class="btn btn-primary"  name = "btn"  value =  following />'
    var follow = '<input type= "hidden" class="btn btn-primary" name = "change"  value =' + user_id +' /> <input type= "submit"  class="btn btn-primary" name = "btn"  value =  follow />'
    
    let divFlex =createElement('div','flex-container',null,null);

    let divUsername =createElement('div','username',null,null);
    let h2Username = createElement('h2',null,"post_userid",String(val["username"]))
    appendChild(parent = divUsername,h2Username)

    let divForm=createElement('div','form',null,null);

    var form = createForm("post",loc)
    var crsf = formCrsf();
    var togglebutton = createElement('span','form',null,null)
    appendChild(parent=form,crsf,togglebutton)

    let hr = createElement('hr','hr_divide_heading',null,null,null)

            
    //unfollow
    if (section === "following"){
        togglebutton.innerHTML = following
        
    }
    //followers
    if (section === "followers"){

        
        if ( typeof result["following_back"] == "number" || result["following_back"].length<=0){
            // user doesnt follow any of followers so follow all 
            togglebutton.innerHTML = follow
            
        }

        for (let j=0;j<result["following_back"].length;j++){
            // unfollow if user does not follow these followers back
            if(user_id == result["following_back"][j]["id"]){
                //following
                togglebutton.innerHTML = following
            }
            else{
                //follow
                togglebutton.innerHTML = follow
            }

        }
        
        
        
    }
    //suggestions
    if (section === "suggestions"){
        //follow 
        togglebutton.innerHTML = follow
    }


            
    appendChild(parent=divForm,form)
    appendChild(parent= divFlex,divUsername,divForm)
    
    appendChild(parent=display,divFlex,hr)

    return display

}

function setup_message_groups(message,key,display){
    //setup not found message
    let div =createElement('div',null,null,null);
    let span = createElement('span',null,null,null);
    
    let username = createElement('h2',"notfound text-center",null,`${message[key]}`)
    appendChild(parent =div,span,username )
    appendChild(parent =display,div);
    return display
}


function setup_connect_to_networks_button(){
    //change connection status when button is clicked
    document.querySelectorAll('#change').forEach(e =>{
            
        e.onclick = function(){
            const value = e.value
            connect(value);
            
        };
        
        
    });
}

function setup_color_for_following_buttons(){
    //change button background color if user is following
    document.querySelectorAll("input.btn-primary").forEach(e =>{
            
        if(e.value == "following"){
            e.style.backgroundColor = "rgb(8, 154, 202)";
        }
    })
}