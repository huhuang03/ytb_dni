import os
from datetime import datetime
import zipfile

suffix = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')

zf = zipfile.ZipFile('src-{}.zip'.format(suffix), 'w')

# remove all exist zip

cur_root = os.path.dirname(__file__)
for name in os.listdir(cur_root):
    if name.startswith('src-') and name.endswith('.zip'):
        os.remove(os.path.join(cur_root, name))

for dirname, subdirs, files in os.walk('dist'):
    zf.write(dirname)
    for filename in files:
        zf.write(os.path.join(dirname, filename))

zf.close()
