const videoGrid = document.getElementById("video_grid");
const muteBtn = document.getElementById("muteBtn")
const cameraoff = document.getElementById("cameraoff")
const selectCam = document.getElementById("selectCam")
const selectMic = document.getElementById("selectMic")
const screenShare = document.getElementById("screenShare")



let mediaStream;
let mute = false;
let camera = true;
let currentCam;

// sound mute handler
muteBtn.addEventListener("click", (e) => {
    if (mute) {
        mute = false;
        muteBtn.textContent = "Mute yourself";
        mediaStream.getAudioTracks()
            .forEach(track => {
                track.enabled = true;
            })
    } else {
        mute = true;
        muteBtn.textContent = "Unmute yourself";
        mediaStream.getAudioTracks()
            .forEach(track => {
                track.enabled = false;
            })
    }


})



cameraoff.addEventListener('click', () => {
    if (camera) {
        cameraoff.textContent = "Turn on camera";
        camera = false;
        mediaStream.getVideoTracks()
            .forEach(track => {
                track.enabled = false;
            })

    } else {
        cameraoff.textContent = "Turn off camera";
        camera = true;
        mediaStream.getVideoTracks()
            .forEach(track => {
                track.enabled = true;
            })
    }
})


// getting the medias
async function getMedia(cameraId, micId) {
    

    currentCam = cameraId === null ? currentCam : cameraId;

    const initialConstraits = {
        video: true,
        audio: true
    }

    const preferredCameraConstraints = {
        video: { deviceId: cameraId  },
        audio:true,
    }

    const videoOption = currentCam ? { deviceId: currentCam } : true;

    const preferredMicConstraints = {
        video: videoOption,
        audio:{ deviceId: micId  },
    }
    console.log( currentCam, videoOption);

    try {
      
            
        
        mediaStream = await window.navigator.mediaDevices.getUserMedia(cameraId || micId ? cameraId? preferredCameraConstraints : preferredMicConstraints   : initialConstraits)

        displayMedia()
        getAllCameras()
        getAllMics()
       console.log( mediaStream.getAudioTracks());

    } catch (error) {
        console.log(error);
    }


}
getMedia()


async function getScreenMedia(){
    try {
        mediaStream = await navigator.mediaDevices.getDisplayMedia({
            audio: true,
            video: true,
        });
        displayMedia()
    } catch (error) {
        console.log(error);
    }
}


screenShare.addEventListener('click', getScreenMedia)


// display media
function displayMedia() {
    videoGrid.innerHTML = ''
    const video = document.createElement('video');
    video.srcObject = mediaStream;
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.appendChild(video)

    const video2 = document.createElement('video');
    video2.srcObject = mediaStream;
    video2.addEventListener('loadedmetadata', () => {
        video2.play()
    })
    videoGrid.appendChild(video2)

    const video3 = document.createElement('video');
    video3.srcObject = mediaStream;
    video3.addEventListener('loadedmetadata', () => {
        video3.play()
    })
    videoGrid.appendChild(video3)

    const video4 = document.createElement('video');
    video4.srcObject = mediaStream;
    video4.addEventListener('loadedmetadata', () => {
        video4.play()
    })
    videoGrid.appendChild(video4)

    const video5 = document.createElement('video');
    video5.srcObject = mediaStream;
    video5.addEventListener('loadedmetadata', () => {
        video5.play()
    })
    videoGrid.appendChild(video5)


}

// get all cameras
async function getAllCameras() {
    const currentCamera = mediaStream.getVideoTracks()[0];
    const allDevices = await window.navigator.mediaDevices.enumerateDevices();
    selectCam.innerHTML = ''
    allDevices.forEach(device => {
  
        if (device.kind === "videoinput") {
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.textContent = device.label;
            option.selected = device.label === currentCamera.label ? true: false ;
            selectCam.appendChild(option)
        }
    })
}




// get all mics
async function getAllMics() {
    const currentMic = mediaStream.getAudioTracks()[0];
    const allDevices = await window.navigator.mediaDevices.enumerateDevices();
    selectMic.innerHTML = ''
    allDevices.forEach(device => {
  
        if (device.kind === "audioinput") {
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.textContent = device.label;
            option.selected = device.label === currentMic.label ? true: false ;
            selectMic.appendChild(option)
        }
    })
}



// select a specific camera
selectCam.addEventListener('input', (e) => {
    const cameraId = e.target.value;
    getMedia(cameraId)
})

// select a specific camera
selectMic.addEventListener('input', (e) => {
    const micId = e.target.value;
    getMedia(null, micId)
})