import os
import json
import csv
import click

from graph_helpers import collect_dataset, collect_datasets, graph_dataset
from deserialization import SubjectTests
from regression import regress_ellipse

# Path constants
BASE_DIRECTORY = os.path.dirname(__file__)
DATA_DIRECTORY = os.path.join(BASE_DIRECTORY, 'data/')
PARTICIPANT_TABLE = os.path.join(BASE_DIRECTORY, 'participants.csv')


@click.group()
def command_group():
    pass


@command_group.command()
@click.argument('test_file', type=click.Path(exists=True))
@click.argument('color_space', type=click.Choice(['uv', 'xy'], case_sensitive=False))
def graph_file(test_file: str, color_space: str):
    """
    Graphs a specific individual test file
    """
    uv = color_space == "uv"

    # Collate trials
    subject_tests = SubjectTests.from_json(test_file)
    trial_dicts = collect_dataset(subject_tests)

    # User color space
    user_cs = get_file_user_cs(test_file)

    # Regress ellipses
    for trial_dict in trial_dicts.values():
        trial_dict["ellipse"] = regress_ellipse(trial_dict["data"], uv)

    # Graph
    graph_dataset(trial_dicts, uv, "Test file: {}; CVD: {}".format(
        os.path.basename(test_file),
        get_cvd_of_file(test_file)
    ), get_cvd_of_file(test_file), None)


@command_group.command()
@click.argument('participant_id', type=str)
@click.argument('color_space', type=click.Choice(['uv', 'xy'], case_sensitive=False))
@click.argument('collection_strategy', type=click.Choice(['mean', 'join']))
def graph_participant(participant_id: str, color_space: str, collection_strategy: str):
    """
    Graphs all test files belonging to a single participant
    """
    uv = color_space == "uv"
    join = collection_strategy == "join"

    # Collate trials
    test_files = get_participant_tests(participant_id)
    test_datasets = [SubjectTests.from_json(test_file) for test_file in test_files]
    trial_dicts = collect_datasets(test_datasets, join)

    # User color space
    user_cs = get_participant_user_cs(participant_id)

    # Regress ellipses
    for trial_dict in trial_dicts.values():
        trial_dict["ellipse"] = regress_ellipse(trial_dict["data"], uv)

    # Graph
    graph_dataset(trial_dicts, uv, "Participant: {}; CVD: {}".format(
        participant_id,
        get_participant_cvd(participant_id),
    ), get_participant_cvd(participant_id), None)


@command_group.command()
@click.argument('cvd', type=click.Choice(['p', 'd', 't', 'pa', 'da', 'ta']))
@click.argument('color_space', type=click.Choice(['uv', 'xy'], case_sensitive=False))
@click.argument('collection_strategy', type=click.Choice(['mean', 'join']))
def graph_cvd(cvd: str, color_space: str, collection_strategy: str):
    """
    Graphs all tests belonging to participants with a specific CVD type
    """

    uv = color_space == "uv"
    join = collection_strategy == "join"
    cvd_lookup = {
        "d": "Deuteranopia",
        "p": "Protanopia",
        "t": "Tritanopia",
        "pa": "Protanomaly",
        "da": "Deuteranomaly",
        "ta": "Tritanomaly",
    }
    cvd = cvd_lookup[cvd.lower()]

    # Scan through all test files
    cvd_matched_tests = list()
    for file in os.listdir(DATA_DIRECTORY):
        # Filter out non-json files
        if file.endswith(".json"):
            json_file = json.load(open(os.path.join(DATA_DIRECTORY, file), "r"))
            cvd_type = json_file["page_stats"]["info"]["cvdType"]
            if cvd_type == cvd:
                cvd_matched_tests.append(SubjectTests.from_json(os.path.join(DATA_DIRECTORY, file)))

    # Join datasets
    trial_dicts = collect_datasets(cvd_matched_tests, join)

    # Regress ellipses
    for trial_dict in trial_dicts.values():
        trial_dict["ellipse"] = regress_ellipse(trial_dict["data"], uv)

    # Graph
    graph_dataset(trial_dicts, uv, "CVD: {}. N={}".format(cvd, len(cvd_matched_tests)), cvd, user_cs=None)


