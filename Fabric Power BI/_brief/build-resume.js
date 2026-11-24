'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const reportDir = path.resolve(process.argv[2] || '');
if (!process.argv[2] || !fs.existsSync(path.join(reportDir, 'definition', 'pages', 'pages.json'))) {
  throw new Error('Pass the scaffolded .Report directory.');
}

const definitionDir = path.join(reportDir, 'definition');
const pagesDir = path.join(definitionDir, 'pages');
const pagesMetadata = JSON.parse(fs.readFileSync(path.join(pagesDir, 'pages.json'), 'utf8'));
if (pagesMetadata.pageOrder.length !== 1) throw new Error('Expected the one-page scaffold.');

const pageId = pagesMetadata.pageOrder[0];
const pagePath = path.join(pagesDir, pageId, 'page.json');
const page = JSON.parse(fs.readFileSync(pagePath, 'utf8'));
const visualsDir = path.join(pagesDir, pageId, 'visuals');
const resourcesDir = path.join(reportDir, 'StaticResources', 'RegisteredResources');
const themePath = path.join(reportDir, 'StaticResources', 'SharedResources', 'BaseThemes', 'CY22SU09.json');

function findResource(prefix, extension) {
  const found = fs.readdirSync(resourcesDir).find((name) =>
    name.startsWith(prefix) && name.endsWith(extension)
  );
  if (!found) throw new Error(`Missing report resource: ${prefix}*${extension}`);
  return found;
}

const profileImage = findResource('Ankita_1_(3)003109697691876301', '.jpg');
const hobbyStrip = findResource('AnkitaB_Resume_Hobbies', '.png');
const backgroundImage = findResource('Dia29341719429479058', '.SVG');
if (!fs.existsSync(themePath)) throw new Error('Missing CY22SU09 base theme.');

const literal = (value) => ({ expr: { Literal: { Value: `'${String(value).replaceAll("'", "''")}'` } } });
const bool = (value) => ({ expr: { Literal: { Value: String(value) } } });
const number = (value) => ({ expr: { Literal: { Value: `${value}D` } } });
const integer = (value) => ({ expr: { Literal: { Value: `${value}L` } } });
const fill = (color) => ({ solid: { color: literal(color) } });
const resourceItem = (name) => ({
  expr: {
    ResourcePackageItem: {
      PackageName: 'RegisteredResources',
      PackageType: 1,
      ItemName: name
    }
  }
});
const id = () => crypto.randomBytes(10).toString('hex');
const writeJson = (filePath, value) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
};

function paragraph(runs, alignment, listType) {
  const value = Array.isArray(runs) ? runs : [runs];
  const result = {
    textRuns: value.map((item) => {
      const run = { value: item.value };
      if (item.style && Object.keys(item.style).length) run.textStyle = item.style;
      if (item.url) run.url = item.url;
      return run;
    })
  };
  if (alignment) result.horizontalTextAlignment = alignment;
  if (listType) result.listType = listType;
  return result;
}

const bodyStyle = { fontFamily: 'Segoe UI', fontSize: '9pt', color: '#242628' };
const sectionStyle = { fontFamily: 'Segoe UI Semibold', fontSize: '11pt', fontWeight: 'bold', color: '#4A483B' };
const roleStyle = { fontFamily: 'Segoe UI', fontSize: '10pt', fontWeight: 'bold', fontStyle: 'italic', color: '#4A483B' };
const headingStyle = { fontFamily: 'Segoe UI Semibold', fontSize: '12pt', fontWeight: 'bold', color: '#4A483B' };

function visualContainerObjects(backgroundColor, borderColor, padding) {
  return {
    background: [{
      properties: {
        show: bool(true),
        color: fill(backgroundColor),
        transparency: number(0)
      }
    }],
    border: [{
      properties: {
        show: bool(true),
        color: fill(borderColor),
        width: number(1),
        radius: number(10)
      }
    }],
    padding: [{
      properties: {
        top: number(padding),
        bottom: number(padding),
        left: number(padding),
        right: number(padding)
      }
    }],
    visualHeader: [{ properties: { show: bool(false) } }],
    general: [{ properties: { keepLayerOrder: bool(true) } }]
  };
}

