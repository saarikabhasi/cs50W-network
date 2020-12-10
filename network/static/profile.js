   // save section when back button is clicked
    window.onpopstate = function(event) {
      
        showSection(event.state.section);
    }
    
    function showSection(section){
        //Show section
       // Find section contents from server

    
       if (document.location.pathname.includes("profile") ){
           path = `${username}/${section}`
       }
        else{
            path = `profile/${username}/${section}`
        }
        fetch(path)
        .then(response => response.text())   
        .then(text => {
            /* 
            section : 
                1 display my posts
                2 display networks
                3 display all liked posts 
            */

            var result = JSON.parse(text);
            display = createElement('div',null,null,null);
            

            if (section == "myposts"){
            
                const keys = ["myposts"]
            
                keys.forEach(key=>{
     

                    myposts = result[key]
                  
                    if (myposts.length>0){
                        for (i in myposts){
                            
                            
                            let card =createElement('div',"card",`eachpost_${myposts[i]["id"]}`,null);
                            let span = createElement('span',null,null,null);

                            let edit_button = createButton('submit','edit',null,"edit",myposts[i]["id"],'<i class="fa fa-edit" style = "color:#f7786b"></i>')
                            edit_button.setAttribute('onclick',`edit_post(${myposts[i]["id"]},"${username}")`)
                            
                            let poster = createElement('h2',"card-title","post_userid",`${username}`);
                            let contents = createElement('h3',null,"post_content",String(myposts[i]["contents"]));
                            let date_and_time = createElement('h4',null,"post_dateandtime",String(new Date(myposts[i]["date_and_time"])));     
                            let num_of_likes = createElement('h4',null,`num_likes_${myposts[i]["id"]}`,`${String(myposts[i]["num_of_likes"])} like(s)`);
                            let likebutton =0
                            
                            if ((parseInt (myposts[i]["num_of_likes"])> 0 ) && (result["post_liked_ids"].length >0) && (result["post_liked_ids"].includes(myposts[i]["id"]))){
                                likebutton = createButton(null,"like",null,null,myposts[i]["id"],'<i class="fa fa-heart" style = "color:#f7786b">') 
                                
                            } 
                            else{
                                likebutton = createButton(null,"like",null,null,myposts[i]["id"],'<i class="fa fa-heart" style = "color:#b0aac0">') 
                            }              
                        


                            appendChild(parent = span,edit_button,poster,contents,date_and_time,num_of_likes,likebutton);
                            appendChild(parent = card,span);
                            appendChild(parent =display,card);
                            }
                    }
                    else{
                     
                        let card =createElement('div',"card",null,null);
                        let postMessage = createElement('h2',"notfound text-center",null,`You have not made any posts`);
                        appendChild(parent = card,postMessage)
                        appendChild(parent = display,card)
                    }

                    
                })
                
            }   
            //work more on network button
            if (section == "networks"){
                //networks

                const keys = ["user_currently_follows","user_can_follow"]

                keys.forEach (key=>{
                    networks= result[key]
                    if (networks){
                        // let whotofollow = createElement('div',null,key,null)
                        for (i = 0; i<networks.length; i++){
                            let card =createElement('div',"card",null,null);
                            let span = createElement('span',null,null,null);
                            let username = createElement('h2',"card-title","post_userid",String(networks[i]["username"]))

                            inc = networks[i]["id"]
    
                        

                            let loc = "/network/connect"
                            var form = createForm("post",loc)
                            var crsf = formCrsf();
    
                            if (key === "user_currently_follows"){

                                var togglebutton = createElement('span',null,null,'<input type= "hidden"  name = "change"  value =' + inc +' /> <input type= "submit"  name = "btn"  value =  unfollow />')
                            }
                            else{
                                
                                var togglebutton = createElement('span',null,null,'<input type= "hidden"  name = "change"  value =' + inc +' /> <input type= "submit"  name = "btn"  value =  follow />')
                            }
                            
                            appendChild(parent =form,crsf,togglebutton);
                            
                    
                            // let hr = createElement('hr','hr_divide_heading',null,null,null)
                            appendChild(parent =span,username,form )
                            //appendChild(parent =whotofollow,username,form,hr);  
                            appendChild(parent =card,span )
                            // appendChild(parent =display,whotofollow);
                            appendChild(parent =display,card);
                            
                        }
                    }
                    

                })
                
                    
                
                
                
                
    
            }
            //likes
            if (section == "likes"){
            
                const keys = ["post_liked"]

                keys.forEach(key =>{
                    posts = result[key]

                    for (i in posts){
                        // create dom for all the posts liked by user
                        

                        let card =createElement('div',"card",null,null);
                        let span = createElement('span',null,null,null);

                        let edit_button = createButton('submit','edit',null,"edit",posts[i]["id"],'<i class="fa fa-edit" style = "color:#f7786b"></i>')
                        edit_button.setAttribute('onclick',`edit_post(${posts[i]["id"]},"${username}")`)
                        
                        post_username =""

                        if (posts[i]["user_id_id"] in result["post_liked_user_id_and_username"]){
                            post_username = result["post_liked_user_id_and_username"][posts[i]["user_id_id"]]
                        }    
                        

                        let poster = createElement('h2',"card-title","post_userid",`${post_username}`);
                        let contents = createElement('h3',null,"post_content",String(posts[i]["contents"]));
                        let date_and_time = createElement('h4',null,"post_dateandtime",String(new Date(posts[i]["date_and_time"])));     
                        let num_of_likes = createElement('h4',null,`num_likes_${posts[i]["id"]}`,`${String(posts[i]["num_of_likes"])} like(s)`);
                        
                        let likebutton =0
                        
                        if ((parseInt (posts[i]["num_of_likes"])> 0 ) && (result["post_liked_ids"].length >0) && (result["post_liked_ids"].includes(posts[i]["id"]))){
                            likebutton = createButton(null,"like",null,null,posts[i]["id"],'<i class="fa fa-heart" style = "color:#f7786b">') 
                            
                        } 
                        else{
                            likebutton = createButton(null,"like",null,null,posts[i]["id"],'<i class="fa fa-heart" style = "color:#b0aac0">') 
                        }


                    
                        appendChild(parent = span,edit_button,poster,contents,date_and_time,num_of_likes,likebutton);
                        appendChild(parent = card,span);
                      
                        appendChild(parent =display,card);

                    }
                    //show no like message
                    if (posts.length == 0){
                        let post = createElement('div','card','posts',null);
                        let contents = createElement('h2',"text-center notfound",null,"No liked posts");
                        
                        appendChild(parent = post,contents);
                        appendChild(parent =display,post);
                    }

                })
                
            }
            document.querySelector("#following_count").innerHTML = `${result["following_count"]} Following`
            document.querySelector("#follower_count").innerHTML = `${result["follower_count"]} Follower`    
            document.querySelector("#result").innerHTML = display.innerHTML;   
            document.querySelectorAll('#change').forEach(e =>{
                
                e.onclick = function(){
                    const value = e.value
                    connect(value);
                    
                };
                
                
            });
            document.querySelectorAll("#like").forEach( e=> {
        
                e.onclick = function(){
  
                    updatelike(this)
                }
            });


    
        })
        
        
    }   

 

    window.onload = function(){

        // by default show myposts

        let section = "myposts"
        window.history.pushState({section:section},"",`${section}`);
        
        showSection("myposts");
        
        

    }
    

    document.addEventListener('DOMContentLoaded',function(){

       
        
        // Add section functionality
        document.querySelectorAll('#button').forEach(button =>{
            button.onclick = function(){
                let section = this.dataset.section
                window.history.pushState({section:section},"",`${section}`);
                showSection(section);

                var current = document.getElementsByClassName("active");    
                
                current[0].className = current[0].className.replace("nav-link active", "nav-link");
                this.className =" nav-link active";

                
 

                
            };
           
        
            
        });

        
        
    });


