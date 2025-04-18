import { reactive, watch } from "vue";
import { EngineVersion } from "@main/content/engine/engine-version";

export const enginesStore = reactive<{
    isInitialized: boolean;
    availableEngineVersions: EngineVersion[];
    selectedEngineVersion?: EngineVersion;
}>({
    isInitialized: false,
    availableEngineVersions: [],
    selectedEngineVersion: undefined,
});

async function refreshStore() {
    enginesStore.availableEngineVersions = await window.engine.listAvailableVersions();
}

watch(
    () => enginesStore.selectedEngineVersion,
    async (engineVersion) => {
        if (!engineVersion) throw new Error("failed to retrieve engine version");

        if (!engineVersion.installed) {
            await window.engine.downloadEngine(engineVersion.id);
        }
    }
);

export async function initEnginesStore() {
    window.downloads.onDownloadEngineComplete(async (downloadInfo) => {
        console.debug("Received engine download completed event", downloadInfo);
        await refreshStore();
        enginesStore.selectedEngineVersion = enginesStore.availableEngineVersions.find((e) => e.id === downloadInfo.name);
    });
    await refreshStore();
    enginesStore.isInitialized = true;
}
