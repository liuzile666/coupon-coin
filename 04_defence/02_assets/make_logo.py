"""Generate CPC coin-style logo (512x512 PNG)."""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Circle, FancyBboxPatch
import matplotlib.patheffects as pe

NAVY   = "#1E2761"
NAVY_D = "#0B132B"
GOLD   = "#E0B250"
GOLD_D = "#B8912F"
ICE    = "#CADCFC"
WHITE  = "#FFFFFF"

fig, ax = plt.subplots(figsize=(5.12, 5.12), dpi=100)
ax.set_xlim(-1, 1); ax.set_ylim(-1, 1)
ax.set_aspect("equal"); ax.axis("off")

# outer gold ring
ax.add_patch(Circle((0, 0), 0.95, facecolor=GOLD,  edgecolor=GOLD_D, lw=3, zorder=1))
# inner navy disc
ax.add_patch(Circle((0, 0), 0.80, facecolor=NAVY,  edgecolor=NAVY_D, lw=2, zorder=2))
# subtle highlight arc on top
ax.add_patch(Circle((-0.18, 0.25), 0.55, facecolor="none", edgecolor="#2A3A82",
                    lw=1.2, linestyle=":", zorder=3))

# CPC text
txt = ax.text(0, 0.02, "CPC",
              ha="center", va="center",
              fontsize=72, fontweight="bold", color=GOLD,
              family="Georgia", zorder=4)
txt.set_path_effects([pe.withStroke(linewidth=2, foreground=NAVY_D)])

# tiny subtitle inside
ax.text(0, -0.42, "COUPON COIN",
        ha="center", va="center",
        fontsize=10.5, fontweight="bold", color=ICE,
        family="Georgia", zorder=4, alpha=0.85)

# Save as transparent-ish PNG
import os
os.makedirs("assets", exist_ok=True)
fig.savefig("assets/cpc-logo.png", dpi=100, bbox_inches="tight", pad_inches=0.05,
            transparent=False, facecolor="white")
print("OK -> assets/cpc-logo.png")
