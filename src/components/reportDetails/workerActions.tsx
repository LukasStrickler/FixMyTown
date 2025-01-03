"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Dictionary } from "@/dictionaries/dictionary";
import { api } from "@/trpc/react";

interface WorkerActionsProps {
  reportId: number;
  dictionary: Dictionary;
  currentStatus: number;
  currentPriority: number;
  onActionComplete?: () => void;
}

export function WorkerActions({
  reportId,
  dictionary,
  currentStatus,
  currentPriority,
  onActionComplete 
}: WorkerActionsProps) {
  const [comment, setComment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>(currentStatus.toString());
  const [selectedPriority, setSelectedPriority] = useState<number | undefined>(currentPriority);

  const addProtocoll = api.reportDetails.addProtocoll.useMutation({
    onSuccess: () => {
      window.location.reload();
      setComment("");
      if (onActionComplete) {
        onActionComplete();
      }
    },
  });

  const updatePriority = api.reportDetails.updatePriority.useMutation({
    onSuccess: () => {
      window.location.reload();
    },
  });

  // DICTIONARY-UPDATE: be sure to adjust the update Ranking here
  const isValidTransition = (currentStatus: number, newStatus: number): boolean => {
    const validTransitions: Record<number, number[]> = {
      1: [1, 2, 4], // new → new / in progress / declined
      2: [2, 3, 4], // in progress → completed / in progress / declined
      3: [2, 3], // completed → in progress / completed
      4: [1, 4], // declined → new / declined
    };

    return validTransitions[currentStatus]?.includes(newStatus) ?? false;
  };

  const handleStatusAndCommentSubmit = () => {
    const newStatusId = parseInt(selectedStatus);

    if (!isValidTransition(currentStatus, newStatusId)) {
      console.error("Invalid status transition.");
      return;
    }

    addProtocoll.mutate({
      reportId: reportId.toString(),
      statusId: newStatusId,
      comment: comment,
      prio: selectedPriority,
    });
  };

  const handlePriorityChange = () => {
    if (selectedPriority !== undefined) {
      updatePriority.mutate({
        reportId: reportId.toString(),
        prio: selectedPriority,
      });
    } else {
      console.error("Priority must be selected before updating.");
    }
  };

  // DICTIONARY-UPDATE: be sure to adjust the update Ranking here
  const validStatusOptions = (currentStatus: number) => {
    const options: Record<number, number[]> = {
      1: [1, 2, 4], // new → new / in progress / declined
      2: [2, 3, 4], // in progress → completed / in progress / declined
      3: [2, 3], // completed → in progress / completed
      4: [1, 4], // declined → new / declined
    };
    return options[currentStatus] ?? [];
  };

  return (
    <div className="space-y-4 border p-4 rounded-lg">
      <div className="border p-4 rounded-lg">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{dictionary.components.reportDetails.statuses.title}</label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder={dictionary.components.reportDetails.statuses.placeholderText}>
                  {dictionary.metadata.statuses[parseInt(selectedStatus).toString() as keyof typeof dictionary.metadata.statuses].name}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {validStatusOptions(currentStatus).map((statusId) => (
                  <SelectItem key={statusId} value={statusId.toString()}>
                    {dictionary.metadata.statuses[statusId.toString() as keyof typeof dictionary.metadata.statuses].name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{dictionary.components.reportDetails.comment}</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={dictionary.components.reportDetails.comment + " ..."}
            />
          </div>
          <div className="space-y-2">
            <Button
              onClick={handleStatusAndCommentSubmit}
              disabled={addProtocoll.isPending}
            >
              {addProtocoll.isPending ? "Submitting..." : dictionary.components.reportDetails.statuses.updateButtonText}
            </Button>
          </div>
        </div>
      </div>

      <div className="border p-4 rounded-lg">
        <div className="space-y-2">
          <label className="text-sm font-medium">{dictionary.components.reportDetails.prios.title}</label>
          <Select value={selectedPriority?.toString()} onValueChange={(value) => setSelectedPriority(parseInt(value))}>
            <SelectTrigger>
              <SelectValue placeholder={dictionary.components.reportDetails.prios.placeholderText} />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(dictionary.metadata.prios).map((prioId) => (
                <SelectItem key={prioId} value={prioId}>
                  {dictionary.metadata.prios[prioId as keyof typeof dictionary.metadata.prios].name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="space-y-2">
            <Button
              onClick={handlePriorityChange}
              disabled={addProtocoll.isPending}
            >
              {dictionary.components.reportDetails.prios.updateButtonText}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
} 