"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Dictionary } from "@/dictionaries/dictionary";
import { WorkerActions } from "./workerActions";
import { api } from "@/trpc/react";

interface ReportDetailsProps {
  report: {
    report: {
      id: number;
      type: number;
      name: string;
      description: string | null;
      latitude: number;
      longitude: number;
      locationDescription: string | null;
      createdAt: string | Date;
      updatedAt: string | Date;
    };
    images: { key: string }[];
    protocolls: {
      timestamp: string | Date;
      status: number;
      comment: string | null;
    }[];
  };
  worker: boolean;
  dictionary: Dictionary;
}

export default function ReportDetails({ report, worker, dictionary }: ReportDetailsProps) {
  console.log('Report type:', typeof report.report.createdAt);
  const { report: reportData, images, protocolls } = report;
  const currentStatus = protocolls[protocolls.length - 1]?.status ?? 1;
  const utils = api.useUtils();

  const statusMap = {
    1: "New",
    2: "In Progress",
    3: "Completed",
    4: "Rejected"
  };

  const handleActionComplete = () => {
    void utils.reportDetails.getReportDetails.invalidate();
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>{reportData.name}</CardTitle>
          <Badge>{statusMap[currentStatus as keyof typeof statusMap]}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold">Description</h3>
          <p>{reportData.description}</p>
        </div>
        <div>
          <h3 className="font-semibold">Location</h3>
          <p>{reportData.locationDescription}</p>
        </div>
        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {images.map((image) => (
              <div key={image.key} className="aspect-square relative">
                <Image 
                  src={`https://utfs.io/f/${image.key}`}
                  alt="Report image"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        )}
        {worker && (
          <WorkerActions
            reportId={reportData.id}
            dictionary={dictionary}
            currentStatus={currentStatus}
            onActionComplete={handleActionComplete}
          />
        )}
        
        {protocolls.length > 0 && (
          <div>
            <h3 className="font-semibold mb-4">History</h3>
            {protocolls.map((protocol, idx) => (
              <div key={idx} className="border-b py-2">
                <p>{new Date(protocol.timestamp).toLocaleDateString()}</p>
                <p>Status: {statusMap[protocol.status as keyof typeof statusMap]}</p>
                {protocol.comment && <p>{protocol.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

