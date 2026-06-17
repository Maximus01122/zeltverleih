import {
    DialogAction,
    Dialog,
    DialogContent, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger, DialogClose
} from "@/components/ui/alert-dialog";
import * as React from "react";
import {ReactNode} from "react";

type DialogProps = {
    buttonName:string,
    dialogTitle: string,
    dialogContent: ReactNode
    handleClickBack: () => void
    handleClickContinue: (a:any) => void
}

function AlertDialogFilled(
    {buttonName, dialogTitle, dialogContent, handleClickBack, handleClickContinue}:DialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <p>{buttonName}</p>
            </DialogTrigger>
            <DialogContent className={"max-w-2xl flex flex-col items-center justify-center"}>
                <DialogHeader>
                    <DialogTitle> {dialogTitle} </DialogTitle>
                </DialogHeader>
                {dialogContent}
                <DialogFooter>
                    <DialogClose onClick={handleClickBack}>Zurück</DialogClose>
                    <DialogAction onClick={handleClickContinue}>Weiter</DialogAction>
                </DialogFooter>
            </DialogContent>
        </Dialog>);
}


export {AlertDialogFilled}

