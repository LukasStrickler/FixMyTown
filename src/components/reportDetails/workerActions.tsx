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
  onActionComplete?: () => void;
}

export function WorkerActions({ 
  reportId, 
  dictionary, 
  currentStatus,
  onActionComplete 
}: WorkerActionsProps) {
  const [comment, setComment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>(currentStatus.toString());
  const [selectedPriority, setSelectedPriority] = useState<number | undefined>(undefined);

  const statusMap = {
    1: dictionary.metadata.statuses[1],
    2: dictionary.metadata.statuses[2],
    3: dictionary.metadata.statuses[3],
    4: dictionary.metadata.statuses[4]
  };

  const prioMap = {
    0: dictionary.metadata.prios[0],
    1: dictionary.metadata.prios[1],
    2: dictionary.metadata.prios[2],
    3: dictionary.metadata.prios[3]
  };

  const addProtocoll = api.reportDetails.addProtocoll.useMutation({
    onSuccess: () => {
      setComment("");
      if (onActionComplete) {
        onActionComplete();
      }
    },
  });

  const updatePriority = api.reportDetails.updatePriority.useMutation();

  const isValidTransition = (currentStatus: number, newStatus: number): boolean => {
    const validTransitions: { [key: number]: number[] } = {
      1: [2], // new → in progress
      2: [3], // in progress → completed
      3: [2], // completed → in progress (for rework)
      4: [1], // declined → new (to reset after reconsideration)
    };

    return validTransitions[currentStatus]?.includes(newStatus) || false;
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

  const validStatusOptions = (currentStatus: number) => {
    const options: { [key: number]: number[] } = {
      1: [2], // new → in progress
      2: [3], // in progress → completed
      3: [2], // completed → in progress (for rework)
      4: [1], // declined → new (to reset after reconsideration)
    };
    return options[currentStatus] || [];
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
                  {statusMap[parseInt(selectedStatus) as keyof typeof statusMap].name}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {validStatusOptions(currentStatus).map((statusId) => (
                  <SelectItem key={statusId} value={statusId.toString()}>
                    {statusMap[statusId as keyof typeof statusMap].name}
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
              {Object.keys(prioMap).map((prioId) => (
                <SelectItem key={prioId} value={prioId}>
                  {prioMap[parseInt(prioId) as keyof typeof prioMap]?.name}
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