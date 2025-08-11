import os
from datetime import datetime
import zipfile

suffix = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
work_dir = os.path.dirname(__file__) + "/.."

# 删除旧的 dist-*.zip 文件
for name in os.listdir(work_dir):
    if name.startswith('dist-') and name.endswith('.zip'):
        os.remove(os.path.join(work_dir, name))

# 要打包的子目录列表
targets = ['chrome', 'firefox']

for target in targets:
    dist_path = os.path.join(work_dir, 'dist', target)
    if not os.path.isdir(dist_path):
        continue

    zip_name = f'dist-{target}-{suffix}.zip'
    zip_path = os.path.join(work_dir, zip_name)

    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        for dirname, subdirs, files in os.walk(dist_path):
            for filename in files:
                full_path = os.path.join(dirname, filename)
                # 把 dist/{target}/ 去掉，让打包内容不带子目录名
                arcname = os.path.relpath(full_path, dist_path)
                zf.write(full_path, arcname)

    print(f'打包完成: {zip_name}')
