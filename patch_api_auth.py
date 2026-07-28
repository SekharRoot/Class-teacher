import os
import re

api_files = [
    "src/api/attendance.ts",
    "src/api/classes.ts",
    "src/api/leaves.ts",
    "src/api/users.ts",
    "src/api/schools.ts",
    "src/api/students/index.ts",
    "src/api/students/images.ts",
    "src/api/students/sync.ts"
]

def patch_file(filepath):
    if not os.path.exists(filepath):
        print(f"Skipping {filepath} (does not exist)")
        return

    with open(filepath, "r") as f:
        content = f.read()

    # ensure waitForAuthInit is imported
    if "waitForAuthInit" not in content and "db" in content:
        # find where db is imported from ../lib/firebase
        if 'import { db' in content:
            content = re.sub(r'(import {[^}]*db[^}]*)(} from ["\']../lib/firebase["\'];?)', r'\1, waitForAuthInit \2', content)
        elif 'import { ' in content and 'from "../lib/firebase"' in content:
            content = re.sub(r'(import {[^}]*)(} from ["\']../lib/firebase["\'];?)', r'\1, waitForAuthInit \2', content)

    # Now prepend await waitForAuthInit(); to exported async functions
    # function name usually: export const something = async
    
    # We'll just patch the specific functions causing the issue
    # Or just patch all `async (`
    # Actually, it's safer to just patch it in the specific hooks that throw errors on mount.
    pass

