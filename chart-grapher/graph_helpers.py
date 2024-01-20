import numpy as np
import math
import matplotlib.pyplot as plt
import itertools
import colour
from ellipse import EllipseParameters
from matplotlib.patches import Ellipse
from matplotlib.legend_handler import HandlerTuple
from deserialization import SubjectTests


def graph_scatter(ax, x_data, y_data, color, label):
    ax.scatter(x_data, y_data, c=color, label=label)


def graph_ellipse(ax, ellipse_data: EllipseParameters, color):
    ellipse = Ellipse(
        xy=(ellipse_data.x0, ellipse_data.y0),
        width=ellipse_data.ap*2,
        height=ellipse_data.bp*2,
        angle=ellipse_data.phi * 180 / math.pi,
        color=color,
        linestyle='-',
        fill=False
    )
    ax.add_patch(ellipse)


def graph_spectral_locus():
    colour.plotting.diagrams.plot_spectral_locus(spectral_locus_colours="RGB")


def graph_dataset(dataset: dict[str, dict], uv: bool, title: str):

    if uv:
        fig, ax = colour.plotting.diagrams.plot_spectral_locus(spectral_locus_colours="RGB", show=False, method='CIE 1976 UCS')
    else:
        fig, ax = colour.plotting.diagrams.plot_spectral_locus(spectral_locus_colours="RGB", show=False)

    for trial_id, trial_dict in dataset.items():
        trial_data = trial_dict["data"]
        trial_data_xy = np.asarray([test.threshold_uv if uv else test.threshold_xy for test in trial_data])
        trial_data_x = trial_data_xy[:, 0]
        trial_data_y = trial_data_xy[:, 1]

        graph_scatter(ax, trial_data_x, trial_data_y, trial_dict["scatter_color"],
                      label="treatment" if trial_dict["treatment"] else "control")
        graph_ellipse(ax, trial_dict["ellipse"], trial_dict["scatter_color"])

    ax.legend(handler_map={tuple: HandlerTuple(ndivide=None)})

    if uv:
        ax.set_xlabel("u'")
        ax.set_ylabel("v'")
        ax.set_ylim(bottom=-0.1, top=0.7)
        ax.set_xlim(left=-0.1, right=0.7)
    else:
        ax.set_xlabel("x")
        ax.set_ylabel("y")
        ax.set_ylim(bottom=-0.025, top=0.875)
        ax.set_xlim(left=-0.1, right=0.8)

    ax.set_title(title)

    plt.show()


def collect_dataset(subject_tests: SubjectTests):
    """
    Collects dataset in single dictionary by test trial type
    """

    # Dictionary of test trials
    test_trials = dict()

    test_trials['wc'] = {"data": subject_tests.filter_primary('w').filter_control(), "scatter_color": "silver", "treatment": False}
    test_trials['wt'] = {"data": subject_tests.filter_primary('w').filter_treatment(), "scatter_color": "black", "treatment": True}
    test_trials['rc'] = {"data": subject_tests.filter_primary('r').filter_control(), "scatter_color": "red", "treatment": False}
    test_trials['rt'] = {"data": subject_tests.filter_primary('r').filter_treatment(), "scatter_color": "maroon", "treatment": True}
    test_trials['bc'] = {"data": subject_tests.filter_primary('b').filter_control(), "scatter_color": "blue", "treatment": False}
    test_trials['bt'] = {"data": subject_tests.filter_primary('b').filter_treatment(), "scatter_color": "navy", "treatment": True}
    test_trials['gc'] = {"data": subject_tests.filter_primary('g').filter_control(), "scatter_color": "lime", "treatment": False}
    test_trials['gt'] = {"data": subject_tests.filter_primary('g').filter_treatment(), "scatter_color": "green", "treatment": True}

    return test_trials


