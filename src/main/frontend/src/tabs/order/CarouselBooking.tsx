// File: CarouselBooking.tsx
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useLocation, useNavigate } from "react-router-dom";

import StepClientForm from "./steps/StepClientForm";
import StepMaterialSelection from "./steps/StepMaterialSelection";
import StepServiceSelection from "./steps/StepServiceSelection";
import StepComment from "./steps/StepComment";
import useBookingWizard from "./hooks/useBookingWizard";
import {BookingSingleView} from "@/tabs/dashboard/singleview";

const CarouselBooking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id: bookingProps } = location.state || {};

    const {
        step,
        stepTitle,
        client,
        booking,
        handlePrev,
        handleClose,
        handleDone,
        dateRange,
        setDateRange,
        bookedMaterials,
        setBookedMaterials,
        availableMaterials,
        selectedServices,
        setSelectedServices,
        comment,
        setComment,
        createSummarization,
        handleOrderSubmit,
        handleServiceSubmit,
        handleNextClient
    } = useBookingWizard(bookingProps, navigate);

    return (
        <Card>
            <Toaster position="top-right" richColors closeButton />
            <CardHeader>
                <div className="flex justify-between items-center w-full">
                    <CardTitle>{stepTitle}</CardTitle>
                    <Button variant="ghost" className="h-8 w-8 p-0" onClick={handleClose}>
                        <Cross2Icon className="h-4 w-4" />
                    </Button>
                </div>
                <Progress value={(step - 1) * (100 / 4)} />
            </CardHeader>

            <CardContent>
                {step === 1 && <StepClientForm client={client} onNext={handleNextClient} />}
                {step === 2 && (
                    <StepMaterialSelection
                        availableMaterials={availableMaterials}
                        bookedMaterials={bookedMaterials}
                        setBookedMaterials={setBookedMaterials}
                        dateRange={dateRange}
                        setDateRange={setDateRange}
                        onNext={handleOrderSubmit}
                        onPrev={handlePrev}
                    />
                )}
                {step === 3 && (
                    <StepServiceSelection
                        selectedServices={selectedServices}
                        setSelectedServices={setSelectedServices}
                        onNext={handleServiceSubmit}
                        onPrev={handlePrev}
                    />
                )}
                {step === 4 && (
                    <StepComment
                        comment={comment}
                        setComment={setComment}
                        onNext={createSummarization}
                        onPrev={handlePrev}
                    />
                )}
                {step === 5 && <BookingSingleView bookingPreview={booking} handleDone={handleDone}/>}
            </CardContent>
        </Card>
    );
};

export default CarouselBooking;
