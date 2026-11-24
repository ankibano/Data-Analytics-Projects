# Report Spec

## Report identity
- **Report name:** `AnkitaB_Resume.pbix`
- **Semantic model:** `Ankita_Banerjee_CV.SemanticModel` (local CV model, unchanged)
- **Audience:** Recruiters and hiring managers
- **Primary purpose:** Scan Ankita's professional profile, skills, qualifications, and full career history in one place.
- **Delivery target:** One local `.pbix`; no Fabric publishing.

## Semantic model binding
- **Entry mode:** Local Model
- **Model name:** `Ankita_Banerjee_CV.SemanticModel`
- **Model ID:** Not applicable (local model)
- **connectionString:** `byPath ../Ankita_Banerjee_CV.SemanticModel`

## User decisions and constraints
- **Scope:** Combine all CV-page content and the full Experiences-page wording on one page. Keep the CV semantic model unchanged.
- **Page count:** One page; 11 visuals.
- **Interactivity:** No slicers, bookmarks, drillthrough, or page navigation. Preserve existing CV hyperlinks.
- **Design direction:** Use the Green page's muted olive palette, decorative background, and portrait-resume structure from `Power BI Resume.pbix`. Reflow the content into non-overlapping placements. The user approved replacing the radar chart with a horizontal bar chart and choosing a taller portrait canvas to preserve text legibility.
- **Publishing:** Not requested; keep all work local.
- **Tooling:** `powerbi-report-author` 0.4.0 and Node.js 24.19.0 are available. Desktop preview is available. The modeling MCP can inspect the local model; DAX sampling is unavailable for its offline TMDL connection.
- **Model edit permissions:** Do not add, remove, or modify model objects.
- **Accessibility:** Use dark text on light surfaces, retain text labels alongside colored marks, provide descriptive alt text, and set tab order to follow the page's reading order.
- **Data caveats:** The model has 5 tables, 19 columns, no measures, and no relationships. `Skill Data[Scale]`, `Others Skill[Scale]`, and `Language[Level]` are integer columns; their actual values could not be sampled from the offline connection. Do not invent score ranges or change their meaning. Experience descriptions remain source text; date fields in the model are strings.

## Narrative
- **Core story:** Ankita is an Application Owner and Power Platform professional with a career spanning business intelligence, data warehousing, and application development.
- **Audience promise:** A recruiter can quickly find the candidate's identity and contact links, then scan ratings, full experience details, education, credentials, achievements, and written interests.
- **Key questions answered:** What is Ankita's current professional focus? Which skills and languages are listed? What roles and responsibilities make up her work history? What qualifications and achievements are included?

## Design identity (from the `design` mode)
- **Tone:** Brand-Forward, adapted to the source Green resume: calm, polished, warm-neutral surfaces, muted olive accents, charcoal typography, and compact editorial hierarchy.
- **Signature:** A tall portrait layout with a quiet olive header, aligned section blocks, and charcoal text on warm light panels.
- **Brownfield delta:** Not applicable; this is a new report using an existing template's visual language.

## Page plan (archetype from the `design` mode)
1. **Ankita Banerjee | Application Owner, Power Platform**
   - **Archetype:** Narrative (curated professional profile)
   - **Layout variant:** B — Single-Column-Scroll, adapted to a one-page portrait CV.
   - **Purpose:** Present the complete CV as a readable, recruiter-facing profile rather than an exploratory analytics dashboard.
   - **Visuals:** Six textboxes; three horizontal bar charts for core skills, other skills, and languages; and one profile image. Ten visuals total. Hobby photos are omitted; written interests remain in the qualifications textbox. The detailed experience text is split into two blocks for readable line length. The two template bar-chart placements will be separated; the radar visual is replaced with a bar chart. Template pivot tables and decorative education/award icons are not copied because the CV's headings and text carry that information, and the experience text already carries the complete role history.
   - **Fields/measures:** `Skill Data[Skill Name]` with `Skill Data[Scale]`; `Others Skill[Other Skills]` with `Others Skill[Scale]`; `Language[Language]` with `Language[Level]`. Preserve the CV's profile, contact links, summary, all five experience entries and their bullets, education, training, certifications, achievements, and interests from the PBIP. Do not copy the template author's content.
   - **Slicers/interactions:** None; preserve the hyperlinks in the CV content.

