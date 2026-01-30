# 🏥 MedHive Team Cheatsheet

**Your Golden Rule:** Work ONLY in your branch (`patient`, `clinic`, etc). NEVER touch `main`.

---

## 1️⃣ One-Time Setup (Do this once)

1.  **Clone the Repo**:
    ```bash
    git clone https://github.com/zakisheriff/MedHive.git
    cd MedHive
    ```


2.  **Switch to your Team Branch**:
    ```bash
    git checkout <your-team-branch>
    # Example: git checkout patient
    ```

### 3. Focus Your Workspace (Manual Setup)
To ensure you don’t accidentally touch other files, you can run this command to **hide everything else** on your computer.

*   **For Patient Team:**
    ```bash
    git sparse-checkout init --cone
    git sparse-checkout set Patient
    ```
    *Now you will ONLY see the `Patient` folder.*

*   **For Clinic Team:**
    ```bash
    git sparse-checkout init --cone
    git sparse-checkout set Clinic
    ```
    *Now you will ONLY see the `Clinic` folder.*

*   **For Pharma Team:**
    ```bash
    git sparse-checkout init --cone
    git sparse-checkout set PharmaCompany
    ```
    *Now you will ONLY see the `PharmaCompany` folder.*

### 4. How to See Everything Again (Disable Focus Mode)
If you are confused or can't see files you need:
```bash
git sparse-checkout disable
```
*This brings back all folders (`Landing`, `Clinic`, etc).*

*(See table below for your folder)*

| Team | Your Shared Branch | Allowed Folder |
| :--- | :--- | :--- |
| **Patient Team** | `patient` | `Patient/` |
| **Clinic Team** | `clinic` | `Clinic/` |
| **Pharma Team** | `pharma` | `PharmaCompany/` |

---

## 2️⃣ Daily Routine (Every Day)

**Step 1: Start your day (Get latest changes)**
```bash
git pull origin <your-team-branch>   # Example: git pull origin patient
```

**Step 2: Do your work**
*   Write code, save files, have fun.

**Step 3: Save your work**
```bash
git add .
git commit -m "Describe what you did"
git push origin <your-team-branch>
```
*   ✅ **Done!** Your code is safe on GitHub.
*   *Repeat this as many times as you want.*

---

## 3️⃣ Sending to Production (When Finished)

**Only do this when your feature is 100% complete.**

1.  Go to **GitHub.com**.
2.  Click **"Compare & pull request"**.
3.  Set **Base: `main`** ⬅️ **Compare: `<your-team-branch>`**.
4.  Click **Create Pull Request**.
5.  **Wait for Zaki to approve.**

---


---

## 4️⃣ How to get 200+ Commits (University Stats) 🎓

If you need a high commit count for grading, follow these 2 rules:

1.  **Commit Small & Often**: Don't wait to finish the whole login page.
    *   Added a button? `git commit`
    *   Changed color? `git commit`
    *   Fixed typo? `git commit`
    *   *This is valid and professional.*


2.  **CRITICAL: How to Merge (Don't lose your points!)**:
    When you move your code to `main` on GitHub, you will see a big green button.
    **You MUST click the arrow and select "Create a merge commit".**

    *   ✅ **Create a merge commit**:
        *   GitHub keeps ALL 50 of your commits.
        *   Your contribution graph goes UP. 📈
        *   You get credit for all 50 changes.

    *   ❌ **Squash and merge** (DANGER!):
        *   GitHub deletes your 50 commits and makes just 1 big one.
        *   **You literally lose 49 commits from your stats.**
        *   DO NOT CLICK THIS.

