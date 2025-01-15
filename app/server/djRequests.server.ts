import { LoaderFunction, json, redirect } from "@remix-run/node";
import { getSessionData } from "~/server/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
    const { token } = await getSessionData(request);

    if (!token) {
        return redirect("/login");
    }

    try {
        // Fetch user data from the `whoami` endpoint
        const whoamiResponse = await fetch("http://localhost/api/whoami", {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!whoamiResponse.ok) {
            return redirect("/login");
        }

        const whoamiData = await whoamiResponse.json();

        // Ensure the user is a DJ
        if (!whoamiData.success || whoamiData.user.role !== "dj") {
            return redirect("/login");
        }

        // Fetch requests for the DJ
        const requestsResponse = await fetch("http://localhost/api/dj/requests", {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!requestsResponse.ok) {
            throw new Error("Error obtenint les sol·licituds.");
        }

        const requestsData = await requestsResponse.json();
        return json({ user: whoamiData.user, token, requests: requestsData });
    } catch (error) {
        console.error("Error carregant les sol·licituds:", error);
        return redirect("/login");
    }
};
