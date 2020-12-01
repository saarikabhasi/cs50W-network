
    username ="{{username}}"

    function toggle(id,toggleTo){
        console.log("func toggle",id,this.username,toggleTo)
        
        fetch(`${username}/profileupdate/${id}`)


    }
    

    //switch
    document.querySelectorAll(".switch").forEach(function(theSwitch) {
    theSwitch.addEventListener("click", handleClickEvent, false);
    });

function handleClickEvent(evt) {
  let el = evt.target;
 
  if (el.getAttribute("aria-checked") == "true") {
      el.setAttribute("aria-checked", "false");
  } else {
      el.setAttribute("aria-checked", "true");
  }
}

    //Show given section
    function showSection(section){
        
       // Find section contents from server
       fetch(`${username}/profile/${section}`)

       .then(response => response.text())   
       .then(text => {
        /* 
        num : 1 display my posts
            : 2 display networks
            : 3 display all liked posts 
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
        else if (section == "networks"){
            //networks

            const keys = ["user_currently_follows","user_can_follow"]

            keys.forEach (key=>{
                networks= result[key]
                if (networks){
                    let whotofollow = createElement('div',null,key,null)
                    for (i = 0; i<networks.length; i++){
                    
                        let username = createElement('p',null,null,String(networks[i]["username"]))
                        
                        inc = networks[i]["id"]
 
                      
                      //form
                        var form = createForm("post",document.location+"/connect")
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
        else if (section == "likes"){
            const keys = ["post_liked"]
            keys.forEach(key =>{
                posts = result[key]

                for (i in posts){
         
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
       
        else{
           console.log("error");
        }

  

        document.querySelector("#following_count").innerHTML = `${result["following_count"]} Following`
        document.querySelector("#follower_count").innerHTML = `${result["follower_count"]} Follower`    
        
        document.querySelector("#result").innerHTML = display.innerHTML;    
    }
    );
    }   

    window.onload = function(){

        // by default show my posts
        console.log("showing default tab")
        

        showSection("myposts");
        
        //console
        // console.log("window.location.hash",window.location.hash)
        // console.log("window.location ",window.location )
        // if(!window.location.hash) {
        // window.location = window.location + '#loaded';
        // console.log("reload")
        // window.location.reload();
        // }
    }
    

    document.addEventListener('DOMContentLoaded',function(){

        
        // Add section functionality
        document.querySelectorAll('button').forEach(button =>{
            button.onclick = function(){
                const section = this.dataset.section
                showSection(section);

                var current = document.getElementsByClassName("active");    
                console.log("current",current)
                current[0].className = current[0].className.replace("active", "");
                this.className ="active";

                
 

                console.log("window hash",window.location.hash)
                console.log("window loacation",window.location)
                // if (section != "myposts"){
                //     history.pushState({section: section}, "", `${section}`);
                // }
                // else{
                //     history.pushState({section: section}, "", `{{username}}/`);
                // }

                
            };
        
            
        });
    });

  