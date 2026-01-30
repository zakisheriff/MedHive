# 🏥 MedHive Team Cheatsheet

**Your Golden Rule:** Work ONLY in your branch (`zaki`, `raheem`, etc). NEVER touch `main`.

---

## 1️⃣ One-Time Setup (Do this once)

1.  **Clone the Repo**:
    ```bash
    git clone https://github.com/zakisheriff/MedHive.git
    cd MedHive
    ```

2.  **Switch to YOUR Branch**:
    *   **Zaki**: `git checkout zaki`
    *   **Rahman**: `git checkout rahman`
    *   **Raheem**: `git checkout raheem`
    *   **Hanaa**: `git checkout hanaa`
    *   **Afker**: `git checkout afker`
    *   **Kausian**: `git checkout kausian`

3.  **Hide Other Folders (Focus Mode)**:
    *Run these 2 commands to see ONLY your work:*
    ```bash
    git sparse-checkout init --cone
    git sparse-checkout set <Your-Folder-Name>
    # Example: git sparse-checkout set Patient
    ```
    *(See table below for your folder)*

| User | Folder Name |
| :--- | :--- |
| **Zaki, Rahman** | `Patient` |
| **Raheem, Hanaa** | `Clinic` |
| **Afker, Kausian** | `PharmaCompany` |

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

### 🆘 Emergency Commands
*   **"I messed up!"**: `git checkout .` (Undoes unsaved changes)
*   **"Where am I?"**: `git branch` (Check you are NOT on main)
