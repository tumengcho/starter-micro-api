function test(){
    console.log((document.querySelector('input').valueAsNumber))
}


 const button = document.querySelector("button#signUp")
 button.addEventListener("click", () => { 
   fetch('/create-checkout-session',{
    method:'POST',
    headers:{
        'Content-Type': 'application/json'
        
    },
    body: JSON.stringify({
        items:[
            {id: 1, quantity: document.querySelector('input').valueAsNumber},
            {id: 2, quantity: document.querySelector('input').valueAsNumber},
        ]
    })
   }).then(res =>{
    if(res.ok) return res.json()
    return res.json().then(json => Promise.reject(json))
   }).then(({url}) => {
    
    window.location = url
   }).catch(e => {
    console.error(e.error)
   })
})

