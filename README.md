# 垃圾分類手機Web App

這是一個使用前端技術開發的垃圾分類手機Web應用程式。利用TensorFlow.js和Teachable Machine來進行圖像辨識，將垃圾分類為五個類別：紙板、紙張、生物、有機垃圾、衣服。

## 功能特點

- 📱 響應式設計，適合手機使用
- 📷 使用手機攝影機拍攝照片
- 🤖 即時AI辨識和分類
- 🎯 顯示預測結果和信心度

## 技術棧

- HTML5
- CSS3 (Bootstrap 5)
- JavaScript (ES6+)
- TensorFlow.js
- Teachable Machine Image Model

## 使用方法

1. 在手機瀏覽器中開啟 `index.html`
2. 點擊「啟動攝影機」按鈕允許存取攝影機
3. 對準要分類的垃圾物品
4. 點擊「拍攝照片」
5. 點擊「分類」進行辨識
6. 查看分類結果和信心度

## 模型資訊

- 模型類型：Teachable Machine Image Classification
- 輸入尺寸：224x224 pixels
- 分類類別：5個
  - cardboard (紙板)
  - paper (紙張)
  - biological (生物)
  - trash (垃圾)
  - clothes (衣服)

## 檔案結構

```
pu/
├── index.html          # 主頁面
├── script.js           # JavaScript邏輯
├── models/             # 訓練好的模型
│   ├── model.json      # 模型架構
│   └── metadata.json   # 模型元資料
└── README.md           # 說明文件
```

## 瀏覽器支援

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

需要支援 `getUserMedia` API 和 WebGL。

## 開發說明

此應用完全使用前端技術，無需後端伺服器。可以在本地檔案系統中運行，或部署到任何靜態網站託管服務。

    price_map = {}
    for _ in range(M):
        name = next(it)
        price = next(it)
        price_map[name] = price

    out_lines = []
    for _ in range(N):
        q = next(it)
        out_lines.append(price_map[q])

    sys.stdout.write("\n".join(out_lines))

if __name__ == "__main__":
    main()
