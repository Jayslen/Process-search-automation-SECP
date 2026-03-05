import { chromium } from "playwright";
import path from "path";

type RowData = {
  institution: string;
  code: string;
  title: string;
  pubDate: string | undefined;
  dueDate: string | undefined;
  url: string;
  imagePath: string;
  timestamp?: Date;
};

const [dataPath, username, password] = Bun.argv.slice(2);

if (!dataPath || !username || !password) {
  console.error("Complete todos los campos.");
  process.exit(1);
}

const dirPath = path.join(dataPath);
const credentialsPath = path.join(dataPath, "credentials.json");
const credentialsFile = (await Bun.file(credentialsPath).exists())
  ? Bun.file(credentialsPath).json()
  : [];

const proccessURL =
  "https://portal.comprasdominicana.gob.do/DO1BusinessLine/Tendering/ContractNoticeManagement/Index";
const browser = await chromium.launch({
  headless: true,
  args: [
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--no-sandbox",
    "--disable-setuid-sandbox",
  ],
});
const context = await browser.newContext({
  storageState: await credentialsFile,
  viewport: { width: 1920, height: 1080 },
});

const page = await context.newPage();
await page.goto(proccessURL);

if (page.url().includes("logoff")) {
  await page.getByText("Inicio").click();
}

// authentication
if (page.url().includes("Login")) {
  await page.getByPlaceholder("Username").fill(username as string);
  await page.getByPlaceholder("Password").fill(password as string);
  await page.locator("id=ctl00_content__login_LoginButton").click();

  const locator = page.locator(".error-text");

  if ((await locator.count()) > 0) {
    console.error(
      "Las credenciales son incorrectas. Por favor, verifica tu usuario y contraseña.",
    );
    await browser.close();
    process.exit(1);
  }

  // await page.waitForSelector(".error-text").then(() => {
  //   console.error(
  //     "Las credenciales son incorrectas. Por favor, verifica tu usuario y contraseña.",
  //   );
  //   browser.close();
  //   process.exit(1);
  // });

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

const processSuccessPath = path.join(dirPath, "process_results.json");
const processFileExist = await Bun.file(processSuccessPath).exists();
const timestamp = new Date();

const existingData: RowData[] = processFileExist
  ? await Bun.file(processSuccessPath).json()
  : [];
const parsedRows = [];
try {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row) continue;
    if (!row.url) continue;
    if (existingData.some((item) => item.code === row.code)) continue;

    await page.goto(row.url);
    const imagePath = path.join(dirPath, "images", `${row.code}.png`);
    await page
      .locator("id=tblSummaryTable_trRow_tdCell")
      .screenshot({ path: imagePath });
    row.imagePath = imagePath;
    parsedRows.push(row);

    row.pubDate = parseDate(row.pubDate);
    row.dueDate = parseDate(row.dueDate);
    row.timestamp = timestamp;
  }
  await Bun.write(
    processSuccessPath,
    JSON.stringify([parsedRows, ...existingData].flat(), null, 2),
  );
  console.log(JSON.stringify(parsedRows, null, 2));
} catch (error) {
  console.error("Error al procesar datos");
}

await browser.close();

function parseDate(dateStr: string | undefined): string | undefined {
  if (!dateStr) return undefined;

  const [date, time] = dateStr.split(" ");

  const [day, month, year] = (date as string).split("/");

  const [hours, minutes] = (time as string).split(":");

  return new Date(
    Number(year),
    Number(month) - 1, // 👈 los meses empiezan en 0
    Number(day),
    Number(hours),
    Number(minutes),
  ).toString();
}
