import os
import re

with open("src/pages/Settings.tsx", "r") as f:
    content = f.read()

# We need to extract the parts and replace them in the main file
