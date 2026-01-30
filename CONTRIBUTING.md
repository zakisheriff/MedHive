# 🏥 MedHive Team Cheatsheet

**Your Golden Rule:** Work ONLY in your branch (`zaki`, `raheem`, etc). NEVER touch `main`.

---

## 1️⃣ One-Time Setup (Do this once)

1.  **Clone the Repo**:
    ```bash
    git clone https://github.com/zakisheriff/MedHive.git
    cd MedHive
    ```

2.  **Switch
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

*(See table below for your folder)*

| Team | Your Shared Branch | Allowed Folder |
| :--- | :--- | :--- |
| **Patient Team** | `patient` | `Patient/` |
| **Clinic Team** | `clinic` | `Clinic/` |
| **Pharma Team** | `pharma` | `PharmaCompany/` |

---

## 2️⃣ Daily Routine (Every Day)

**Step 1: Start your day**
```bash
git pull origin <your-name>   # specific branch update
```

**Step 2: Do your work**
*   Write code, save files, have fun.

**Step 3: Save your work**
```bash
git add .
git commit -m "Describe what you did"
git push origin <your-name>
```
*   ✅ **Done!** Your code is safe on GitHub.
*   *Repeat this as many times as you want.*

---

## 3️⃣ Sending to Production (When Finished)

**Only do this when your feature is 100% complete.**

1.  Go to **GitHub.com**.
2.  Click **"Compare & pull request"**.
3.  Set **Base: `main`** ⬅️ **Compare: `<your-name>`**.
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

2.  **CRITICAL: Merge Correctly**:
    *   When merging on GitHub, check the dropdown button.
    *   ✅ Use **"Create a merge commit"**. (Keeps all your 50 tiny commits).
    *   ❌ **DO NOT use "Squash and merge"**. (Combines everything into 1 commit -> You lose 49 points).

