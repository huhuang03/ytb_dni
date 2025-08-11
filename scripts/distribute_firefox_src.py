# create the src zip for firefox publish
from pathlib import Path
import zipfile
import fnmatch

work_dir = Path(__file__).parent.parent

ignore_files = ['*.zip', '.git', 'node_modules', 'dist', '.idea']


def should_ignore(file: Path) -> bool:
    """判断文件或目录是否需要忽略"""
    # 只判断相对路径的第一个部分
    first_part = file.relative_to(work_dir).parts[0]
    for pattern in ignore_files:
        if fnmatch.fnmatch(first_part, pattern):
            return True
    return False


def create():
    zip_name = f'firefox_src.zip'
    zip_path = work_dir / zip_name
    zip_path.unlink(missing_ok=True)

    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        for file in work_dir.rglob("*"):  # 遍历所有文件和目录
            if should_ignore(file):
                continue
            # skip if is first level file/folder, and name match ignore_fils
            if file.is_file():
                arcname = file.relative_to(work_dir)  # 去掉 dist/{target}/ 前缀
                zf.write(file, arcname)


if __name__ == '__main__':
    create()