## Design system summary
- **Theme name + base palette:** Source `CY22SU09` theme with the Green page's per-visual styling and decorative background. Main colors: muted olive `#BFB791`, dark olive `#4A483B`, charcoal `#242628`, warm surface `#FBF9F9`, page surface `#F3F3F3`, and divider `#DFE1E3`.
- **Color semantics:** Use dark olive for rating bars and the muted olive for restrained accents only. Ratings remain labeled and sorted; color is not their sole signal.
- **Typography pairing:** Segoe UI throughout; 24 pt page title, 12–14 pt section headings, and 9 pt minimum body text, with four or fewer size tiers.
- **Layout pattern:** 900 × 1632 portrait canvas, 12-column grid, 24 px margins, 16 px gutters, and 8 px snap. The increased height is intentional to preserve the original wording.
- **Accessibility commitments:** Verify body-text contrast at 4.5:1 and non-text contrast at 3:1; add alt text to all charts and images; preserve readable labels and logical keyboard/tab order.

## Model requirements
- **Existing measures:** None.
- **New measures:** None.
- **New calculated columns:** None.
- **Relationship/sort requirements:** No relationship changes. Sort rating bars by their source integer values descending; do not assume or add a rating scale.

## Canonical design contract

The following `Design Brief:` YAML is authoritative for implementation.

