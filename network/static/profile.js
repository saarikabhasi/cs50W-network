 
   // save section when back button is clicked
    window.onpopstate = function(event) {
        
        showSection(event.state.section);
    }
    
    function showSection(section){
        //Show section
       // Find section contents from server

        path = `section/${section}`
        
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
                //myposts
                var message = {"common":"No posts"}
                const keys = ["myposts"]

                section = createElement('section')
                article = createElement('article',null,"showposts")

                keys.forEach(key=>{
     
                    myposts = result[key]
                    
                    if (myposts.length>0){
                        for (i in myposts){
                            
                            display = setup_post_groups(myposts[i],result,display)
                            
                        }
                    }
                    else{
                        display = setup_message_groups(message,"common",display)

                    } 
                })
         
                appendChild(parent= article,display)
                appendChild(parent = section,article)
                display = section
                
                
            }   


            if (section =="networks"){
                //networks
                // var message = {"common":"No networks"}
                const keys = ["following","suggestions"]
                keys.forEach (key=>{
                    networks= result[key]
                    if (networks){
                        for (i = 0; i<networks.length; i++){
                            display = setup_network_groups(networks[i],null,key,display,section);
                        }
                    }
                    // else{
                    //     display = setup_message_groups(message,"common",display)
                    // }

                })
                
            }

            if (section == "likes"){
                //mylikes
                var message = {"common":"No liked posts"}
                const keys = ["post_liked"]

                section = createElement('section')
                article = createElement('article',null,"showposts")

                keys.forEach(key=>{
     
                    liked_post = result[key]
                    
                    if (liked_post.length>0){
                        for (i in liked_post){
                            
                            display = setup_post_groups(liked_post[i],result,display)
                            
                            
                        }
                    }
                    else{
                        display = setup_message_groups(message,"common",display)

                    } 
                })
         
                appendChild(parent= article,display)
                appendChild(parent = section,article)
                display = section
                
                
            }   


            document.querySelector("#following_count").innerHTML = `${result["following_count"]} Following`
            document.querySelector("#follower_count").innerHTML = `${result["follower_count"]} Follower`    
            
            setup_result(display);
            setup_connect_to_networks_button();
            setup_color_for_following_buttons();
            likefeature();
            
    
        })
        
        
    }   

  

    window.onload = function(){

        // by default show myposts
        window.history.pushState({section:initialcategory},"",`${initialcategory}`)
        showSection(initialcategory);   

        document.querySelectorAll('#button').forEach(button =>{
            if (button.dataset.section == initialcategory){
                var current = document.getElementsByClassName("active");    
                
                current[0].className = current[0].className.replace("nav-link active", "nav-link");
                button.className =" nav-link active";
            }
        })
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


