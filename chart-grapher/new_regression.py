import matplotlib.pyplot as plt
import numpy as np
import math
from matplotlib.patches import Ellipse

from deserialization import SubjectTests
from premade import cart_to_pol


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

# Calculate scatter matrix
u4_sum = np.sum(origin_threshold_u ** 4)
u3_v_sum = np.sum(origin_threshold_u ** 3 * origin_threshold_v)
u2_v2_sum = np.sum(origin_threshold_u ** 2 * origin_threshold_v ** 2)
u_v3_sum = np.sum(origin_threshold_u * origin_threshold_v ** 3)
u_v_sum = np.sum(origin_threshold_u * origin_threshold_v)
v4_sum = np.sum(origin_threshold_v ** 4)
v2_sum = np.sum(origin_threshold_v ** 2)
u2_sum = np.sum(origin_threshold_u ** 2)
num_samples = len(threshold_uv)

scatter_matrix = np.asarray([
    [u4_sum, u3_v_sum, u2_v2_sum, u2_sum],
    [u3_v_sum, u2_v2_sum, u_v3_sum, u_v_sum],
    [u2_v2_sum, u_v3_sum, v4_sum, v2_sum],
    [u2_sum, u_v_sum, v2_sum, num_samples]
])

# Constraint matrix enforcing 4ac - b^2 = 1
constraint_matrix = np.asarray([
    [0, 0, 2, 0],
    [0, -1, 0, 0],
    [2, 0, 0, 0],
    [0, 0, 0, 0]
])

# Eigensystem solving
inv_scatter = np.linalg.inv(scatter_matrix)
eig_matrix = inv_scatter @ constraint_matrix
eig_values, eig_vectors = np.linalg.eig(eig_matrix)

# Filter for smallest positive non-zero eigenvalue, eigenvector pair
valid_eig_value = min([eig_value for eig_value in eig_values if eig_value > 0])
valid_eig_value_index = np.where(eig_values == valid_eig_value)
valid_eig_vector = eig_vectors[:, valid_eig_value_index].flatten()

print("Eig values:", eig_values)
print("Valid eig value:", valid_eig_value)
print("Valid eig value index:", valid_eig_value_index)
print("Eig vectors:", eig_vectors)
print("Valid eig vector:", valid_eig_vector)

# Extract parameters
a_param = valid_eig_vector[0]
b_param = valid_eig_vector[1]
c_param = valid_eig_vector[2]
d_param = valid_eig_vector[3]

# print(a_param, b_param, c_param, d_param)
orig_params = np.asarray([a_param, b_param, c_param, 0, 0, d_param])
cart_params = cart_to_pol(orig_params)
param_a = cart_params[2]
param_b = cart_params[3]
param_phi = cart_params[5]

print("Original params:", orig_params)
print("Cartesian params:", cart_to_pol(orig_params))

# Scatter
fig, ax = plt.subplots()
ax.scatter(threshold_uv[:, 0], threshold_uv[:, 1], c="red")
ax.scatter(base_uv[0], base_uv[1], c="black")
ax.set_ylim(bottom=-1, top=1)
ax.set_xlim(left=-1, right=1)
ax.add_patch(Ellipse(xy=(base_uv[0], base_uv[1]), width=param_a * 2, height=param_b * 2,
                     angle=(param_phi * 180 / math.pi),
                     facecolor='none', edgecolor='b', lw=4))

plt.show()
