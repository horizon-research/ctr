import os
import json
import numpy as np
import matplotlib.pyplot as plt

from deserialization import SubjectTests
from regression import regress_ellipse
from graph_helpers import graph_scatter, graph_ellipse

# Generate graph for each dataset

# Compile datasets
json_files = dict()
name_to_cvd = dict()
for file in os.listdir('data/'):
    if file.endswith('.json'):
        json_files[file] = SubjectTests.from_json(os.path.join('data/', file))
        name_to_cvd[file] = json.load(open(os.path.join('data/', file), "r"))["page_stats"]["info"]["cvdType"]

json_files = {file_name: json_file for file_name, json_file in json_files.items() if name_to_cvd[file_name] == "Deuteranopia"}


# Segment dataset by primary and control/treatment
data_by_trial = dict()
for test_name, test_data in json_files.items():
    test_trials = dict()
    # Horrible code do not look
    test_trials['wc'] = {"data": test_data.filter_primary('w').filter_control(), "scatter_color": "silver"}
    test_trials['wt'] = {"data": test_data.filter_primary('w').filter_treatment(), "scatter_color": "black"}
    test_trials['rc'] = {"data": test_data.filter_primary('r').filter_control(), "scatter_color": "red"}
    test_trials['rt'] = {"data": test_data.filter_primary('r').filter_treatment(), "scatter_color": "maroon"}
    test_trials['bc'] = {"data": test_data.filter_primary('b').filter_control(), "scatter_color": "blue"}
    test_trials['bt'] = {"data": test_data.filter_primary('b').filter_treatment(), "scatter_color": "navy"}
    test_trials['gc'] = {"data": test_data.filter_primary('g').filter_control(), "scatter_color": "lime"}
    test_trials['gt'] = {"data": test_data.filter_primary('g').filter_treatment(), "scatter_color": "green"}

    data_by_trial[test_name] = test_trials


# Calculate ellipse polar parameters
for test_name, test_trials in data_by_trial.items():
    for trial_settings, trial_data in test_trials.items():
        data_by_trial[test_name][trial_settings]["ellipse"] = regress_ellipse(trial_data["data"])


char_to_color = {
    "w": "grey",
    "r": "red",
    "b": "blue",
    "g": "green"
}


# Graph each test and save image of plot
for test_name, test_trials in data_by_trial.items():
    # Bad code please don't look :(
    for trial_ids in [('wc', 'wt'), ('rc', 'rt'), ('bc', 'bt'), ('gc', 'gt')]:
        fig = plt.figure()
        ax = fig.add_subplot()

        control_trial_dict = test_trials[trial_ids[0]]
        treatment_trial_dict = test_trials[trial_ids[1]]

        treatment_trial_data = treatment_trial_dict["data"]
        treatment_trial_data_xy = np.asarray([test.threshold_uv for test in treatment_trial_data])
        treatment_trial_data_x = treatment_trial_data_xy[:, 0]
        treatment_trial_data_y = treatment_trial_data_xy[:, 1]

        graph_scatter(ax, treatment_trial_data_x, treatment_trial_data_y, treatment_trial_dict["scatter_color"], label="treatment")
        graph_ellipse(ax, treatment_trial_dict["ellipse"], treatment_trial_dict["scatter_color"])

        control_trial_data = control_trial_dict["data"]
        control_trial_data_xy = np.asarray([test.threshold_uv for test in control_trial_data])
        control_trial_data_x = control_trial_data_xy[:, 0]
        control_trial_data_y = control_trial_data_xy[:, 1]

        graph_scatter(ax, control_trial_data_x, control_trial_data_y, control_trial_dict["scatter_color"], label="control")
        graph_ellipse(ax, control_trial_dict["ellipse"], control_trial_dict["scatter_color"])

        ax.legend()
        ax.set_title(test_name[0:-5] + " " + char_to_color[trial_ids[0][0]] + ", CVD: " + name_to_cvd[test_name])
        ax.set_xlabel("x")
        ax.set_ylabel("y")

        plt.savefig("processed/" + test_name[0:-5] + "_" + trial_ids[0][0] + ".png")