def collect_datasets(subject_tests_list: list[SubjectTests], join: bool):
    """
    Collects multiple datasets in single dictionary
    """
    test_trial_dicts = [collect_dataset(subject_tests) for subject_tests in subject_tests_list]

    # TODO: rewrite horrible code
    if join:
        wc_trial_data = SubjectTests(list(itertools.chain.from_iterable(
            [test_trial_data["wc"]["data"] for test_trial_data in test_trial_dicts])
        ))
        wt_trial_data = SubjectTests(list(itertools.chain.from_iterable(
            [test_trial_data["wt"]["data"] for test_trial_data in test_trial_dicts])
        ))
        rc_trial_data = SubjectTests(list(itertools.chain.from_iterable(
            [test_trial_data["rc"]["data"] for test_trial_data in test_trial_dicts])
        ))
        rt_trial_data = SubjectTests(list(itertools.chain.from_iterable(
            [test_trial_data["rt"]["data"] for test_trial_data in test_trial_dicts])
        ))
        bc_trial_data = SubjectTests(list(itertools.chain.from_iterable(
            [test_trial_data["bc"]["data"] for test_trial_data in test_trial_dicts])
        ))
        bt_trial_data = SubjectTests(list(itertools.chain.from_iterable(
            [test_trial_data["bt"]["data"] for test_trial_data in test_trial_dicts])
        ))
        gc_trial_data = SubjectTests(list(itertools.chain.from_iterable(
            [test_trial_data["gc"]["data"] for test_trial_data in test_trial_dicts])
        ))
        gt_trial_data = SubjectTests(list(itertools.chain.from_iterable(
            [test_trial_data["gt"]["data"] for test_trial_data in test_trial_dicts])
        ))
    else:
        wc_trial_data = [test_trial_data["wc"]["data"].tests for test_trial_data in test_trial_dicts]
        wt_trial_data = [test_trial_data["wt"]["data"].tests for test_trial_data in test_trial_dicts]
        rc_trial_data = [test_trial_data["rc"]["data"].tests for test_trial_data in test_trial_dicts]
        rt_trial_data = [test_trial_data["rt"]["data"].tests for test_trial_data in test_trial_dicts]
        bc_trial_data = [test_trial_data["bc"]["data"].tests for test_trial_data in test_trial_dicts]
        bt_trial_data = [test_trial_data["bt"]["data"].tests for test_trial_data in test_trial_dicts]
        gc_trial_data = [test_trial_data["gc"]["data"].tests for test_trial_data in test_trial_dicts]
        gt_trial_data = [test_trial_data["gt"]["data"].tests for test_trial_data in test_trial_dicts]

        trial_data_lists = [wc_trial_data, wt_trial_data, rc_trial_data, rt_trial_data, bc_trial_data, bt_trial_data, gc_trial_data, gt_trial_data]

        for trial_data_list in trial_data_lists:
            for i in range(len(trial_data_list[0])):
                xyz = np.average([trial_data_item[i].threshold_xyz for trial_data_item in trial_data_list], axis=0)
                luv = np.average([trial_data_item[i].threshold_luv for trial_data_item in trial_data_list], axis=0)

                trial_data_list[0][i].threshold_xyz = xyz
                trial_data_list[0][i].treshold_luv = luv

                trial_data_list[0][i].threshold_xy = colour.XYZ_to_xy(xyz)
                trial_data_list[0][i].threshold_uv = colour.Luv_to_uv(luv)

        wc_trial_data = wc_trial_data[0]
        wt_trial_data = wt_trial_data[0]
        rc_trial_data = rc_trial_data[0]
        rt_trial_data = rt_trial_data[0]
        bc_trial_data = bc_trial_data[0]
        bt_trial_data = bt_trial_data[0]
        gc_trial_data = gc_trial_data[0]
        gt_trial_data = gt_trial_data[0]

    test_trials = dict()

    test_trials['wc'] = {"data": wc_trial_data, "scatter_color": "silver",
                         "treatment": False}
    test_trials['wt'] = {"data": wt_trial_data, "scatter_color": "black",
                         "treatment": True}
    test_trials['rc'] = {"data": rc_trial_data, "scatter_color": "red",
                         "treatment": False}
    test_trials['rt'] = {"data": rt_trial_data, "scatter_color": "maroon",
                         "treatment": True}
    test_trials['bc'] = {"data": bc_trial_data, "scatter_color": "blue",
                         "treatment": False}
    test_trials['bt'] = {"data": bt_trial_data, "scatter_color": "navy",
                         "treatment": True}
    test_trials['gc'] = {"data": gc_trial_data, "scatter_color": "lime",
                         "treatment": False}
    test_trials['gt'] = {"data": gt_trial_data, "scatter_color": "green",
                         "treatment": True}

    return test_trials
