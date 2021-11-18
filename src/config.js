module.exports = {
    application: {
        cors: {
            server: [
                {
                    origin: "https://pi-dog-front.herokuapp.com", //servidor que deseas que consuma o (*) en caso que sea acceso libre
                    credentials: true
                },
                {
                    origin: "http://pi-dog-front.herokuapp.com", //servidor que deseas que consuma o (*) en caso que sea acceso libre
                    credentials: true
                }
            ]
        }
}