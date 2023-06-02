const faceCam = document.getElementById('face-cam');
const videoCam = document.getElementById('btn-active-cam');

const users = [
  {
    'AG': 'Arthur Garcia',
  },
  {
    'JD': 'Jacob Davis'
  },
  {
    'RO': 'Robert Olsen'
  },
  {
    'JR': 'Janice Ramirez'
  }
];

faceCam.addEventListener('play', async() => {
  const canvas = faceapi.createCanvasFromMedia(faceCam);
  const canvasDetection = document.getElementById('canvas-detection');
  canvasDetection.insertBefore(canvas, canvasDetection.firstChild);

  const displaySize = {
    width: faceCam.width,
    height: faceCam.height
  };
  
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(
        faceCam,
        new faceapi.TinyFaceDetectorOptions()
      ).withFaceLandmarks().withFaceExpressions();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
  }, 100);
});

videoCam.addEventListener('click', async() => {
  navigator.getMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

  const loadCam = () => {
    navigator.getMedia(
      {
        video: true,
        audio: false,
      },
      (stream) => (faceCam.srcObject = stream),
      console.error
    );
  };

  Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri('/src/lib/models'),
    faceapi.nets.ageGenderNet.loadFromUri('/src/lib/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/src/lib/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/src/lib/models'),
    faceapi.nets.faceLandmark68TinyNet.loadFromUri('/src/lib/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/src/lib/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/src/lib/models'),
    faceapi.nets.tinyFaceDetector.loadFromUri('/src/lib/models'),
  ]).then(loadCam);

  await loadModels();
  
  renderUsers();
});

const loadModels = async() => {
  const MODEL_URL = '/src/lib/models';

  await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
  await faceapi.loadFaceLandmarkModel(MODEL_URL);
  await faceapi.loadFaceRecognitionModel(MODEL_URL);
  await faceapi.loadFaceExpressionModel(MODEL_URL);
}

const renderUsers = () => {
  let usersCard = '';
  users.forEach((user, index) => {
    setInterval(() => {
      usersCard = `
        <div class="card w-full bg-base-100 shadow-xl">
          <div class="card-body">
            <div class="flex flex-row gap-2 items-center">
              <div class="avatar placeholder">
                <div class="bg-neutral-focus text-neutral-content rounded-full w-12">
                  <span>${Object.keys(user)}</span>
                </div>
              </div> 
              <div class="card-actions justify-end">
                <p>${Object.values(user)}</p>
              </div>
              <div class="form-control">
                <label class="cursor-pointer label">
                  <input type="checkbox" checked="checked" class="checkbox checkbox-success" />
                </label>
              </div>
            </div>
          </div>
        </div>
      `;
      document.getElementById(`users-cards${index}`).innerHTML = usersCard;
    }, ((index + 1) * 3750));
  });
}
