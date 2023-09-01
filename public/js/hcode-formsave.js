HTMLFormElement.prototype.save = function () {
    let form = this;
    console.log('form')
    console.log(form.action)
    console.log('formmm', form)
    return new Promise((resolve, reject) => {
        form.addEventListener('submit', e => {
            e.preventDefault();
            let formData = new FormData(form)
            fetch(form.action, {
                method: form.method,
                body: formData
            })
                .then(response => {
                    console.log('chegou em response:')
                    console.log(response)
                    response.json()
                })
                .then(json => {
                    resolve(json)
                }).catch(err => {
                    console.log('Erro:', err)
                    reject(err);
                })
        })
    })
}