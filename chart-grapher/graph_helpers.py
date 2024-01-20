import numpy as np
import math
import matplotlib.pyplot as plt
import itertools
import colour
from ellipse import EllipseParameters
from matplotlib.patches import Ellipse
from matplotlib.legend_handler import HandlerTuple
from deserialization import SubjectTests


CONTROL_PLOTS = []
TREATMENT_PLOTS = []


def graph_scatter(ax, x_data, y_data, color, label, treatment):
    plot = ax.scatter(x_data, y_data, c=color, label=label)
    if treatment:
        TREATMENT_PLOTS.append(plot)
    else:
        CONTROL_PLOTS.append(plot)


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


def graph_gamut(ax, user_cs):
    if user_cs == 0:
        # sRGB
        ax.plot([0.64, 0.3], [0.33, 0.6], color="pink")
        ax.plot([0.3, 0.15], [0.6, 0.06], color="pink")
        ax.plot([0.64, 0.15], [0.33, 0.06], color="pink")
    else:
        # P3
        ax.plot([0.680, 0.265], [0.320, 0.690], color="pink")  # R-G
        ax.plot([0.265, 0.150], [0.690, 0.060], color="pink")  # G-B
        ax.plot([0.680, 0.150], [0.320, 0.060], color="pink")  # R-B


def graph_confusion_lines(ax, cvd: str, centers: list[tuple[float, float]]):
    if cvd not in ["Deuteranopia", "Protanopia", "Tritanopia"]:
        return

    if cvd == "Deuteranopia":
        for center in centers:
            ax.axline(xy1=center, xy2=(1.08, -0.8), color="grey", linestyle='dashed')
    elif cvd == "Protanopia":
        for center in centers:
            ax.axline(xy1=center, xy2=(0.747, 0.253), color="grey", linestyle='dashed')
    else:
        for center in centers:
            ax.axline(xy1=center, xy2=(0.171, 0), color="grey", linestyle='dashed')


def graph_dataset(dataset: dict[str, dict], uv: bool, title: str, cvd: str, user_cs: int | None):

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
                      label="treatment" if trial_dict["treatment"] else "control", treatment=trial_dict["treatment"])
        graph_ellipse(ax, trial_dict["ellipse"], trial_dict["scatter_color"])

    ax.legend([tuple(CONTROL_PLOTS), tuple(TREATMENT_PLOTS)], ["control", "treatment"],
        handler_map={tuple: HandlerTuple(ndivide=None)}
    )

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

        graph_confusion_lines(ax, cvd, [
            (0.31272660439158345, 0.3290231524027522),  # w
            (0.4959647353534689, 0.32957012102737054),  # r
            (0.3041068028398634, 0.4871936939603871),   # g
            (0.19958547204032873, 0.14937709890627032)  # b
        ])

        if user_cs is not None:
            graph_gamut(ax, user_cs)

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
