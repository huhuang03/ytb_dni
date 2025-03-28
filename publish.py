import os
from datetime import datetime
import zipfile

suffix = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')

# remove all exist zip

cur_root = os.path.dirname(__file__)
for name in os.listdir(cur_root):
    if name.startswith('dist-') and name.endswith('.zip'):
        os.remove(os.path.join(cur_root, name))

zf = zipfile.ZipFile('dist-{}.zip'.format(suffix), 'w')

for dirname, subdirs, files in os.walk('dist'):
    zf.write(dirname)
    for filename in files:
        zf.write(os.path.join(dirname, filename))

zf.close()