@command_group.command()
def list_participants():
    """
    Lists all participants and their corresponding CVD types
    """
    # Open participants CSV
    with open(PARTICIPANT_TABLE) as participants_csv:
        participant_reader = csv.reader(participants_csv)

        # Find individual tests from participant ID
        participant_csv_rows = [row for row in participant_reader]
        participant_ids = [row[0] for row in participant_csv_rows]
        participant_sample_tests = [row[1].strip() + ".json" for row in participant_csv_rows]
        participant_sample_test_files = [os.path.join(DATA_DIRECTORY, test_id) for test_id in participant_sample_tests]

        # Get CVD of each participant
        participant_cvds = [
            json.load(open(test_file, "r"))["page_stats"]["info"]["cvdType"]
            for test_file in participant_sample_test_files
        ]

        # Dict mapping participant id to CVD type
        participant_id_to_cvd = dict(zip(participant_ids, participant_cvds))

        # Print out participant ids and corresponding CVD types
        for participant_id, cvd_type in participant_id_to_cvd.items():
            print("{}: {}".format(participant_id, cvd_type))


@command_group.command()
def list_tests():
    """
    Lists all individual test files and their corresponding CVD types
    """
    # Scan through all test files
    test_file_to_cvd = dict()
    for file in os.listdir(DATA_DIRECTORY):
        # Filter out non-json files
        if file.endswith(".json"):
            json_file = json.load(open(os.path.join(DATA_DIRECTORY, file), "r"))
            cvd_type = json_file["page_stats"]["info"]["cvdType"]
            test_file_to_cvd[file] = cvd_type

    # Print out test files and corresponding CVD types
    for test_file, cvd_type in test_file_to_cvd.items():
        print("{}: {}".format(test_file, cvd_type))


def get_cvd_of_file(file_path: str):
    json_file = json.load(open(file_path, "r"))
    cvd_type = json_file["page_stats"]["info"]["cvdType"]
    return cvd_type


def get_participant_tests(participant_id: str):
    # Open participants CSV
    with open(PARTICIPANT_TABLE) as participants_csv:
        participant_reader = csv.reader(participants_csv)

        # Find individual tests from participant ID
        participant_csv_row = [row for row in participant_reader if row[0] == participant_id][0]

        if len(participant_csv_row) == 0:
            raise Exception("No tests found for specified participant", participant_id)

        participant_tests = participant_csv_row[1:]

        participant_test_paths = [os.path.join(DATA_DIRECTORY, participant_test) + ".json" for participant_test in participant_tests]

        return participant_test_paths


def get_participant_cvd(participant_id: str):
    # Open participants CSV
    with open(PARTICIPANT_TABLE) as participants_csv:
        participant_reader = csv.reader(participants_csv)

        # Find individual tests from participant ID
        participant_csv_rows = [row for row in participant_reader]
        participant_ids = [row[0] for row in participant_csv_rows]
        participant_sample_tests = [row[1].strip() + ".json" for row in participant_csv_rows]
        participant_sample_test_files = [os.path.join(DATA_DIRECTORY, test_id) for test_id in participant_sample_tests]

        # Get CVD of each participant
        participant_cvds = [
            json.load(open(test_file, "r"))["page_stats"]["info"]["cvdType"]
            for test_file in participant_sample_test_files
        ]

        # Dict mapping participant id to CVD type
        participant_id_to_cvd = dict(zip(participant_ids, participant_cvds))
        return participant_id_to_cvd[participant_id]


def get_file_user_cs(file_path: str):
    json_file = json.load(open(file_path, "r"))
    user_cs = json_file["page_stats"]["cs"]
    return user_cs


def get_participant_user_cs(participant_id: str):
    # Open participants CSV
    with open(PARTICIPANT_TABLE) as participants_csv:
        participant_reader = csv.reader(participants_csv)

        # Find individual tests from participant ID
        participant_csv_rows = [row for row in participant_reader]
        participant_ids = [row[0] for row in participant_csv_rows]
        participant_sample_tests = [row[1].strip() + ".json" for row in participant_csv_rows]
        participant_sample_test_files = [os.path.join(DATA_DIRECTORY, test_id) for test_id in participant_sample_tests]

        # Get user cs of each participant
        participant_user_cs = [
            json.load(open(test_file, "r"))["page_stats"]["cs"]
            for test_file in participant_sample_test_files
        ]

        # Dict mapping participant id to user cs
        participant_id_to_cvd = dict(zip(participant_ids, participant_user_cs))
        return participant_id_to_cvd[participant_id]


if __name__ == "__main__":
    command_group()
