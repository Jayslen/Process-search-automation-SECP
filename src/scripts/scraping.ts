import { chromium } from "playwright";
import { mkdir } from "fs/promises";
import path from "path";
import { parseDate } from "./utils/formatDate";

type RowData = {
  institution: string;
  code: string;
  title: string;
  pubDate: string | undefined;
  dueDate: string | undefined;
  url: string;
  imagePath: string;
};

const [dataPath, username, password] = Bun.argv.slice(2);

if (!dataPath || !username || !password) {
  console.error("Some fields are missing");
  process.exit(1);
}

const dirPath = path.join(dataPath);
const credentialsPath = path.join(dataPath, "credentials.json");
const credentialsFiles = Bun.file(credentialsPath);

const proccessURL =
  "https://portal.comprasdominicana.gob.do/DO1BusinessLine/Tendering/ContractNoticeManagement/Index";
const browser = await chromium.launch({ headless: false });
const context = await browser.newContext({
  storageState: await credentialsFiles.json(),
  viewport: { width: 1920, height: 1080 },
});

const page = await context.newPage();
await page.goto(proccessURL);

// await page.waitForTimeout(10000);

if (page.url().includes("logoff")) {
  await page.getByText("Inicio").click();
}

// authentication
if (page.url().includes("Login")) {
  await page.getByPlaceholder("Username").fill(username as string);
  await page.getByPlaceholder("Password").fill(password as string);
  await page.locator("id=ctl00_content__login_LoginButton").click();
  await page.context().storageState({ path: credentialsPath });
  await page.goto(proccessURL);
}

const rows: RowData[] = await page.$$eval(
  "[id=tblMainTable_trRowMiddle_tdCell1_tblForm_trGridRow_tdCell1_grdResultList_tbl] > tbody  > tr",
  (rows) =>
    rows.reduce<RowData[]>((acc, row, i, arr) => {
      if (i === 0 || i === arr.length - 1) return acc;
      if (!(row instanceof HTMLTableRowElement)) return acc;

      const text = row.innerText;
      if (text.includes("tiempo transcurrido")) return acc;

      const data = text
        .replaceAll("\t", "")
        .split("\n")
        .filter((item) => item !== "");

      const anchor = row.querySelector("a")?.href;

      acc.push({
        institution: data[1] || "",
        code: data[2]?.trim() || "",
        title: data[3] || "",
        pubDate: data[5]?.split("(")[0],
        dueDate: data[6]?.split("(")[1],
        url: anchor || "",
        imagePath: "",
      });

      return acc;
    }, []),
);

await mkdir(dirPath, { recursive: true });
const processSuccessPath = path.join(dirPath, "process_results.json");

const parsedRows = [];
try {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row) continue;
    if (!row.url) continue;

    await page.goto(row.url);
    const imagePath = path.join(dirPath, "images", `${row.code}.png`);
    await page
      .locator("id=tblSummaryTable_trRow_tdCell")
      .screenshot({ path: imagePath });
    row.imagePath = imagePath;
    parsedRows.push(row);

    row.pubDate = parseDate(row.pubDate);
    row.dueDate = parseDate(row.dueDate);
  }
  await Bun.write(processSuccessPath, JSON.stringify(parsedRows));
  console.log(`Process saved at: ${dirPath}`);
} catch (error) {
  console.error("Error processing rows:", error);
}

await browser.close();
