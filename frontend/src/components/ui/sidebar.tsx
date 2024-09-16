import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {Link, useNavigate} from "react-router-dom";
import {CalendarIcon} from "@radix-ui/react-icons";
import { IoMailOutline } from "react-icons/io5";
import { FaTents } from "react-icons/fa6";
import { PiPackage } from "react-icons/pi";
import logo from "@/tabs/navigation/logo.png";
import * as React from "react";

export function Sidebar(className:any) {
    const navigate = useNavigate();

    return (
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Menü
                    </h2>
                    <div className="space-y-1">
                        <Button variant="secondary" className="w-full justify-start"
                                onClick={() => window.open('https://www.zeltverleiherfurt.de', '_blank')}>
                            <img src={logo}  className={"mr-2 h-4 w-4"}/>
                            Internetseite
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/")}>
                                <CalendarIcon className={"mr-2 h-4 w-4"}/>
                                Buchungsübersicht
                        </Button>

                        <Button variant="secondary" className="w-full justify-start" onClick={() => navigate("/newbooking")}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-2 h-4 w-4"
                            >
                                <path d="M16 21v-2a4 4 0 0 0-4-4  H6 a4 4 0 0 0-4 4v2"/>
                                <line x1="18" y1="12" x2="24" y2="12" />
                                <line x1="21" y1="9" x2="21" y2="15" />
                                <circle cx="9" cy="7" r="4"/>
                            </svg>
                            neue Bestellung
                        </Button>

                        <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/dashboard")}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="mr-2 h-4 w-4"
                                >
                                    <line x1="1" y1="20" x2="8" y2="20" />
                                    <line x1="1" y1="24" x2="1" y2="20" />
                                    <line x1="8" y1="24" x2="8" y2="15" />
                                    <line x1="8" y1="15" x2="16" y2="15"/>
                                    <line x1="16" y1="24" x2="16" y2="8"/>
                                    <line x1="16" y1="8" x2="24" y2="8"/>
                                    <line x1="23" y1="24" x2="23" y2="8"/>
                                </svg>
                            Statistiken
                        </Button>
                        <Button variant="secondary" className="w-full justify-start" onClick={() => navigate("/warehouse")}>
                            <PiPackage className={"mr-2 h-4 w-4"}/>
                            Lager
                        </Button>

                        <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/materialien")}>
                            <FaTents className={"mr-2 h-4 w-4"}/>
                            Equipment
                        </Button>

                        <Button variant="secondary" className="w-full justify-start" onClick={() => navigate("/materialien")}>
                            <IoMailOutline className={"mr-2 h-4 w-4"}/>
                            Email
                        </Button>
                    </div>
                </div>
            </div>
    )
}
