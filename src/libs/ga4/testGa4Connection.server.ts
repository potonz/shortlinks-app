interface ITestGa4ConnectionInput {
    measurementId: string;
    apiSecret: string;
}

interface ITestGa4ConnectionResult {
    success: boolean;
    error?: string;
}

export async function testGa4Connection(
    input: ITestGa4ConnectionInput,
): Promise<ITestGa4ConnectionResult> {
    const { measurementId, apiSecret } = input;

    if (!measurementId || !apiSecret) {
        return { success: false, error: "Missing Measurement ID or API Secret" };
    }

    if (!/^G-[A-Z0-9]{8,10}$/i.test(measurementId)) {
        return { success: false, error: "Invalid Measurement ID format" };
    }

    try {
        const testUrl = new URL("https://www.google-analytics.com/mp/collect");
        testUrl.searchParams.set("measurement_id", measurementId);
        testUrl.searchParams.set("api_secret", apiSecret);

        const payload = {
            client_id: "test_client_id",
            events: [
                {
                    name: "test_connection",
                    params: {
                        test: true,
                    },
                },
            ],
        };

        const response = await fetch(testUrl.toString(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            return { success: true };
        }

        const errorText = await response.text();
        console.error("GA4 test connection error:", errorText);

        return { success: false, error: `GA4 validation failed: ${response.status}` };
    }
    catch (error) {
        console.error("Error testing GA4 connection:", error);
        return { success: false, error: "Failed to connect to GA4" };
    }
}
