let model;
let video;
let canvas;
let context;
let stream;

// 載入模型
async function loadModel() {
    const modelURL = './models/model.json';
    const metadataURL = './models/metadata.json';
    
    model = await tmImage.load(modelURL, metadataURL);
    document.getElementById('loading').style.display = 'none';
    document.getElementById('startCamera').disabled = false;
}

// 啟動攝影機
async function startCamera() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment', // 使用後置攝影機
                width: { ideal: 640 },
                height: { ideal: 480 }
            }
        });
        
        video.srcObject = stream;
        video.style.display = 'block';
        document.getElementById('startCamera').disabled = true;
        document.getElementById('capture').disabled = false;
    } catch (error) {
        console.error('無法存取攝影機:', error);
        alert('無法存取攝影機，請檢查權限。');
    }
}

// 拍攝照片
function capturePhoto() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    document.getElementById('classify').disabled = false;
}

// 分類
async function classify() {
    if (!model) {
        alert('模型尚未載入');
        return;
    }
    
    const prediction = await model.predict(canvas);
    
    // 找到最高機率的類別
    let maxProbability = 0;
    let predictedClass = '';
    
    prediction.forEach(pred => {
        if (pred.probability > maxProbability) {
            maxProbability = pred.probability;
            predictedClass = pred.className;
        }
    });
    
    // 顯示結果
    document.getElementById('prediction').textContent = `預測類別: ${predictedClass}`;
    
    // 顯示所有機率
    let confidenceHTML = '<h5>信心度:</h5><ul class="list-group">';
    prediction.forEach(pred => {
        const percentage = (pred.probability * 100).toFixed(2);
        confidenceHTML += `<li class="list-group-item">${pred.className}: ${percentage}%</li>`;
    });
    confidenceHTML += '</ul>';
    
    document.getElementById('confidence').innerHTML = confidenceHTML;
    document.getElementById('result').style.display = 'block';
}

// 事件監聽器
document.addEventListener('DOMContentLoaded', () => {
    loadModel();
    
    document.getElementById('startCamera').addEventListener('click', startCamera);
    document.getElementById('capture').addEventListener('click', capturePhoto);
    document.getElementById('classify').addEventListener('click', classify);
});

// 清理資源
window.addEventListener('beforeunload', () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
});