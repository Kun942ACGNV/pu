let model;
let stream;
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const previewImage = document.getElementById('previewImage');
const statusBadge = document.getElementById('statusBadge');
const startButton = document.getElementById('startCamera');
const captureButton = document.getElementById('capture');
const classifyButton = document.getElementById('classify');
const resultCard = document.getElementById('result');
const predictionText = document.getElementById('prediction');
const confidenceContainer = document.getElementById('confidence');

const labelMap = {
    cardboard: '紙板',
    paper: '紙張',
    biological: '生物',
    trash: '垃圾',
    clothes: '衣服'
};

function setStatus(text, variant = 'info') {
    statusBadge.textContent = text;
    statusBadge.className = `badge bg-${variant} text-white py-2 px-3`;
}

async function loadModel() {
    try {
        const modelURL = './models/model.json';
        const metadataURL = './models/metadata.json';
        model = await tmImage.load(modelURL, metadataURL);
        setStatus('模型已載入', 'success');
        startButton.disabled = false;
    } catch (error) {
        console.error('模型載入失敗:', error);
        setStatus('模型載入失敗', 'danger');
        alert('無法載入模型，請稍後再試。');
    }
}

async function startCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('瀏覽器不支援攝影機功能。');
        return;
    }

    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        });

        video.srcObject = stream;
        video.play();
        startButton.disabled = true;
        captureButton.disabled = false;
        setStatus('準備拍攝', 'primary');
    } catch (error) {
        console.error('無法存取攝影機:', error);
        setStatus('攝影機存取失敗', 'danger');
        alert('請允許攝影機權限，並確認裝置支持攝影機功能。');
    }
}

function capturePhoto() {
    if (!stream) {
        alert('請先啟動攝影機');
        return;
    }

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    previewImage.src = canvas.toDataURL('image/jpeg');
    previewImage.style.display = 'block';

    classifyButton.disabled = false;
    setStatus('已拍攝，請分類', 'warning');
}

async function classify() {
    if (!model) {
        alert('模型尚未載入');
        return;
    }

    classifyButton.disabled = true;
    setStatus('辨識中...', 'secondary');

    try {
        const prediction = await model.predict(canvas);
        if (!prediction || !prediction.length) {
            throw new Error('無效的辨識結果');
        }

        prediction.sort((a, b) => b.probability - a.probability);
        const top = prediction[0];
        const confidence = (top.probability * 100).toFixed(2);
        const topLabel = labelMap[top.className] || top.className;

        predictionText.innerHTML = `<strong>${topLabel}</strong> <span class="text-muted">(${top.className}, ${confidence}%)</span>`;

        let confidenceHTML = '<div class="list-group">';
        prediction.forEach(pred => {
            const percentage = (pred.probability * 100).toFixed(2);
            const label = labelMap[pred.className] || pred.className;
            confidenceHTML += `
                <div class="list-group-item d-flex flex-column gap-2">
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="fw-semibold">${label}</span>
                        <span>${percentage}%</span>
                    </div>
                    <div class="progress" style="height: 8px; border-radius: 999px;">
                        <div class="progress-bar bg-info" role="progressbar" style="width: ${percentage}%" aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </div>`;
        });
        confidenceHTML += '</div>';

        confidenceContainer.innerHTML = confidenceHTML;
        resultCard.style.display = 'block';
        setStatus('辨識完成', 'success');
    } catch (error) {
        console.error('分類錯誤:', error);
        setStatus('辨識失敗', 'danger');
        alert('分類時發生錯誤，請重新拍攝後再試。');
    } finally {
        classifyButton.disabled = false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadModel();
    startButton.addEventListener('click', startCamera);
    captureButton.addEventListener('click', capturePhoto);
    classifyButton.addEventListener('click', classify);
});

window.addEventListener('beforeunload', () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
});