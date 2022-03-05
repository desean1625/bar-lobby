import type { SessionType} from "@/model/session";
import { sessionSchema } from "@/model/session";
import Ajv from "ajv";
import { reactive } from "vue";

export class SessionAPI {
    public model: SessionType;

    constructor() {
        const ajv = new Ajv({ coerceTypes: true, useDefaults: true });
        const sessionValidator = ajv.compile(sessionSchema);
        const model = reactive({}) as SessionType;
        sessionValidator(model);

        this.model = reactive(model);
    }
}