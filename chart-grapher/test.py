import json
import plotly.express as px
import numpy as np
import colour
import matplotlib.pyplot as plt


DATA_FILE = "./data/lkroqa6136dhvb0jm.json"

# Open JSON file to python dict
raw_data = json.load(open(DATA_FILE))

# List of every test
tests = [test for test in raw_data["all_test_stats"].values()]

# Unique base xy values and corresponding colors
unique_base_xy_colors = {
    (0.19958547204032873, 0.14937709890627032): "blue",
    (0.31272660439158345, 0.3290231524027522): "grey",
    (0.3041068028398634, 0.4871936939603871): "green",
    (0.4959647353534689, 0.32957012102737054): "red"
}

primary_to_base_xy = {
    "r": (0.4959647353534689, 0.32957012102737054),
    "g": (0.3041068028398634, 0.4871936939603871),
    "b": (0.19958547204032873, 0.14937709890627032),
    "w": (0.31272660439158345, 0.3290231524027522)
}

# Compile tests per base xy
test_per_base_xy = {
    (0.19958547204032873, 0.14937709890627032): list(),
    (0.31272660439158345, 0.3290231524027522): list(),
    (0.3041068028398634, 0.4871936939603871): list(),
    (0.4959647353534689, 0.32957012102737054): list()
}

for test in tests:
    base_xy = tuple(test["base_xy"])
    test_per_base_xy[base_xy].append(test)


def rgb_to_xy(rgb: list):
    rgb = np.asarray([rgb]).transpose()

    rgb2xyz = np.asarray([
        [0.4124564, 0.3575761, 0.1804375],
        [0.2126729, 0.7151522, 0.0721750],
        [0.0193339, 0.1191920, 0.9503041]
    ])

    xyz = np.matmul(rgb2xyz, rgb)
    xyz_total = np.sum(xyz)
    x = xyz[0] / xyz_total
    y = xyz[1] / xyz_total

    return x.item(), y.item()


# Test graph
fig = px.scatter(x=[colour.xy_to_Luv_uv(rgb_to_xy(test["threshold_color"]))[0] for test in tests[:32]],
                 y=[colour.xy_to_Luv_uv(rgb_to_xy(test["threshold_color"]))[1] for test in tests[:32]])
fig.show()


def fit_ellipse(x, y):
    """

    Fit the coefficients a,b,c,d,e,f, representing an ellipse described by
    the formula F(x,y) = ax^2 + bxy + cy^2 + dx + ey + f = 0 to the provided
    arrays of data points x=[x1, x2, ..., xn] and y=[y1, y2, ..., yn].

    Based on the algorithm of Halir and Flusser, "Numerically stable direct
    least squares fitting of ellipses'.


    """

    D1 = np.vstack([x**2, x*y, y**2]).T
    D2 = np.vstack([x, y, np.ones(len(x))]).T
    S1 = D1.T @ D1
    S2 = D1.T @ D2
    S3 = D2.T @ D2
    T = -np.linalg.inv(S3) @ S2.T
    M = S1 + S2 @ T
    C = np.array(((0, 0, 2), (0, -1, 0), (2, 0, 0)), dtype=float)
    M = np.linalg.inv(C) @ M
    eigval, eigvec = np.linalg.eig(M)
    con = 4 * eigvec[0]* eigvec[2] - eigvec[1]**2
    ak = eigvec[:, np.nonzero(con > 0)[0]]
    return np.concatenate((ak, T @ ak)).ravel()


def cart_to_pol(coeffs):
    """

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


def get_ellipse_pts(params, npts=100, tmin=0, tmax=2*np.pi):
    """
    Return npts points on the ellipse described by the params = x0, y0, ap,
    bp, e, phi for values of the parametric variable t between tmin and tmax.

    """

    x0, y0, ap, bp, e, phi = params
    # A grid of the parametric variable, t.
    t = np.linspace(tmin, tmax, npts)
    x = x0 + ap * np.cos(t) * np.cos(phi) - bp * np.sin(t) * np.sin(phi)
    y = y0 + ap * np.cos(t) * np.sin(phi) + bp * np.sin(t) * np.cos(phi)
    return x, y


x_pts = [colour.xy_to_Luv_uv(rgb_to_xy(test["threshold_color"]))[0] for test in tests[:32] if test["base_xy"] == [0.19958547204032873, 0.14937709890627032]]
y_pts = [colour.xy_to_Luv_uv(rgb_to_xy(test["threshold_color"]))[1] for test in tests[:32] if test["base_xy"] == [0.19958547204032873, 0.14937709890627032]]

base_uv = colour.xy_to_Luv_uv([0.19958547204032873, 0.14937709890627032])

coeffs = fit_ellipse(np.asarray(x_pts), np.asarray(y_pts))
print('Fitted parameters:')
print('a, b, c, d, e, f =', coeffs)
x0, y0, ap, bp, e, phi = cart_to_pol(coeffs)
print('x0, y0, ap, bp, e, phi = ', x0, y0, ap, bp, e, phi)

plt.plot(x_pts, y_pts, 'x')     # given points
x, y = get_ellipse_pts((x0, y0, ap, bp, e, phi))
plt.plot(x, y)
plt.show()
