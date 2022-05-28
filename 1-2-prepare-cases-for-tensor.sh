node ./download-dataset.js
node ./create-docx.js
node ./translate-dataset.js
node ./parse-docx.js
node ./prepare-tensor-csv-dataset.js
echo ""
echo "**** 1-2-prepare-cases-for-tensor.sh ****"
echo ""
echo "1) Get the ./1-3-temp/tensor-csv-dataset.csv file and train it in tflite-model-maker"
echo "2) After the model is trained, download it and move js_export folder into ./1-3-temp/"
echo "3) Then run ./3-prepare-vocab.sh"
echo ""
