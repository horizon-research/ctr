import numpy as np
from premade import fit_ellipse, cart_to_pol

from deserialization import SubjectTests

# Import and filter tests
tests = SubjectTests.from_json("data/lp3484nv31aqnh0jx.json")
red_tests_treatment = tests.filter_primary("w").filter_control()

# Obtain base UV and thresholds
threshold_uv = np.asarray([test.threshold_xy for test in red_tests_treatment])
base_uv = np.asarray([test.base_xy for test in red_tests_treatment][0])

# Normalize thresholds around origin
origin_threshold_uv = threshold_uv - base_uv
origin_threshold_u = origin_threshold_uv[:, 0]
origin_threshold_v = origin_threshold_uv[:, 1]

print(cart_to_pol(fit_ellipse(origin_threshold_u, origin_threshold_v)))
print(origin_threshold_uv)