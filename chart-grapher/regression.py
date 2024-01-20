import numpy as np
from deserialization import SubjectTests
from ellipse import EllipseParameters


def regress_ellipse(data: SubjectTests, uv: bool) -> EllipseParameters:
    # Obtain base UV and thresholds
    threshold_uv = np.asarray([
        test.threshold_uv if uv else test.threshold_xy
        for test in data
    ])
    base_uv = np.asarray([test.base_uv if uv else test.base_xy for test in data][0])

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

    # Extract parameters
    a_param = valid_eig_vector[0]
    b_param = valid_eig_vector[1]
    c_param = valid_eig_vector[2]
    d_param = valid_eig_vector[3]

    # Convert to polar coordinates
    orig_params = np.asarray([a_param, b_param, c_param, 0, 0, d_param])
    cart_params = cart_to_pol(orig_params)
    param_a = cart_params[2]
    param_b = cart_params[3]
    param_phi = cart_params[5]

    return EllipseParameters(base_uv[0], base_uv[1], param_a, param_b, param_phi)


def cart_to_pol(coeffs):
    """
    Taken from SciPy: https://scipython.com/blog/direct-linear-least-squares-fitting-of-an-ellipse/

    Convert the cartesian conic coefficients, (a, b, c, d, e, f), to the
    ellipse parameters, where F(x, y) = ax^2 + bxy + cy^2 + dx + ey + f = 0.
    The returned parameters are x0, y0, ap, bp, e, phi, where (x0, y0) is the
    ellipse centre; (ap, bp) are the semi-major and semi-minor axes,
    respectively; e is the eccentricity; and phi is the rotation of the semi-
    major axis from the x-axis.

    """

    # We use the formulas from https://mathworld.wolfram.com/Ellipse.html
    # which assumes a cartesian form ax^2 + 2bxy + cy^2 + 2dx + 2fy + g = 0.
    # Therefore, rename and scale b, d and f appropriately.
    a = coeffs[0]
    b = coeffs[1] / 2
    c = coeffs[2]
    d = coeffs[3] / 2
    f = coeffs[4] / 2
    g = coeffs[5]

    den = b**2 - a*c
    if den > 0:
        raise ValueError('coeffs do not represent an ellipse: b^2 - 4ac must'
                         ' be negative!')

    # The location of the ellipse centre.
    x0, y0 = (c*d - b*f) / den, (a*f - b*d) / den

    num = 2 * (a*f**2 + c*d**2 + g*b**2 - 2*b*d*f - a*c*g)
    fac = np.sqrt((a - c)**2 + 4*b**2)
    # The semi-major and semi-minor axis lengths (these are not sorted).
    ap = np.sqrt(num / den / (fac - a - c))
    bp = np.sqrt(num / den / (-fac - a - c))

    # Sort the semi-major and semi-minor axis lengths but keep track of
    # the original relative magnitudes of width and height.
    width_gt_height = True
    if ap < bp:
        width_gt_height = False
        ap, bp = bp, ap

    # The eccentricity.
    r = (bp/ap)**2
    if r > 1:
        r = 1/r
    e = np.sqrt(1 - r)

    # The angle of anticlockwise rotation of the major-axis from x-axis.
    if b == 0:
        phi = 0 if a < c else np.pi/2
    else:
        phi = np.arctan((2.*b) / (a - c)) / 2
        if a > c:
            phi += np.pi/2
    if not width_gt_height:
        # Ensure that phi is the angle to rotate to the semi-major axis.
        phi += np.pi/2
    phi = phi % np.pi

    return x0, y0, ap, bp, e, phi
