var requestInProcess = false
const requestUrl = 'https://api.recordedfuture.com/query/'
const results = document.getElementById('results')
const p = document.getElementById('message')
document.getElementById("spinner").style.display = "none";
var request = new XMLHttpRequest()
var value = ''
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
    value = document.getElementById('searchCriteria').value.toLowerCase()
    if (value) {
        // Abort request if there is one in the process already and/or send a new one
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
    document.getElementById("spinner").style.display = "block";
    requestInProcess = true
    body.where.name.text = value
    request.open('POST', requestUrl, true)
    request.onload = function () {
        document.getElementById("spinner").style.display = "none";
        requestInProcess = false
        if (request.status >= 200 && request.status < 400) {
            let data = JSON.parse(this.response)
            if (data.result.count > 0) {
                data.result.items.forEach(result => {
                    //Create a card for each result
                    const card = document.createElement('div')
                    card.setAttribute('class', 'search-card')
                    const type = document.createElement('type')
                    type.setAttribute('class', 'type ' + result.type.toLowerCase())
                    type.textContent = result.type
                    const info = document.createElement('div')
                    info.setAttribute('class', 'info')
                    if (result.attributes) {
                        if (result.attributes.name) {
                            const name = document.createElement('p')
                            const resultName = result.attributes.name
                            let regex = new RegExp(value, 'gi')
                            let replacedString = resultName.replace(regex, (str) => '<b>' + str + '</b>')
                            name.innerHTML = 'Name: ' + replacedString
                            info.appendChild(name)
                        }
                        if (result.attributes.created) {
                            const created = document.createElement('p')
                            let date = new Date(result.attributes.created)
                            date = date.toISOString().substring(0, 10)
                            created.innerHTML = 'Created: ' + date
                            info.appendChild(created)
                        }
                        if (result.attributes.modified) {
                            const modified = document.createElement('p')
                            let date = new Date(result.attributes.modified)
                            date = date.toISOString().substring(0, 10)
                            modified.innerHTML = 'Modified: ' + date
                            info.appendChild(modified)
                        }
                        if (result.attributes.hits) {
                            const hits = document.createElement('p')
                            hits.innerHTML = '<i>Hits: ' + result.attributes.hits + '</i>'
                            info.appendChild(hits)
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
