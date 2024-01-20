from __future__ import annotations

import json
import colour
import numpy as np


base_xy_to_colors = {
    (0.19958547204032873, 0.14937709890627032): "b",
    (0.31272660439158345, 0.3290231524027522): "w",
    (0.3041068028398634, 0.4871936939603871): "g",
    (0.4959647353534689, 0.32957012102737054): "r"
}

srgb_to_xyz = np.asarray([
    [0.4124564,  0.3575761,  0.1804375],
    [0.2126729,  0.7151522,  0.0721750],
    [0.0193339,  0.1191920,  0.9503041],
])


class SubjectTests:
    """
    Class that represents a set of tests from a single subject
    """
    def __init__(self, tests: list[Test]):
        """
        Constructor from list of Tests
        """
        self.tests = tests

    @staticmethod
    def from_json(path: str) -> SubjectTests:
        """
        :param path: Path to json file of tests
        :return: Initialized SubjectTests object
        """
        raw_data = json.load(open(path))
        # Extract and initialize tests
        treatment_tests = [Test(raw_test, treatment=True) for raw_test in list(raw_data["all_test_stats"].values())[:32]]
        control_tests = [Test(raw_test, treatment=False) for raw_test in list(raw_data["all_test_stats"].values())[32:]]
        tests = treatment_tests + control_tests

        return SubjectTests(tests)

    def filter_treatment(self) -> SubjectTests:
        filtered_tests = [test for test in self.tests if test.treatment]
        return SubjectTests(filtered_tests)

    def filter_control(self) -> SubjectTests:
        filtered_tests = [test for test in self.tests if not test.treatment]
        return SubjectTests(filtered_tests)

    def filter_primary(self, primary: str):
        if primary not in ["r", "g", "b", "w"]:
            assert False
        filtered_tests = [test for test in self.tests if test.base_primary == primary]
        return SubjectTests(filtered_tests)

    def __iter__(self):
        for test in self.tests:
            yield test


class Test:
    """
    Representation of a single test
    """
    def __init__(self, raw_test: dict, treatment: bool):
        # Base color encodings
        self.base_rgb = raw_test["base_rgb"]
        # self.base_xy = raw_test["base_xy"]
        self.base_xyz = srgb_to_xyz @ self.base_rgb # colour.sRGB_to_XYZ(self.base_rgb)
        self.base_xy = colour.XYZ_to_xy(self.base_xyz)
        self.base_lab = colour.XYZ_to_Lab(self.base_xyz)
        self.base_luv = colour.XYZ_to_Luv(self.base_xyz)
        self.base_uv = colour.Luv_to_uv(self.base_luv)

        # Label of primary
        self.base_primary = base_xy_to_colors[tuple(raw_test["base_xy"])]

        # Is the test in the treatment group?
        self.treatment = treatment

        # Threshold encodings
        self.threshold_rgb = raw_test["threshold_color"]
        self.threshold_xyz = srgb_to_xyz @ self.threshold_rgb  #colour.sRGB_to_XYZ(self.threshold_rgb)
        self.threshold_xy = colour.XYZ_to_xy(self.threshold_xyz)
        self.threshold_lab = colour.XYZ_to_Lab(self.threshold_xyz)
        self.threshold_luv = colour.XYZ_to_Luv(self.threshold_xyz)
        self.threshold_uv = colour.Luv_to_uv(self.threshold_luv)

