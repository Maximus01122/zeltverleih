// File: StepServiceSelection.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatSetupServiceName } from "@/model/helperFunctions";
import { SetupServiceName, setupValues } from "@/model/AllTypes";

interface StepServiceSelectionProps {
    selectedServices: SetupServiceName[];
    setSelectedServices: React.Dispatch<React.SetStateAction<SetupServiceName[]>>;
    onPrev: () => void;
    onNext: () => void;
}

const StepServiceSelection: React.FC<StepServiceSelectionProps> = ({
                                                                       selectedServices,
                                                                       setSelectedServices,
                                                                       onPrev,
                                                                       onNext,
                                                                   }) => {
    const handleCheckboxChange = (service: SetupServiceName, checked: boolean) => {
        setSelectedServices(prev =>
            checked ? [...prev, service] : prev.filter(s => s !== service)
        );
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-4 py-2">
                {setupValues.map((service) => (
                    <div
                        key={service}
                        className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                        <Checkbox
                            id={service}
                            checked={selectedServices.includes(service)}
                            onCheckedChange={(checked) =>
                                handleCheckboxChange(service, Boolean(checked))
                            }
                        />
                        <label
                            htmlFor={service}
                            className="text-sm font-medium leading-none cursor-pointer flex-1"
                        >
                            {formatSetupServiceName(service)}
                        </label>
                    </div>
                ))}
            </div>

            <div className="flex justify-between border-t pt-6">
                <Button onClick={onPrev} variant="outline">
                    Zurück
                </Button>
                <Button onClick={onNext}>
                    Weiter
                </Button>
            </div>
        </div>
    );
};

export default StepServiceSelection;