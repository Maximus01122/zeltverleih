import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import * as React from "react";
import {ReactNode} from "react";
import {Booking} from "@/model/AllTypes";
import {Toaster} from "@/components/ui/sonner";

type DialogProps = {
    buttonName:string,
    dialogTitle: string,
    dialogContent: ReactNode
    handleClickBack: () => void
    handleClickContinue: () => void
}

export default function AlertDialogFilled(
    {buttonName, dialogTitle, dialogContent, handleClickBack, handleClickContinue}:DialogProps) {
    return(
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <p>{buttonName}</p>
            </AlertDialogTrigger>
            <AlertDialogContent className={"items-center justify-center"}>
                <AlertDialogHeader>
                    <AlertDialogTitle> {dialogTitle} </AlertDialogTitle>
                </AlertDialogHeader>
                {dialogContent}
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleClickBack}>Zurück</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClickContinue}>Weiter</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>)
}
/*
<AlertDialog>
                        <AlertDialogTrigger asChild>
                        </AlertDialogTrigger>
                        <AlertDialogContent className={"items-center justify-center"}>
                            <AlertDialogHeader>
                                <AlertDialogTitle> Angebot für {buchung.client.name} </AlertDialogTitle>
                            </AlertDialogHeader>
                            <div className="grid items-center justify-center gap-3">
                                <Input type={"number"} placeholder={"Anzahl Tagesmieten"}
                                       onChange={e => setTagesmiete(Number(e.target.value))}/>
                                <Input type={"number"} placeholder={"Anzahl Wochenendmieten"}
                                       onChange={e => setWochenendmiete(Number(e.target.value))}/>
                                <Input type={"number"} placeholder={"Lieferpauschale"}
                                       onChange={e => setLieferung(Number(e.target.value))}/>
                                <Input type={"number"} placeholder={"loadingFee"}
                                       onChange={e => setLadepauschale(Number(e.target.value))}/>
                                <Calendar
                                    mode="single"
                                    selected={gueltigBis}
                                    onSelect={setGueltigBis}
                                    className="rounded-md border shadow w-[400px}"
                                />
                            </div>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={handleClick}>Zurück</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => handleClickAngebot(buchung)}> Weiter</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
 */


