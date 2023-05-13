// Loading the dependencies. We don't need pretty
// because we shall not log html to the terminal
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

mods = ["820260968", "719416488", "1521695605", "699709023", "846066944", "2777392649", "698748356", "699235856", "1303741106", "1458561226", "2438003901", "2265420196", "1946557392", "809903394", "1360299796", "1532883122", "2076426030", "1303360855", "2404689961", "699735138", "1367081844", "1324280145", "1137372539", "1241177173", "741805475", "2051348857", "842834893", "2114093692", "2204739234", "1721597650", "1364520259", "1721585687", "748970320", "1085252317", "1826643372", "850366219", "1827273767", "1399124193", "1176852112", "704963980", "774677354", "739173012", "1292092419", "1355856476", "1850690189", "2412445347", "1445449208", "2026448968", "853667255", "1875414471", "2197593000", "806209426", "1417069016", "2364431052", "725231715", "1314446921", "1368243403", "946684259", "2384910049", "1368778634", "1229084232", "1847611462", "699587979", "2364381608", "2364382919", "2364381226", "2364382730", "2364382040", "2364383431", "2243912940", "786868637", "1131061750", "2364383134", "2364428411", "726036596", "707136443", "2477222513", "699302152", "2792132018", "702800402", "1886171068", "2090437668", "1348125496", "1913968458", "2129897125", "962742350", "2142407679", "1862018480", "1950502043", "1380558447"];
mdata = {};
// URL of the page we want to scrape
const url = "https://steamcommunity.com/sharedfiles/filedetails/?id=719416488";

// Async function which scrapes the data
for (md of mods) {
    async function scrapeData(mod) {
        try {
            // Fetch HTML of the page we want to scrape
            const { data } = await axios.get(`https://steamcommunity.com/sharedfiles/filedetails/?id=${mod}`);
            // Load HTML we fetched in the previous line
            const $ = cheerio.load(data);
            console.log(mod);

            mdata[mod] = {};
            mdata[mod].name = ($(".workshopItemTitle")[0].children[0].data);
            mdata[mod].subs = (parseInt($(".stats_table > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1)")[0].children[0].data.split(",").join("")));

            console.log("\n\n\n\n\n\n\ndata:")
            console.log(mdata)

        } catch (err) {
            console.error(err);
        }
    }
    // Invoke the above function
    scrapeData(md);
}