function makeTextbox(name, position, paragraphs, options = {}) {
  const backgroundColor = options.backgroundColor || '#FBF9F9';
  const borderColor = options.borderColor || '#DFE1E3';
  return {
    $schema: 'https://developer.microsoft.com/json-schemas/fabric/item/report/definition/visualContainer/2.9.0/schema.json',
    name,
    position,
    visual: {
      visualType: 'textbox',
      objects: { general: [{ properties: { paragraphs } }] },
      visualContainerObjects: visualContainerObjects(backgroundColor, borderColor, options.padding ?? 12),
      drillFilterOtherVisuals: true
    }
  };
}

function valueAggregation(table, column) {
  return {
    Aggregation: {
      Expression: {
        Column: {
          Expression: { SourceRef: { Entity: table } },
          Property: column
        }
      },
      Function: 0
    }
  };
}

function makeChart(title, altText, table, category, value, nativeValue, position) {
  const categoryRef = `${table}.${category}`;
  const valueRef = `Sum(${table}.${value})`;
  const aggregation = valueAggregation(table, value);
  return {
    $schema: 'https://developer.microsoft.com/json-schemas/fabric/item/report/definition/visualContainer/2.9.0/schema.json',
    name: id(),
    position,
    visual: {
      visualType: 'barChart',
      query: {
        queryState: {
          Category: {
            projections: [{
              field: {
                Column: {
                  Expression: { SourceRef: { Entity: table } },
                  Property: category
                }
              },
              queryRef: categoryRef,
              nativeQueryRef: category,
              active: true
            }]
          },
          Y: {
            projections: [{
              field: aggregation,
              queryRef: valueRef,
              nativeQueryRef: nativeValue
            }]
          }
        },
        sortDefinition: {
          sort: [{ field: aggregation, direction: 'Descending' }],
          isDefaultSort: true
        }
      },
      objects: {
        categoryAxis: [{
          properties: {
            show: bool(true),
            showAxisTitle: bool(false),
            fontFamily: literal('Segoe UI'),
            fontSize: number(9),
            labelColor: fill('#242628'),
            innerPadding: integer(38),
            concatenateLabels: bool(true)
          }
        }],
        valueAxis: [{ properties: { show: bool(false), showAxisTitle: bool(false) } }],
        legend: [{ properties: { show: bool(false) } }],
        zoom: [{ properties: { show: bool(false) } }],
        labels: [{
          properties: {
            show: bool(true),
            labelPosition: literal('OutsideEnd'),
            fontFamily: literal('Segoe UI'),
            fontSize: number(9),
            color: fill('#242628'),
            labelOverflow: bool(true)
          }
        }],
        dataPoint: [{
          properties: {
            fill: {
              solid: {
                color: {
                  expr: {
                    FillRule: {
                      Input: aggregation,
                      FillRule: {
                        linearGradient2: {
                          min: { color: { Literal: { Value: "'#8B8979'" } } },
                          max: { color: { Literal: { Value: "'#4A483B'" } } },
                          nullColoringStrategy: { strategy: { Literal: { Value: "'noColor'" } } }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          selector: { data: [{ dataViewWildcard: { matchingOption: 1 } }] }
        }]
      },
      visualContainerObjects: {
        ...visualContainerObjects('#FBF9F9', '#DFE1E3', 8),
        title: [{
          properties: {
            show: bool(true),
            text: literal(title),
            fontFamily: literal('Segoe UI Semibold'),
            fontSize: number(12),
            fontColor: fill('#4A483B'),
            bold: bool(true),
            alignment: literal('left'),
            titleWrap: bool(false)
          }
        }],
        subTitle: [{ properties: { show: bool(false) } }],
        general: [{
          properties: {
            keepLayerOrder: bool(true),
            altText: literal(altText)
          }
        }]
      },
      drillFilterOtherVisuals: true
    }
  };
}

function makeImage(asset, altText, position, fit, radius) {
  return {
    $schema: 'https://developer.microsoft.com/json-schemas/fabric/item/report/definition/visualContainer/2.9.0/schema.json',
    name: id(),
    position,
    visual: {
      visualType: 'image',
      objects: {
        general: [{ properties: { imageUrl: resourceItem(asset) } }],
        image: [{
          properties: {
            fit: literal(fit),
            altText: literal(altText),
            cornerRadius: integer(radius),
            strokeShow: bool(true),
            strokeWidth: number(2),
            strokeColor: fill('#BFB791'),
            strokeTransparency: number(0)
          }
        }]
      },
      visualContainerObjects: {
        background: [{ properties: { show: bool(false), color: fill('#FBF9F9'), transparency: number(0) } }],
        border: [{ properties: { show: bool(false), color: fill('#DFE1E3'), width: number(1), radius: number(10) } }],
        padding: [{ properties: { top: number(0), bottom: number(0), left: number(0), right: number(0) } }],
        visualHeader: [{ properties: { show: bool(false) } }],
        general: [{ properties: { keepLayerOrder: bool(true) } }]
      },
      drillFilterOtherVisuals: true
    }
  };
}

function experienceParagraphs(heading, roles) {
  const result = [paragraph({ value: heading, style: headingStyle })];
  for (const role of roles) {
    result.push(paragraph({ value: role.title, style: roleStyle }));
    for (const bullet of role.bullets) {
      result.push(paragraph({ value: bullet, style: bodyStyle }, undefined, 'bullet'));
    }
  }
  return result;
}

const recentRoles = [
  {
    title: 'Application Owner, Power Platform in Kemira Oyj : Oct 2022 - Present',
    bullets: [
      'Leading and implementing Environment and sustainability project by driving concept design,  sprints coordinating with department stakeholders and designing data architecture.',
      'Define and execute BI & Analytics strategy  for citizen developers to implement strong administration and governance within the organization for better data security and ALM.',
      'Implemented version control and CI/CD pipeline, standardized templates for Power Platform solutions and Power BI Projects.',
      'Managing Continuous Service Team by ensuring the development and maintenance of scalable dashboards and reports, focusing on stakeholder value and business needs .',
      'Managed admin tasks and auditing platform by reviewing complaince state and documenting analytical processes.',
      'Develop Power Apps and Power Automate solutions by connecting with custom connector , developed in Power Automate for Manufacturing and R&D of Kemira to automate tedious business processes'
    ]
  },
  {
    title: 'Business Intelligence Expert in Kemira Oyj : Dec 2021 - Sep 2022',
    bullets: [
      'Prioritize new development with responsibility for achievement of targets(product characteristics, time, cost, pay-back) and coordinating cross-functional teams.',
      'Organize self-service BI trainings for citizen developers.',
      'Designed, developed, and maintained concrete data models, monitored business performance, provide business solutions by following different statistical methods.',
      'Administration and supporting users and projects with environment provisioning, access rights and development and operational support '
    ]
  },
  {
    title: 'Business Intelligence Developer in Aitomation Oy / Barona Group Oy : Nov 2017 - Nov 2021',
    bullets: [
      'Design and develop insightful and actionable dashboards and reports with interactive visuals to exhibits KPIs, trends and forecast reports.',
      'Collected, cleansed, and provided data warehouse solutions and analyses of structured and unstructured data used for major business initiatives by creating stored procedures and views',
      'Designed ETL flows  o extract data from ERP and CRM application, drive datalake projects and maintained the data pipeline by updating lambda functions, schemas, and views as per customers’ requirements and developed reports in Power BI aligning with stakeholders need.'
    ]
  }
];

const earlierRoles = [
  {
    title: 'Datawarehouse Developer in LohideOy : Mar 2017 – Oct 2017',
    bullets: [
      'Performed ETL process in SAS by blending data from multiple sources.',
      'Created management reports with SSRS as well as SQL and MDX queries.'
    ]
  },
  {
    title: 'Technical Consultant in Capgemini India Pvt Limited Bangalore/Kolkata, India : Jun 2011 – Dec 2015',
    bullets: [
      'Involved in ITIL process of application development and maintenance throughout application lifecycle of global production house.',
      'Summarized weekly status reports based on issues, solutions, improvements, and recommended actions.',
      'Developed test cases, Failure Mode Effective Analysis report and Cost benefit analysis reports by using Excel and Power Pivot.',
      'Developed business reports to identify the most stable and unstable applications and proposed effective measures to reduce incident tickets.'
    ]
  }
];

const contactParagraphs = [
  paragraph({ value: 'LOCATION : Helsinki, Finland', style: bodyStyle }),
  paragraph([
    { value: 'LINKEDIN :  ', style: bodyStyle },
    { value: 'LINK', style: { ...bodyStyle, color: '#4A483B' }, url: 'https://www.linkedin.com/in/ankita-banerjee-4196aab6/' },
    { value: ',  ', style: bodyStyle }
  ]),
  paragraph([
    { value: 'GITHUB : ', style: bodyStyle },
    { value: 'LINK', style: { ...bodyStyle, color: '#4A483B' }, url: 'https://github.com/ankibano' }
  ])
];

const qualificationParagraphs = [
  paragraph({ value: 'EDUCATION', style: headingStyle }),
  paragraph({ value: 'Bachelors of Engineering', style: bodyStyle }),
  paragraph({ value: 'MAY 2011', style: bodyStyle }),
  paragraph({ value: 'RTM Nagpur University', style: bodyStyle }),
  paragraph({ value: '', style: bodyStyle }),
  paragraph({ value: 'Training, Certification and Achievements', style: headingStyle }),
  paragraph({ value: '-> Microsoft Fabric', style: bodyStyle }),
  paragraph({ value: '-> Power Platform Development.', style: bodyStyle }),
  paragraph({ value: '-> Python projects with Azure (Pluralsight.com)', style: bodyStyle }),
  paragraph({ value: '-> Data Management and  visualization in Excel', style: bodyStyle }),
  paragraph([
    { value: '-> ', style: bodyStyle },
    { value: 'Power Platform Fundamentals', style: { ...bodyStyle, color: '#4A483B' }, url: 'https://learn.microsoft.com/en-us/users/ankitabanerjee-1571/credentials/2d5b475666b5771e' }
  ]),
  paragraph({ value: '-> European Power Platform 2023 Conference', style: bodyStyle }),
  paragraph({ value: '-> AWS Certified Cloud Practitioner ', style: bodyStyle }),
  paragraph({ value: '-> Data Science: Aalto Open University ', style: bodyStyle }),
  paragraph([
    { value: '-> ', style: bodyStyle },
    { value: '70-778 Analyzing and visualizing data with Power B', style: { ...bodyStyle, color: '#4A483B' }, url: 'https://www.credly.com/badges/239eaeab-4eb5-4b4d-9430-8751694be8c7/public_url' },
    { value: 'I ', style: bodyStyle }
  ]),
  paragraph([
    { value: '-> ', style: bodyStyle },
    { value: 'Advance SAS Programming 9', style: { ...bodyStyle, color: '#4A483B' }, url: 'https://www.credly.com/badges/a0adaac6-b89b-4be4-9401-93c16b26f1b1/linked_in_profile' },
    { value: ' ', style: bodyStyle }
  ]),
  paragraph({ value: '-> Team player of the Month, Kemira, Finland', style: bodyStyle }),
  paragraph({ value: '-> Client Appreciation Letters, Barona, Finland', style: bodyStyle }),
  paragraph({ value: '-> Project Star Award Q4 2012, Capgemini, India', style: bodyStyle }),
  paragraph({ value: 'INTERESTS', style: sectionStyle }),
  paragraph({ value: 'Travelling', style: bodyStyle }),
  paragraph({ value: 'Fitness & Workout', style: bodyStyle })
];

const visuals = [
  makeTextbox(id(), { x: 24, y: 24, z: 1000, height: 72, width: 852, tabOrder: 1000 }, [
    paragraph({ value: 'ANKITA BANERJEE', style: { fontFamily: 'Segoe UI Semibold', fontSize: '24pt', fontWeight: 'bold', color: '#242628' } }),
    paragraph({ value: 'Application Owner, Power Platform', style: { fontFamily: 'Segoe UI', fontSize: '14pt', color: '#4A483B' } })
  ], { backgroundColor: '#BFB791', borderColor: '#4A483B', padding: 12 }),
  makeImage(profileImage, 'Portrait of Ankita Banerjee.', { x: 24, y: 112, z: 2000, height: 150, width: 150, tabOrder: 2000 }, 'Fill', 12),
  makeTextbox(id(), { x: 194, y: 112, z: 3000, height: 64, width: 682, tabOrder: 3000 }, contactParagraphs, { padding: 8 }),
  makeTextbox(id(), { x: 194, y: 184, z: 4000, height: 78, width: 682, tabOrder: 4000 }, [
    paragraph({ value: 'Passionate to provide business solutions to create better business impact.', style: { ...bodyStyle, fontSize: '11pt', fontStyle: 'italic' } })
  ], { padding: 12 }),
  makeChart('TECHNICAL SKILLS', 'Core skills ranked by their source rating values.', 'Skill Data', 'Skill Name', 'Scale', 'Sum of Scale', { x: 24, y: 278, z: 5000, height: 204, width: 273, tabOrder: 5000 }),
  makeChart('OTHER SKILLS', 'Additional skills ranked by their source rating values.', 'Others Skill', 'Other Skills', 'Scale', 'Sum of Scale', { x: 313, y: 278, z: 6000, height: 204, width: 273, tabOrder: 6000 }),
  makeChart('LANGUAGE SKILLS', 'Languages ranked by their source proficiency values.', 'Language', 'Language', 'Level', 'Sum of Level', { x: 602, y: 278, z: 7000, height: 204, width: 274, tabOrder: 7000 }),
  makeTextbox(id(), { x: 24, y: 498, z: 8000, height: 390, width: 852, tabOrder: 8000 }, experienceParagraphs('WORK EXPERIENCE', recentRoles), { padding: 12 }),
  makeTextbox(id(), { x: 24, y: 904, z: 9000, height: 284, width: 852, tabOrder: 9000 }, experienceParagraphs('EARLIER EXPERIENCE', earlierRoles), { padding: 12 }),
  makeTextbox(id(), { x: 24, y: 1204, z: 10000, height: 404, width: 552, tabOrder: 10000 }, qualificationParagraphs, { padding: 12 }),
  makeImage(hobbyStrip, "Travel and workout photos illustrating the candidate's listed interests.", { x: 592, y: 1204, z: 11000, height: 200, width: 284, tabOrder: 11000 }, 'Fit', 10)
];

fs.mkdirSync(visualsDir, { recursive: true });
for (const visual of visuals) writeJson(path.join(visualsDir, visual.name, 'visual.json'), visual);

page.width = 900;
page.height = 1632;
page.displayOption = 'FitToPage';
page.objects = {
  ...(page.objects || {}),
  background: [{
    properties: {
      color: fill('#F3F3F3'),
      transparency: number(0),
      image: {
        image: {
          name: literal('Dia2.SVG'),
          url: resourceItem(backgroundImage),
          scaling: literal('Normal')
        }
      }
    }
  }],
  outspace: [{
    properties: {
      color: fill('#F3F3F3'),
      transparency: number(0)
    }
  }]
};
writeJson(pagePath, page);

const reportPath = path.join(definitionDir, 'report.json');
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
report.themeCollection.baseTheme = {
  name: 'CY22SU09',
  reportVersionAtImport: { visual: '1.8.75', report: '2.0.75', page: '1.3.75' },
  type: 'SharedResources'
};
report.resourcePackages = [
  {
    name: 'SharedResources',
    type: 'SharedResources',
    items: [{ name: 'CY22SU09', path: 'BaseThemes/CY22SU09.json', type: 'BaseTheme' }]
  },
  {
    name: 'RegisteredResources',
    type: 'RegisteredResources',
    items: [profileImage, hobbyStrip, backgroundImage].map((name) => ({
      name,
      path: name,
      type: 'Image'
    }))
  }
];
report.objects = {
  ...(report.objects || {}),
  section: [{
    properties: { verticalAlignment: literal('Top') }
  }],
  outspacePane: [{
    properties: { expanded: bool(false) }
  }]
};
writeJson(reportPath, report);
console.log(JSON.stringify({ pageId, visualCount: visuals.length, resources: [profileImage, hobbyStrip, backgroundImage] }));
