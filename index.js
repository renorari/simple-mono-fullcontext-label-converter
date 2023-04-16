const {readFileSync,writeFileSync,readdirSync,existsSync, mkdirSync} = require("node:fs");
const {join} = require("node:path");

console.info("Generating fullcontext labels...");
readdirSync(join(__dirname,"./mono")).forEach((file, fileIndex, fileArray) => {
    console.info(`Generating fullcontext labels for ${file}... (${Math.round((fileIndex + 1) / fileArray.length * 100)}%))`);
    const startTime = [];
    const endTime = [];
    const phonemes = ["xx", "xx"];
    readFileSync(join(__dirname, "./mono", file), "utf-8").split("\n").forEach((_line) => {
        const line = _line.trim();
        if (line == "") return;
        phonemes.push(line.split(" ")[2]);
        startTime.push(line.split(" ")[0]);
        endTime.push(line.split(" ")[1]);
    });
    const fullcontextLabelLines = [];
    phonemes.forEach((phoneme, index) => {
        const context = phonemes.slice(index, index + 5);
        if (context.length < 5) {
            context.push(...Array(5 - context.length).fill("xx"));
        }
        if (context[2] == "xx") return;
        fullcontextLabelLines.push(`${startTime[index]} ${endTime[index]} ${context[0]}^${context[1]}-${context[2]}+${context[3]}=${context[4]}/A:xx+xx+xx/B:xx-xx_xx/C:xx_xx+xx/D:xx+xx_xx/E:xx_xx!xx_xx-xx/F:xx_xx#xx_xx@xx_xx|xx_xx/G:xx_xx%xx_xx_xx/H:xx_xx/I:xx-xx@xx+xx&xx-xx|xx+xx/J:xx_xx/K:xx+xx-xx`);
    });
    if (!existsSync(join(__dirname, "./full"))) mkdirSync(join(__dirname, "./full"));
    writeFileSync(join(__dirname, "./full", file), fullcontextLabelLines.join("\n"));
});