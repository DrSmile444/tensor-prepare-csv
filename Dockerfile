#
# This is a test Dockerfile
#
FROM continuumio/anaconda3
WORKDIR /app/

COPY ./UAASB_Train_Model.ipynb .

RUN pip install tflite-model-maker

RUN jupyter nbconvert --execute --to notebook "UAASB_Train_Model.ipynb"
