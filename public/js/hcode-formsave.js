HTMLFormElement.prototype.save = function () {
  
    let form = this;
  
    return new Promise((resolve, reject) => {
        form.addEventListener('submit', e => {
  
            e.preventDefault();
  
            let formData = new FormData(form);
  
            fetch(form.action, {
                method: form.method,
                body: formData
            }).then((resultado)=>{
              console.log('Resultado:', resultado)
              console.log('Ok')
              resolve()
            }).catch(err=>{
              console.log('Ook')
              reject()
            })
        })
    })
  }