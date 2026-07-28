import os
import re
from pathlib import Path

def check_file(path):
    with open(path, 'r') as f:
        content = f.read()

    # Split by functions loosely (by "const " or "function " or "export ")
    # Actually, simpler:
    # find lines that have `return ...;` and then later `useSomething(...)`
    # this is simplistic, but works for most functional components.

    lines = content.split('\n')
    inside_component = False
    return_seen = False
    for i, line in enumerate(lines):
        # very basic heuristics
        if re.search(r'^\s*(export )?(const|function) [A-Z]\w+.*(props|\(\)).*\{', line) or re.search(r'^\s*export default function [A-Z]', line):
            inside_component = True
            return_seen = False
        
        if inside_component:
            # If we see `if (...) return` or `return <`
            if re.search(r'^\s*if\s*\(.*return', line) or re.search(r'^\s*return\s+<', line) or re.search(r'^\s*return\s+null', line):
                return_seen = True
            
            # If we see a hook
            if re.search(r'\buse[A-Z]\w*\(', line):
                if return_seen:
                    print(f"Potential Hook Error in {path}:{i+1}: {line.strip()}")
            
            # if we see a closing brace at column 0 or 1, maybe component ended
            if line == "}" or line == "};":
                inside_component = False

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            check_file(os.path.join(root, file))

print("Done")
