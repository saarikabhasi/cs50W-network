



window.onpopstate = function(event) {
    //remember section when clicking previous 
    showSection(event.state.section);
}

function showSection(section){
    console.log("Show section for",section)
    //find section from server
    path =`section/${section}`
    fetch(path)
    .then(response => response.text())
    .then(text => {
                    /* 
        section : 
            1. following
            2. follower
            3  suggestion 
        */
        var message = {"followers":"No followers yet","following":"No one follows you","suggestions":"No suggestions yet"}
        var result = JSON.parse(text);
        let display = createElement('div',null,null,null);
        if (section in result){
            values= result[section]
            
            if (values!=0){
                for( i in values){
                    val = values[i]
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

                }
    
            }
            else{
                console.log("here")
                let div =createElement('div',null,null,null);
                let span = createElement('span',null,null,null);
                
                let username = createElement('h2',null,"notfound",`${message[section]}`)
                appendChild(parent =div,span,username )
                appendChild(parent =display,div);
            }

        document.querySelector("#result").innerHTML = display.innerHTML;
        document.querySelectorAll('#change').forEach(e =>{
            
            e.onclick = function(){
                const value = e.value
                connect(value);
                
            };
            
            
        });
        document.querySelectorAll("input.btn-primary").forEach(e =>{
            
            if(e.value == "following"){
                console.log("here")
         
                e.style.backgroundColor = "rgb(8, 154, 202)";
                console.log(e)
            }
        })
        


    }
})


    
    

}
window.onload = function(){
    
    window.history.pushState({section:initialsection},"",`${initialsection}`);
    console.log("show",`${initialsection}`)
    showSection(initialsection);
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

