import * as fs from "fs";
import * as path from "path";
import type { ChildProcess } from "child_process";
import { spawn } from "child_process";
import type { EngineVersionFormat } from "@/model/formats";
import { StartScriptConverter } from "@/utils/start-script-converter";
import type { StartScriptTypes } from "@/model/start-script";
import type { BattleTypes } from "@/model/battle";

export class GameAPI {
    public gameProcess?: ChildProcess;

    protected scriptConverter = new StartScriptConverter();

    constructor(protected userDataDir: string, protected dataDir: string) {
    }

    public async launch(engineTag: EngineVersionFormat, battle: BattleTypes.Battle) {
        const enginePath = path.join(this.dataDir, "engine", engineTag).replaceAll("\\", "/");
        const scriptPath = path.join(this.dataDir, "barlobby_script.txt");

        const scriptStr = this.scriptConverter.generateScriptStr(battle);

        await fs.promises.writeFile(scriptPath, scriptStr);

        const args = [
            "--write-dir", this.dataDir,
            "--isolation",
            scriptPath
        ];

        this.gameProcess = spawn("spring.exe", args, {
            cwd: enginePath,
            stdio: "ignore",
            detached: true
        });
    }

    protected isBattleType(obj: StartScriptTypes.Game | BattleTypes.Battle): obj is BattleTypes.Battle {
        return obj.hostOptions !== undefined;
    }
}