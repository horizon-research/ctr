import matplotlib.pyplot as plt
import numpy as np
import math
import torch
import colour
from matplotlib.patches import Ellipse

from deserialization import SubjectTests

tests = SubjectTests.from_json("data/lp3484nv31aqnh0jx.json")

red_tests_treatment = tests.filter_primary("w").filter_control()

# threshold_uv = np.asarray([test.threshold_lab for test in red_tests_treatment])[:, 1:]
# base_uv = np.asarray([test.base_lab for test in red_tests_treatment][0])[1:]

threshold_uv = np.asarray([test.threshold_xy for test in red_tests_treatment])
base_uv = np.asarray([test.base_xy for test in red_tests_treatment][0])

# Center points around origin
origin_uv = threshold_uv - base_uv
# Convert to polar coordinates
origin_u = origin_uv[:, 0]
origin_v = origin_uv[:, 1]
origin_r = np.sqrt(origin_u ** 2 + origin_v ** 2)
origin_theta = np.arctan(origin_v, origin_u)


# Initialize parameters
a = torch.tensor(data=0.1, requires_grad=True)
b = torch.tensor(data=0.1, requires_grad=True)
theta_0 = torch.tensor(data=0.0, requires_grad=True)

origin_r = torch.tensor(data=origin_r)
origin_theta = torch.tensor(data=origin_theta)

print(origin_theta)

# Gradient descent
opt = torch.optim.Adam([a, b, theta_0], lr=1)
sched = torch.optim.lr_scheduler.StepLR(opt, step_size=10, gamma=0.9)
epochs = 1000
criterion = torch.nn.MSELoss()

for epoch in range(epochs):
    r_predictions = (a * b) / torch.sqrt(
        (b * torch.cos(origin_theta - theta_0)) ** 2 +
        (a * torch.sin(origin_theta - theta_0)) ** 2
    )

    loss = criterion(r_predictions, origin_r)
    print(r_predictions)
    print(origin_r)

    opt.zero_grad()
    loss.backward()
    opt.step()
    # sched.step()

    print("Epoch {}: {}".format(epoch + 1, loss))

print("a: {}, b: {}, theta: {}".format(a.item(), b.item(), theta_0.item()))
print(theta_0.item() * 180 / math.pi)

# Scatter
fig, ax = plt.subplots()
ax.scatter(threshold_uv[:, 0], threshold_uv[:, 1], c="red")
ax.scatter(base_uv[0], base_uv[1], c="black")
ax.add_patch(Ellipse(xy=(base_uv[0], base_uv[1]), width=a.item() * 2, height=b.item() * 2,
                     angle=(theta_0.item() * 180 / math.pi),
                     facecolor='none', edgecolor='b', lw=4))
ax.set_ylim(bottom=-5, top=5)
ax.set_xlim(left=-5, right=5)

plt.show()

