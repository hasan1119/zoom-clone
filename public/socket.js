
// webRTC



socket.emit('joinRoom', roomId)

socket.on("notify_new_joining", () => {
    makeAnOffer()
})

async function makeAnOffer() {
    console.log("send offer");
    const offer = await peerConnection.createOffer();
    peerConnection.setLocalDescription(offer);
    socket.emit('makeOffer', offer, roomId)

}


socket.on("receiveOffer", async (offer) => {
    peerConnection.setRemoteDescription(offer);
    const answer = await peerConnection.createAnswer()
    peerConnection.setLocalDescription(answer);
    socket.emit('answar', answer, roomId)

})

socket.on("answer", (answer) => {
    peerConnection.setRemoteDescription(answer);
})


function addTrackToWebRTC() {
    mediaStream.getTracks().forEach(track => {
        peerConnection.addTrack(track);
    })
}

function makeAWebRTCConnection() {
    peerConnection = new RTCPeerConnection();

    peerConnection.addEventListener('icecandidate', handleCandidate);
    peerConnection.addEventListener('addStream', (data) => {
        console.log(data);
    })

   

    addTrackToWebRTC()
}




function handleCandidate(data) {
    socket.emit('ice', data.candidate, roomId)
}


socket.on("ice", (candidate) => {
    peerConnection.addICECandidate(candidate)
  
})






// get new user joining notification
socket.on('notify_new_joining', () => {
    makeAnOffer()

})


// add track to RTC
async function addTrackToWebRTC() {
    mediaStream.getTracks().forEach(track => {
        RTC.addTrack(track, mediaStream);
    })

    // listing to icecandidate event
    RTC.addEventListener('icecandidate', (data) => {
        // send candidate 
       
        socket.emit("send_ice_candidate", data.candidate, roomId)
    })
}

RTC.addEventListener('addstream', (data) => {
    console.log(data);
    const video = document.createElement('video');
    video.srcObject = data.stream;
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.appendChild(video)
})


// make an offer
async function makeAnOffer() {
    const offer = await RTC.createOffer();
    RTC.setLocalDescription(offer);
    // send an offer
    socket.emit('send_offer', offer, roomId)
}

// get offter 
socket.on("get_offer", async (offer) => {
    RTC.setRemoteDescription(offer);
    const answar = await RTC.createAnswer();
    RTC.setLocalDescription(answar);

    // send the answer
    socket.emit('send_answer', answar, roomId)

})


// get answer
socket.on("get_answer", (answer) => {
    RTC.setRemoteDescription(answer)
})


socket.on("get_candidate",  (candidate) => {
    RTC.addIceCandidate(candidate)

})