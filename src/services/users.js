const fetch = require('node-fetch');
/**
 * This is where the app calls the microservice responsible for the "Quote" resource type.
 */
module.exports = {
    fetchResponseByURL: function () {
        console.log("chamou a API");
        return fetch('http://localhost:3001', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: `{
                user {
                  id
                  name
                  avatar
                }
              }`})
        })
            .then(r => r.json())
            .then(data => transform(data));
    }
}
 

function transform(json) {
    var retorno = json;

    return {
        id: retorno.data.user.id,
        name: retorno.data.user.name,
        avatar: retorno.data.user.avatar
    }
}
