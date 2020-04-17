import collections
import csv
import os
import re

from db.base import db_session
from db.models import (
    Explanation,
    File,
    License,
    LicenseCategory,
    Problem,
    ProblemChoice,
    ProblemImage,
    User,
    Workbook,
    WorkbookCategory,
)
from fixtures import file

img_tag_pattern = re.compile(r'(<img.*>)')
img_attrs_pattern = re.compile(
    r'.*<img\s+src="'
    r'(?P<src>.*)"\s+style="\s+width:\s+'
    r'(?P<width>[\d\.]+)mm;\s+height:\s+'
    r'(?P<height>[\d\.]+)mm.*',
)


def create_admins():
    User.create(name='dowoome', email='arizona95@naver.com', password='ahffkehehla-_-')
    User.create(name='junsang', email='wisedier@gmail.com', password='ahffkehehla-_-')
    User.commit()


def process_license_csv(license_csv_filepath: str):
    csv_dir = os.path.dirname(license_csv_filepath)
    filename = os.path.basename(license_csv_filepath)
    license_name = os.path.splitext(filename)[0]
    li = License.create(name=license_name)

    categories = {}
    workbooks = {}
    workbook_categories = collections.defaultdict(dict)
    f = open(license_csv_filepath, 'r', encoding='utf-8')
    reader = csv.reader(f)

    for row in reader:
        date, category_name, no, description, answer, *choices = row
        year, month = date[:4], date[4:].lstrip('0')
        workbook_name = f'{year}년 {month}월'

        if workbook_name not in workbooks:
            workbook = Workbook.create(license=li, name=workbook_name)
            workbooks[workbook_name] = workbook
        else:
            workbook = workbooks[workbook_name]

        if category_name not in categories:
            category = LicenseCategory.create(license=li, name=category_name)
            categories[category_name] = category
        else:
            category = categories[category_name]

        if category_name not in workbook_categories[workbook_name]:
            WorkbookCategory.create(workbook=workbook, category=category)
            workbook_categories[workbook_name][category_name] = True

        img = None
        img_tag_match = img_tag_pattern.findall(description)
        if img_tag_match:
            img_attrs_match = img_attrs_pattern.match(description)
            if img_attrs_match is not None:
                img = img_attrs_match.groupdict()
                description = description.replace(img_tag_match[0], '').strip()
        problem = Problem.create(workbook=workbook,
                                 category=category,
                                 description=description)
        if img is not None:
            img_path = os.path.join(csv_dir, img['src'])
            filename = os.path.basename(img['src'])
            with open(img_path, 'rb') as imf:
                image_file = File.from_file_object(imf, filename, commit=False)
            ProblemImage.create(problem=problem, file=image_file)

        for i, choice in enumerate(choices):
            ProblemChoice.create(problem=problem,
                                 content=choice,
                                 is_correct=i == (int(answer) - 1))
    f.close()
    db_session.commit()
    print(f'[*] {license_name}... Done', flush=True)


def process_explanation_csv(explanation_csv_filepath):
    admin = User.query.filter(User.name == 'dowoome').first()
    licenses = {li.name: li for li in License.query.all()}
    workbooks = {}
    problems = {}
    fn = os.path.basename(explanation_csv_filepath)
    f = open(explanation_csv_filepath, 'r', encoding='utf-8')
    reader = csv.reader(f)

    for row in reader:
        date, no, description, text_exp, video_exp, likes_str = row
        likes = int(int(likes_str) / 10) - 5
        year, month = date[:4], date[4:].strip('0')
        workbook_name = f'{year}년 {month}월'
        license_name = str(fn.split('_')[0]).rstrip('.csv')
        if license_name not in licenses:
            continue

        li = licenses[license_name]
        workbook = None
        if workbook_name not in workbooks:
            workbook = (Workbook.query
                        .join(License)
                        .filter(Workbook.license_id == li.id,
                                Workbook.name == workbook_name)
                        .first())
            if workbook is None:
                continue

            print(f"Found a new workbook: {li.name} - {workbook.name}")
            workbooks[workbook_name] = workbook
            problems[workbook.id] = {
                problem.description: problem
                for i, problem in enumerate(Problem.query
                                            .filter(Problem.workbook_id == workbook.id)
                                            .order_by(Problem.id.asc()))
            }
        if workbook is None:
            workbook = workbooks[workbook_name]

        if description not in problems[workbook.id]:
            continue

        problem = problems[workbook.id][description]
        Explanation.create(user=admin,
                           problem=problem,
                           text_content=text_exp,
                           video_content=video_exp,
                           likes=likes)
    Explanation.commit()


def load_licenses_data():
    open_id = '1kNbxCMFSG6mLijENJqNfy6_3rBZMevMf'

    print("Downloading license CVSs...", end='', flush=True)
    licenses_zip_path = file.download_file_from_google_drive(open_id)
    print("Done", flush=True)
    out_dir = os.path.join(file.fixtures_data_dir,
                           os.path.splitext(os.path.basename(licenses_zip_path))[0])
    print("Decompressing...", end='', flush=True)
    file.decompress_7z(open_id, licenses_zip_path, out_dir)
    print("Done", flush=True)
    for fn in os.listdir(out_dir):
        if not fn.endswith('.csv'):
            continue
        csv_filepath = os.path.join(out_dir, fn)
        process_license_csv(csv_filepath)


def load_explanations_data():
    open_id = '1t9V2ARpPzKotr77ilo6OJWK-3Mxo_pdg'
    print("Downloading explanation CVSs...", end='', flush=True)
    comments_zip_path = file.download_file_from_google_drive(open_id)
    print("Done", flush=True)
    out_dir = os.path.join(file.fixtures_data_dir,
                           os.path.splitext(os.path.basename(comments_zip_path))[0])
    print("Decompressing...", end='', flush=True)
    file.decompress_7z(open_id, comments_zip_path, out_dir)
    print("Done", flush=True)
    for comment_type in ('video_comment', 'cbt_comment', 'blog_comment'):
        comment_csv_dir = os.path.join(out_dir, 'total_comment', comment_type)
        for fn in os.listdir(comment_csv_dir):
            if not fn.endswith('.csv'):
                continue
            csv_filepath = os.path.join(comment_csv_dir, fn)
            process_explanation_csv(csv_filepath)


def main():
    create_admins()
    load_licenses_data()
    load_explanations_data()


if __name__ == '__main__':
    main()
