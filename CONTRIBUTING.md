# MedHive Team Workflow & Rules

**Read this before writing a single line of code.**

We run this project like a professional IT company. To prevent crashes and conflicts, you must follow these rules strictly.

## 🚨 The Golden Rule
**NEVER PUSH DIRECTLY TO `main`.**
The `main` branch is our production server. If you break `main`, you break the product for everyone.

---

## 1. Know Your Lane (Branching)
You have been assigned a specific component. You are **only** allowed to work in your dedicated branch and folder.

| Team | Branch Name | Allowed Folder |
| :--- | :--- | :--- |
| **Patient Team** | `patient` | `Patient/` |
| **Clinic Team** | `clinic` | `Clinic/` |
| **Pharma Team** | `pharma-company` | `PharmaCompany/` |

### How to Start Working
1.  **Switch to your branch**:
    ```bash
    git checktout <your-branch-name>
    # Example: git checkout patient
    ```
2.  **Verify you are safe**:
    ```bash
    git branch
    # It should show * patient (or your branch)
    ```

---

## 2. The Daily Workflow
You have total freedom in your own branch.

1.  **Code & Save**: Write your code in your folder.
2.  **Commit Often**:
    ```bash
    git add .
    git commit -m "Fixed login button color"
    ```
3.  **Push Freely**:
    ```bash
    git push origin <your-branch-name>
    ```
    *You can push 100 times a day to your branch. It will not affect the main website.*

---

## 3. Going Live (Merging to Main)
When your feature is 100% complete and bug-free, you request to merge it into the main project.

1.  **Go to GitHub**: Open the repository page.
2.  **Click "Compare & pull request"**.
3.  **Set the Direction**:
    *   **base**: `main`
    *   **compare**: `<your-branch-name>`
4.  **Request Review**:
    *   Add **@zakisheriff** as the reviewer.
    *   Click "Create Pull Request".

**⛔ STOP HERE. You cannot do anything else.**
*   The system will block you from merging.
*   The Team Lead (@zakisheriff) will review your code.
*   If perfectly safe, he will approve and merge it.
*   If there are bugs, he will request changes. Fix them and push again.

---

## 4. Emergency Fixes
If `main` is broken, **DO NOT PANIC AND PUSH**.
1.  Create a fix in your branch.
2.  Push to your branch.
3.  Open a Pull Request immediately.
