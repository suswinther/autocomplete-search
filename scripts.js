var requestInProcess = false
const requestUrl = 'https://api.recordedfuture.com/query/'
const results = document.getElementById('results')
const p = document.getElementById('message')
var request = new XMLHttpRequest()
var body = {
    from: 'entity',
    where: {
        name: {
            text: ''
        }
    },
    limit: 10,
    token: '99df4c56d4a84cfc9794ff731a98da33'
}
searchByValue = function () {
    p.textContent = ''
    results.innerHTML = ''
    var value = document.getElementById('searchCriteria').value
    if (value) {
        if (requestInProcess) {
            request.onabort = function () {
                requestInProcess = false
                sendNewRequest()
            }
            request.abort()
        } else {
            sendNewRequest()
        }
    }
}
sendNewRequest = function () {
    body.where.name.text = document.getElementById('searchCriteria').value
    request.open('POST', requestUrl, true)
    requestInProcess = true
    request.onload = function () {
        requestInProcess = false
        if (request.status >= 200 && request.status < 400) {
            var data = JSON.parse(this.response)
            console.log('data: ', data);
            if (data.result.count > 0) {
                data.result.items.forEach(result => {
                    const card = document.createElement('div')
                    card.setAttribute('class', 'search-card')
                    const type = document.createElement('type')
                    type.setAttribute('class', 'type ' + result.type.toLowerCase())
                    type.textContent = result.type
                    const info = document.createElement('div')
                    info.setAttribute('class', 'info')
                    if (result.attributes) {
                        if (result.attributes.created) {
                            const created = document.createElement('p')
                            var date = new Date(result.attributes.created)
                            date = date.toISOString().substring(0, 10)
                            created.innerHTML = 'Created: ' + date
                            info.appendChild(created)
                        }
                        if (result.attributes.modified) {
                            const modified = document.createElement('p')
                            var date = new Date(result.attributes.modified)
                            date = date.toISOString().substring(0, 10)
                            modified.innerHTML = 'Modified: ' + date
                            info.appendChild(modified)
                        }
                    }
                    results.appendChild(card)
                    card.appendChild(type)
                    card.appendChild(info)
                })

            } else {
                p.innerHTML = 'No results'
            }

        } else {
            p.classList.add('error')
            p.textContent = 'Something went wrong, please try again.'
        }
    }
    request.send(JSON.stringify(body))
}
