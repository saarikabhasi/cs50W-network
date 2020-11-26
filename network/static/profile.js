
    username ="{{username}}"

    function toggle(id,toggleTo){
        console.log("func toggle",id,this.username,toggleTo)
        
        fetch(`${username}/profileupdate/${id}`)


    }
    function createElement(tag,className,idName,content){
        //console.log("func createElement")
        element = document.createElement(tag);
        if (className){
            element.className =className;
        }
            
        if (idName){
            element.id = idName;
        }

        if (content){
            element.innerHTML = content;
        }


        
        //console.log("element",element)
        return element;

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
       console.log("JS showsection function")
    //    console.log("PATH:",`${username}/${section}`)
       fetch(`${username}/profile/${section}`)
       //fetch(`/${section}`)
       
       .then(response => response.text())   
       .then(text => {
        /* 
        num : 1 display my posts
            : 2 display networks
            : 3 display all liked posts 
        */

        var result = JSON.parse(text);
        display = createElement('div',null,null,null);
        keys = ["myposts"]
        if (section == "myposts"){
            keys.forEach(key=>{

                myposts = result[key]

                for (i in myposts){
         
                    let post = createElement('div',null,'posts',null);

                    //console.log("p1",post)

                    let contents = createElement('p',null,null,String(myposts[i]["contents"]));

                    // console.log("c",contents)
    
                    let date_and_time = createElement('p',null,null,String(new Date(myposts[i]["date_and_time"])));  
                    
                    //console.log("DT",date_and_time)
                    
                    let num_of_likes = createElement('p',null,null,String(myposts[i]["num_of_likes"]));
                    
                    //console.log("likes",num_of_likes)

                    hr = createElement('hr','hr_divide_heading',null,null);
                    
                    //console.log("hr",hr)

                    post.appendChild(contents);        
                    post.appendChild(date_and_time);   
                    post.appendChild(num_of_likes); 
                    post.appendChild(hr);
                    
                    // console.log(post)
                    display.append (post)
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
                      //console.log("location",)
                        var form = document.createElement("form")
                        console.log("document.location",document.location)
                        console.log("\n",document.location.host)
                        form.setAttribute('method',"post");
                        //form.setAttribute('action',document.location.href+"/update")
                        
                        form.setAttribute('action',document.location+"/connect")
                        
                        //console.log("cook",getCookie('csrftoken'))
                        //var csrfValue = Cookies.get('csrftoken');
                        var crsf = document.createElement("input");
                        crsf.setAttribute("type","hidden");
                        crsf.setAttribute("name","csrfmiddlewaretoken");
                        crsf.setAttribute("value",'{{ csrf_token }}');

                        // var input = document.createElement("input")
                        // input.setAttribute('type','submit')
                        // input.setAttribute('name',"btn")
                        
                        // var idbtn = document.createElement("button")
                        // idbtn.setAttribute('type','hidden')
                        // idbtn.setAttribute('name','id')
                        // idbtn.setAttribute('value',inc)

                    

                        if (key === "user_currently_follows"){
                            
                            //func ='toggle('+ inc +','+'"unfollow"'+');'

                            //input.setAttribute('value',"unfollow",inc)
                           // var togglebutton = createElement('span',null,null,'<button role = "switch"  name = "btn" aria-checked="true" class="switch" id="unfollowbutton" value =' +inc +' onclick='+func+' /> unfollow </button>')
                            //var togglebutton = createElement('span',null,null,'<button role = "switch"  name = "btn" aria-checked="true" class="switch" id="unfollowbutton" value =' +inc +'  /> unfollow </button>')                            
                            //var togglebutton = createElement('span',null,null,'<input type= "hidden"  name = "change"  value =unfollow> <input type= "submit"  name = "btn"  value =' +inc +'   />')
                            var togglebutton = createElement('span',null,null,'<input type= "hidden"  name = "change"  value =' + inc +' /> <input type= "submit"  name = "btn"  value =  unfollow />')
                        }
                        else{
                            //input.setAttribute('value',"follow")
                            //func ='toggle('+ inc +','+'"follow"'+');'
                            //var togglebutton = createElement('span',null,null,'<button role = "switch"  name = "btn" aria-checked="true" class="switch" id="followbutton" value =' +inc +' onclick='+func+'> follow </button>')
                            //var togglebutton = createElement('span',null,null,'<button role = "switch"  name = "btn" aria-checked="true" class="switch" id="followbutton" value =' +inc +'  type ="submit" /> follow </button>')
                            var togglebutton = createElement('span',null,null,'<input type= "hidden"  name = "change"  value =' + inc +' /> <input type= "submit"  name = "btn"  value =  follow />')
                        }
                        form.appendChild(crsf)
                        form.appendChild(togglebutton)
                        //form.appendChild(idbtn)
                        //form.appendChild(input)
                        
                        
                    
                        let hr = createElement('hr','hr_divide_heading',null,null,null)

                        whotofollow.appendChild(username);
                        //whotofollow.appendChild(togglebutton);
                        whotofollow.appendChild(form);
                        whotofollow.appendChild(hr);
                        display.append(whotofollow)
                    }
                }
                

            })
            
                
            
            
             
            
  
        }
        //likes
        else if (section == "likes"){}
       
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
        
        console
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

  