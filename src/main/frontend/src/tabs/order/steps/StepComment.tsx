// File: StepComment.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface StepCommentProps {
    comment: string;
    setComment: React.Dispatch<React.SetStateAction<string>>;
    onPrev: () => void;
    onNext: () => void;
}

const StepComment: React.FC<StepCommentProps> = ({
                                                     comment,
                                                     setComment,
                                                     onPrev,
                                                     onNext,
                                                 }) => {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label htmlFor="comment" className="text-sm font-medium leading-none">
                    Zusätzliche Bemerkungen (Optional)
                </label>
                <Textarea
                    id="comment"
                    placeholder="Besonderheiten zur Lieferung, Aufbauort, etc..."
                    className="min-h-[150px] resize-none"
                    value={comment} // Fix: Sorgt dafür, dass der Text beim Zurückgehen erhalten bleibt
                    onChange={(e) => setComment(e.target.value)}
                />
            </div>

            <div className="flex justify-between pt-4">
                <Button onClick={onPrev} variant="outline">
                    Zurück
                </Button>
                <Button onClick={onNext}>
                    Zusammenfassung erstellen
                </Button>
            </div>
        </div>
    );
};

export default StepComment;