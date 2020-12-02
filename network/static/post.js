function updatelike(username,post_id){
    //fetch(`${username}/profile/${section}`)
    fetch(`like/${username}/${post_id}`)

    document.querySelector("#fa-heart-o").style.color = "red"
}