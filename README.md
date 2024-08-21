# Tools in Data Science

This repository has the course content and questions for
[Tools in Data Science](https://study.iitm.ac.in/ds/course_pages/BSSE2002.html) -
a diploma level data science course at IIT Madras.

Course material:

- [Course page](course-page.md)
- [0. Course introduction](0-course-introduction.md)
- [1. Data discovery](1-data-discovery.md)
- [2. Data sourcing](2-data-sourcing.md)
- [3. Data preparation](3-data-preparation.md)
- [4. Data analysis](4-data-analysis.md)
- [5. Large language models](5-large-language-models.md)
- [6. Geospatial and network analysis](6-geospatial-and-network-analysis.md)
- [7. Data visualization](7-data-visualization.md)
- [8. Data storytelling](8-data-storytelling.md)
- [9. Deployment](9-deployment.md)

Questions

- [Self assessment](questions/self-assessment.yaml)
- [Graded Assignment 1](questions/ga1.yaml)
- [Graded Assignment 2](questions/ga2.yaml)
- [Graded Assignment 3](questions/ga3.yaml)
- [Graded Assignment 4](questions/ga4.yaml)
- [Project 1](questions/project1.yaml)
- [Graded Assignment 5](questions/ga5.yaml)
- [Graded Assignment 6](questions/ga6.yaml)
- [Graded Assignment 7](questions/ga7.yaml)
- [Project 2](questions/project2.yaml)
- [Graded Assignment 8](questions/ga8.yaml)
- [Remote Online Exam](questions/roe.yaml)
- [Graded Assignment 9](questions/ga9.yaml)
- [Final end-term](questions/final.yaml)

## Setup

Folder structure:

- [`./`](./) contains Markdown course material
- [`questions/`](questions/) has question as `YAML` converted toe `JSON` for upload
- [`html/`](html/) has generated HTML to paste into the course pages
- [`src/`](src/) has the source code to generate the above

To generate content, install [Node.js](https://nodejs.org/en) and run:

```shell
npm install
npm run build
```

Pushing to this repo publishes <https://tools-in-data-science.pages.dev/> via CloudFlare account <root.node@gmail.com>.

Links:

- [Backend page](https://backend.seek.onlinedegree.iitm.ac.in/24t2_se2002/) -- to edit course content.
- [Development link](https://open-nptel-nk7eaoz6ha-el.a.run.app/24t2_se2002/dashboard) -- in case the above fails.
- [Question tester](https://claude.site/artifacts/13323d32-bebe-4bd3-972e-c82b641a42ea?fullscreen=true) -- tests JSON
