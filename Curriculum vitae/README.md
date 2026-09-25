# 📄 Interactive Curriculum Vitae — Power BI

An interactive resume built as a Power BI report. It presents 15+ years of data analytics
experience as a dashboard, so you can explore skills, roles, certifications and projects
rather than read a static page.

![Resume dashboard preview](./images/cv-overview.png)


---

## 👩‍💼 About Me

**Ankita Banerjee** — Data and AI Professional  | BI · Data Engineering · Analytics Engineering & AI 

Senior Data Analyst with 15+ years building enterprise BI platforms end to end — from ETL pipeline design and semantic modelling to data governance frameworks and executive reporting. Implemented governance programs that reduced data incident tickets by 30% and delivered company-wide reporting adopted by 4,000+ users. Deep hands-on expertise in the modern 
Microsoft data stack: Microsoft Fabric, Power BI CI/CD with TMDL and Git, and AI-assisted development including 
Claude MCP server integration with Power BI and Copilot Studio agents.  I am DP-700 certified and hold a Power Platform
Administrator role with governance responsibilities.

---

## 📊 What's Inside the Report

| Page | What it shows |
|------|---------------|
| **Profile Overview** | Summary, headline KPIs (years of experience, certifications, projects delivered) |
| **Career Timeline** | Roles and organizations over time, with key achievements per role |
| **Skills Matrix** | Technical skills by category and proficiency level |
| **Certifications & Education** | DP-700 (Microsoft Fabric), Master's degree, DBA program at Westcliff University |
| **Projects** | Selected analytics projects, with links to the other folders in this repo |

---

## 🛠️ How It Was Built

- **Data:** Resume content structured into tables (Roles, Skills, Certifications, Projects, Education)
- **Data model:** Star schema with a date dimension to drive the career timeline
- **DAX:** Measures for years of experience, skill counts and dynamic titles
- **Design:** Custom theme, page navigation buttons, tooltips and drill-through to role details

### Sample DAX measure

```dax
Years of Experience =
DATEDIFF ( MIN ( Roles[StartDate] ), TODAY (), YEAR )
```

---

## 🧰 Skills Demonstrated

![Power BI](https://img.shields.io/badge/Power_BI-F2C811?style=flat&logo=powerbi&logoColor=black)
![Microsoft Fabric](https://img.shields.io/badge/Microsoft_Fabric-0078D4?style=flat)
![Azure](https://img.shields.io/badge/Azure-0078D4?style=flat&logo=microsoftazure&logoColor=white)
![SQL](https://img.shields.io/badge/SQL-336791?style=flat&logo=postgresql&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)
![Snowflake](https://img.shields.io/badge/Snowflake-29B5E8?style=flat&logo=snowflake&logoColor=white)
![Databricks](https://img.shields.io/badge/Databricks-FF3621?style=flat&logo=databricks&logoColor=white)

Data modeling · DAX · Power Query · Report design · Data governance · Storytelling with data

---

## 📂 Folder Contents

```
Curriculum Vitae/
├── README.md
├── Ankita-Banerjee-CV.pbix     ← Power BI report
└── images/
    └── cv-overview.png         ← screenshot used above
```

## ▶️ How to Open

1. Download the `.pbix` file (click the file, then **Download raw file**).
2. Open it in **Power BI Desktop** (free from the Microsoft Store).
3. Or skip the download and use the **live link** at the top of this page.

---

## 📬 Contact

[LinkedIn]() · [Email](ankita.banerjee@protonmail.com) · [Portfolio home](../README.md)
