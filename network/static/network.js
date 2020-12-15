



window.onpopstate = function(event) {
    //remember section when clicking previous 
    
    showSection(event.state.section);
}

function showSection(section){
  
    //find section from server
    path =`section/${section}`
    if (!document.location.pathname.includes("network/network") ){	
        path = `network/section/${section}`	
    }	
   
    console.log("path:",path)
    fetch(path)
    .then(response => response.text())
    .then(text => {
                    /* 
        section : 
            1. following
            2. followers
            3  suggestions 
        */
       var result = JSON.parse(text);
       var message = {"followers":"Hmm. Looks like you have 0 followers !","following":"No users found! Looks like you dont follow anyone","suggestions":"No suggestions yet"}
       values= result[section]
       let display = createElement('div',null,null,null);  
        if (section in result){
            if (values!=0){
                for( i in values){
                    val = values[i]
                    display = setup_network_groups(val,result,section,display);
                }
            }
            else{
                display = setup_message_groups(message,section,display)
            }
        }

        setup_result(display);
        setup_connect_to_networks_button();
        setup_color_for_following_buttons();
    })
}




    
window.onload = function(){
    
   window.history.pushState({section:initialsection},"",`${initialsection}`);
    //storing previousection to localstorage so that i can use the information while refreshing the page!
   localStorage.setItem("previoussection", initialsection);
    
    
    showSection(initialsection);
    document.querySelectorAll('#button').forEach(button =>{
        if (button.dataset.section == initialsection){
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
            localStorage.setItem("previoussection", section);
  
            showSection(section);
            
            var current = document.getElementsByClassName("active");    
            
            current[0].className = current[0].className.replace("nav-link active", "nav-link");
            this.className =" nav-link active";

            
        };  
    });

});

