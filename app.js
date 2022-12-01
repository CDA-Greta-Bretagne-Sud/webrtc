//reglage compatibilité navigateur
navigator.
    getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia

function bindEvents(p) {
    //affichage des erreurs dans la console
    p.on('error', function (err) {
        console.log('error', err)
    })
    //declenchement de l'offre et affichage dans le textarea
    p.on('signal', function (data) {
        document.querySelector('#offer').textContent = JSON.stringify(data)
    })
    // On utilise l'api media pour obtenir la vidéo / son de l'utilisateur
    p.on('stream', function (stream) {
        //on injecte le stream du receiver dans notre <video>
        let video = document.querySelector('#receiver-video')
        video.volume = 0
        video.srcObject = stream
        video.play()
    })
//recupération de l'offre de l'emetteur enciquant sur le bouton enregistrer l'offre
    document.querySelector('#incoming').addEventListener('submit', function
        (e) {
        e.preventDefault()
        p.signal(JSON.parse(e.target.querySelector('textarea').value))
    })
}
//réuperation de la webcam et de l'audio
function startPeer(initiator) {
    navigator.getUserMedia({
        video: true,
        audio: true
    }, function (stream) {
        //initialisation de la communication
        let p = new SimplePeer({
            initiator: initiator,
            stream: stream,
            trickle: false //pas de serveur - uniquement pour réseau local
        })
        bindEvents(p)
        //on injecte le stream de l'emetteur dans notre <video>
        let emitterVideo = document.querySelector('#emitter-video')
        emitterVideo.volume = 0
        emitterVideo.srcObject = stream
        emitterVideo.play()
    }, function () {
    })
}
document.querySelector('#start').addEventListener('click', function (e) {
    startPeer(true)
})
document.querySelector('#receive').addEventListener('click', function (e) {
    startPeer(false)
})