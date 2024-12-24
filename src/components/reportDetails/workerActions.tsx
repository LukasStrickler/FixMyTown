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

  const statusMap = {
    "1": "New",
    "2": "In Progress",
    "3": "Completed",
    "4": "Rejected"
  };

  const addProtocoll = api.reportDetails.addProtocoll.useMutation({
    onSuccess: () => {
      setComment("");
      if (onActionComplete) {
        onActionComplete();
      }
    },
  });

  const handleSubmit = () => {
    addProtocoll.mutate({
      reportId: reportId.toString(),
      statusId: parseInt(selectedStatus),
      comment: comment,
    });
  };

  return (
    <div className="space-y-4 border p-4 rounded-lg">
      <div className="space-y-2">
        <label className="text-sm font-medium">Status</label>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Select status">
              {statusMap[selectedStatus as keyof typeof statusMap]}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">{statusMap["1"]}</SelectItem>
            <SelectItem value="2">{statusMap["2"]}</SelectItem>
            <SelectItem value="3">{statusMap["3"]}</SelectItem>
            <SelectItem value="4">{statusMap["4"]}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Comment</label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
        />
      </div>

      <Button 
        onClick={handleSubmit}
        disabled={addProtocoll.isPending}
      >
        {addProtocoll.isPending ? "Submitting..." : "Submit"}
      </Button>
    </div>
  );
} 