import { env } from "cloudflare:workers";

interface IDeleteGa4ConfigInput {
    configId: number;
}

interface IDeleteGa4ConfigResult {
    success: boolean;
    error?: string;
}

const STMT_DELETE = env.DB.prepare(`
    DELETE FROM sl_user_ga4_config
    WHERE id = ? AND user_id = ?
`);

export async function deleteGa4Config(
    input: IDeleteGa4ConfigInput,
    userId: string,
): Promise<IDeleteGa4ConfigResult> {
    const { configId } = input;

    try {
        const result = await STMT_DELETE.bind(configId, userId).run();

        if (result.meta.changes === 0) {
            return { success: false, error: "Config not found" };
        }

        return { success: true };
    }
    catch (error) {
        console.error("Error deleting GA4 config:", error);
        return { success: false, error: "Failed to delete GA4 config" };
    }
}
