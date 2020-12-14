



window.onpopstate = function(event) {
    //remember section when clicking previous 
    showSection(event.state.section);
}

function showSection(section){
    console.log("Show section for",section)
    //find section from server
    path =`section/${section}`

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
       var message = {"followers":"No followers yet","following":"No one follows you","suggestions":"No suggestions yet"}
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
    console.log("show",`${initialsection}`)
    
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
            showSection(section);
            
            var current = document.getElementsByClassName("active");    
            
            current[0].className = current[0].className.replace("nav-link active", "nav-link");
            this.className =" nav-link active";

            
        };  
    });

});

