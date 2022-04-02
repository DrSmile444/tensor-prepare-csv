import numpy as np
import os

from tflite_model_maker import configs
from tflite_model_maker import ExportFormat
from tflite_model_maker import model_spec
from tflite_model_maker import text_classifier
from tflite_model_maker.text_classifier import DataLoader

import tensorflow as tf
assert tf.__version__.startswith('2')
tf.get_logger().setLevel('ERROR')

# Example from google storage
# data_file = tf.keras.utils.get_file(fname='comment-spam-extras.csv', origin='https://storage.googleapis.com/laurencemoroney-blog.appspot.com/jm_blog_comments_extras.csv', extract=False)

# Example from local file
myFile = 'tensor-csv-dataset.csv'
fullPath = os.path.abspath("./" + myFile)
origin = 'file://'+fullPath

data_file = tf.keras.utils.get_file(fname='tensor-csv-dataset-loaded.csv', origin=origin, extract=False)

spec = model_spec.get('average_word_vec')
spec.num_words = 2000
spec.seq_len = 30
spec.wordvec_dim = 7

data = DataLoader.from_csv(
      filename=data_file,
      text_column='commenttext',
      label_column='spam',
      model_spec=spec,
      delimiter=',',
      shuffle=True,
      is_training=True)

train_data, test_data = data.split(0.9)

model = text_classifier.create(train_data, model_spec=spec, epochs=50)

# model.export(export_dir="/content/js_export/", export_format=[ExportFormat.TFJS, ExportFormat.LABEL, ExportFormat.VOCAB])
