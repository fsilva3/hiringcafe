# HiringCafe Challenge

This repository has intention to scrape as many websites hosted in Avature, retreiving clean-data to many job descriptions as possible

## Discovery

I've noticed most of the Avature hosted URLs has some patterns `/carrers`, `/jobs`,

- https://{companyName}.avature.net/careers
- e.g.:
- https://ally.avature.net/careers
- https://nva.avature.net/jobs
- https://mantech.avature.net/careers
- https://manpowergroupco.avature.net/careers2
- https://manpowergroupco.avature.net/careers
- https://clinicianjobs.advocatehealth.org/careers/SearchJobs

1. Instead we visit page by page we can try to archieve the most updated carreers, discover the links; once we've the links, we can store into some place, and use some pub/sub trying to extract as much as job description possible (some websites might not load for the very first time);

2. In terms of scalability, I needed to do some research to be honest, as I was digging into some of the hosted avature websites listed here; which brings helpful insights to day to day work; There are some approaches that could be useful for scraping from now on, like extracting the html, convert it to vector using some embedding model, store in the db, and make search based on what is required from the html extracted. As it isn't allowed to use some AI in the code as a requirement, I'll try to follow some standards as grabing data by <script[type="application/ld+json"]>, and as a fallback we can try to use some html selectors approaches;

## Concerns

1. BotDetection, as we go thru each page, I know some of them will have some bot detection which will be hard to skip that part, some third libraries can help us on that, but I know we can't use in this challenge
2. IP Restriction, some of these links are regional restricited, which will be difficult to me to test, even using my internal VPN
3. Also, I noticed some links requires authentication, we will be skipping these ones, as it isn't the main focus;
4. Scraping technique usually requires a HTML management, as some websites provides .json data thru XHR data requests, but avature hosted websites seems hard to find; I'll try to apply some generic data

## Final Considerations

The challenge was really good, I could do some researches which will be useful for myself; As it has some tricks, the way how we handle different elements no matter the website; Maybe different ATS will handle it different, that why I thought using factory would be great for this challenge.

## Getting Started

1. You must have Node v22+ and pnpm v10+
2. To install the dependencies, please run `pnpm i`
3. After the installation, run the script with `pnpm start`
4. It should generate a ./dist/output.json containing all the jobs parsed;

## Reference

I've uploaded a few videos where I'm coding, it might be helpful to understand how my mind was working while coding the challenge;
[googledrive](https://drive.google.com/drive/folders/1v96ZkMa6hvZ4Ny9pM2-KQb9eUmC7Uila?usp=sharing)