```yaml
Design Brief:
  generated_by: powerbi-report-cli
  contract_version: 1
  mode: greenfield
  design_identity:
    tone: "Brand-Forward Green Resume: calm, polished, warm-neutral surfaces, muted olive accents, charcoal typography, and compact editorial hierarchy."
    signature: "A tall portrait layout with a quiet olive header, aligned section blocks, and charcoal text on warm light panels."
  archetype: Narrative
  navigation_model: none
  color_map:
    - measure: "Skill Data[Scale]"
      color: "#4A483B"
      tint: "#DFE1E3"
    - measure: "Others Skill[Scale]"
      color: "#4A483B"
      tint: "#DFE1E3"
    - measure: "Language[Level]"
      color: "#4A483B"
      tint: "#DFE1E3"
  pages:
    - name: "Ankita Banerjee | Application Owner, Power Platform"
      role: landing
      archetype: Narrative
      layout_variant: B
      variant_rationale: "The single-page CV is a curated vertical profile; a taller portrait layout supports its long-form experience text while retaining the user's requested 11-visual structure."
      navigation: []
      page_background: "#F3F3F3"
      layout_summary: "A clear identity header leads into the profile, three side-by-side rating charts, two blocks of complete experience text, and a full-width qualifications footer. Use only the Green template styling and generic decorative background, not its author's resume content."
      layout_contract:
        canvas:
          width: 900
          height: 1632
          margin: 24
          gutter: 16
          snap: 8
        grid:
          columns: 12
          rows: 12
          regions:
            header: [1, 1, 13, 2]
            portrait: [1, 2, 4, 4]
            identity: [4, 2, 13, 3]
            summary: [4, 3, 13, 4]
            core_skills: [1, 4, 5, 7]
            additional_skills: [5, 4, 9, 7]
            language_skills: [9, 4, 13, 7]
            recent_experience: [1, 7, 13, 9]
            earlier_experience: [1, 9, 13, 11]
            qualifications: [1, 11, 13, 13]
          placements:
            - id: page_title
              region: header
              kind: textbox
              text: "Ankita Banerjee | Application Owner, Power Platform"
              purpose: "Identify the candidate and current professional focus immediately."
            - id: profile_photo
              region: portrait
              kind: image
              purpose: "Use the existing CV profile photograph."
              alt_text: "Portrait of Ankita Banerjee."
            - id: identity_contact
              region: identity
              kind: textbox
              purpose: "Show the source CV role, location, and existing LinkedIn/GitHub links without changing their text or targets."
            - id: profile_summary
              region: summary
              kind: textbox
              purpose: "Preserve the professional summary from the source CV verbatim."
            - id: core_skills
              region: core_skills
              kind: barChart
              purpose: "Compare the candidate's core skill ratings."
              field_bindings:
                Category: "Skill Data[Skill Name]"
                Y: "Skill Data[Scale]"
              sort_policy: value_desc
              color_strategy: gradient
              alt_text: "Core skills ranked by their source rating values."
            - id: additional_skills
              region: additional_skills
              kind: barChart
              purpose: "Compare the candidate's other skill ratings without the area distortion of the template radar chart."
              field_bindings:
                Category: "Others Skill[Other Skills]"
                Y: "Others Skill[Scale]"
              sort_policy: value_desc
              color_strategy: gradient
              alt_text: "Additional skills ranked by their source rating values."
            - id: language_skills
              region: language_skills
              kind: barChart
              purpose: "Compare language proficiency ratings."
              field_bindings:
                Category: "Language[Language]"
                Y: "Language[Level]"
              sort_policy: value_desc
              color_strategy: gradient
              alt_text: "Languages ranked by their source proficiency values."
            - id: recent_experience
              region: recent_experience
              kind: textbox
              purpose: "Preserve the three most recent role headings and every associated responsibility bullet from the source Experiences page."
            - id: earlier_experience
              region: earlier_experience
              kind: textbox
              purpose: "Preserve the two earlier role headings and every associated responsibility bullet from the source Experiences page."
            - id: qualifications
              region: qualifications
              kind: textbox
              purpose: "Preserve education, training, certifications, achievements, and written interests from the CV verbatim."
          space_audit:
            content_cell_count: 132
            placed_cell_count: 132
            empty_cell_pct: 0
            unplaced_regions: []
            largest_region:
              name: recent_experience
              pct_of_content: 18.2
            balance_rationale: "The header is reserved; profile, charts, two experience blocks, and the full-width qualifications block tile the remaining grid without overlap or dead bands. The two experience blocks together carry the page's longest content, while the three rating charts remain equally sized."
      interaction_pattern:
        drill_targets: []
        cross_filter_rules: "No report interactions; present the page as a static resume, while retaining the source hyperlinks."
      accessibility:
        alt_text_strategy: "Describe each rating chart as a comparison of the named category and its source rating, and describe the profile portrait. Keep visual reading and tab order top-to-bottom, left-to-right."
        contrast_notes: "Use #242628 or #4A483B for text on #FBF9F9/#F3F3F3. Use #BFB791 only for non-text accents unless a contrast check passes."
      theme:
        base: "CY22SU09 with the Green Resume page's generic background asset and per-visual styling"
        user_overrides: "Use only the Green variant; do not copy the template author's name, resume text, model, or report content."
  content_policy: "Retain CV wording, links, roles, dates, bullets, qualifications, achievements, and interests verbatim; reflow and style only."
  model_policy: "Use the existing local CV model unchanged. Add no tables, measures, calculated columns, or relationships."
  visual_count: 10
  delivery:
    target: "Local AnkitaB_Resume.pbix"
    publish: false
    semantic_model: "Ankita_Banerjee_CV.SemanticModel"
```

## Implementation notes
- **Model changes:** None. Keep `Ankita_Banerjee_CV.SemanticModel` unchanged.
- **PBIR/report authoring:** Create a separate report project; preserve all source CV text and links. Keep the final page at 10 visuals and omit hobby photos. Use three labeled horizontal bar charts, and separate all visual bounds.
- **Validation:** Validate the PBIR and JSON, confirm visual count and bindings, then reload in Desktop and review a full-page screenshot for text fit, clipping, and contrast. DAX data sampling was unavailable from the offline model connection; verify rendered rating values in Desktop without changing their meaning.
- **Desktop screenshot verification:** Desktop preview is available. Capture and review the complete page after the approved spec is implemented.
- **Publishing boundary:** Do not publish.
- **Risks:** The one-page content is dense; the approved taller canvas and split experience text blocks are intended to preserve readability. The report-author `pack` command creates a Fabric report-definition payload, not a `.pbix`; after approval, verify a supported Desktop save/package route and do not rename a PBIP folder to `.pbix`.
