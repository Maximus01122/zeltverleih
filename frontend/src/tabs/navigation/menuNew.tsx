import {
    Sheet,
    SheetContent,
    SheetTrigger
} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import * as React from "react";
import {Sidebar} from "@/components/ui/sidebar";

export default function Menu() {
    return <Sheet>
        <SheetTrigger asChild>

            <Button
                key={`menu23`}
                variant="ghost"
                className="font-normal"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-8 w-8"
                >
                    <path d="M30 6H3" />
                    <path d="M30 12H3" />
                    <path d="M30 18H3" />
                </svg>
                Menü
            </Button>
        </SheetTrigger>
        <SheetContent>
            <Sidebar/>
        </SheetContent>
    </Sheet>
}
