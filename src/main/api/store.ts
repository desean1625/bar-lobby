import { Static, TSchema } from "@sinclair/typebox";
import { ipcMain } from "electron";
import { assign } from "jaz-ts-utils";
import path from "path";

import { AsbtractStoreAPI } from "$/api/abstract-store";

export class StoreAPI<T extends TSchema> extends AsbtractStoreAPI<T> {
    public async init() {
        await super.init();

        const name = path.parse(this.filePath).name;

        ipcMain.handle(`store-update:${name}`, async (event, model: Static<T>) => {
            assign(this.model, model);
        });

        return this;
    }
}
