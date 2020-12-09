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

                    for (i in myposts){
                        
                        let post = createElement('div',null,'posts',null);
                        let contents = createElement('p',null,null,String(myposts[i]["contents"]));
                        let date_and_time = createElement('p',null,null,String(new Date(myposts[i]["date_and_time"])));     
                        let num_of_likes = createElement('p',null,null,String(myposts[i]["num_of_likes"]));
                        


                        hr = createElement('hr','hr_divide_heading',null,null);
                        
                        appendChild(parent = post,contents,date_and_time,num_of_likes,hr);
                        appendChild(parent =display,post);

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
                        let whotofollow = createElement('div',null,key,null)
                        for (i = 0; i<networks.length; i++){
                        
                            let username = createElement('p',null,null,String(networks[i]["username"]))
                            
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
                            
                    
                            let hr = createElement('hr','hr_divide_heading',null,null,null)

                            appendChild(parent =whotofollow,username,form,hr);  
                            appendChild(parent =display,whotofollow);
                            
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

                        let post = createElement('div',null,'posts',null);
                        let contents = createElement('p',null,null,String(posts[i]["contents"]));
                        let date_and_time = createElement('p',null,null,String(new Date(posts[i]["date_and_time"])));     
                        let num_of_likes = createElement('p',null,null,String(posts[i]["num_of_likes"]));
                        hr = createElement('hr','hr_divide_heading',null,null);
                        
                        appendChild(parent = post,contents,date_and_time,num_of_likes,hr);
                        appendChild(parent =display,post);

                    }
                    //show no like message
                    if (posts.length == 0){
                        let post = createElement('div',null,'posts',null);
                        let contents = createElement('p',null,null,"You have not yet liked any posts");
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
        document.querySelectorAll('button').forEach(button =>{
            button.onclick = function(){
                let section = this.dataset.section
                window.history.pushState({section:section},"",`${section}`);
                showSection(section);

                var current = document.getElementsByClassName("active");    
                
                current[0].className = current[0].className.replace("active", "");
                this.className ="active";

                
 

                
            };
        
            
        });     


    });
