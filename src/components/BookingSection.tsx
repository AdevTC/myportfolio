"use client";

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";

export default function BookingSection() {
    useEffect(() => {
        (async function () {
            const cal = await getCalApi({});
            cal("ui", {
                styles: { branding: { brandColor: "#8b5cf6" } },
                hideEventTypeDetails: false,
                layout: "month_view"
            });
        })();
    }, []);

    return (
        <div className="h-full">
            <div className="glass rounded-3xl overflow-hidden border border-white/10 shadow-2xl h-[800px] flex flex-col">
                <div className="bg-white/5 p-6 border-b border-white/10 text-center">
                    <h2 className="text-2xl font-bold">
                        Agenda una <span className="text-primary">Reunión</span>
                    </h2>
                    <p className="text-sm text-muted-foreground mt-2">
                        Busca un hueco en mi calendario
                    </p>
                </div>
                <div className="flex-1">
                    <Cal
                        calLink="adrian-tomas-cerda-3nxv6f"
                        style={{ width: "100%", height: "100%", overflow: "scroll" }}
                        config={{ layout: 'month_view' }}
                    />
                </div>
            </div>
        </div>
    );
}
