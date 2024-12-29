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
      prio: number;
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
      userId: string;
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

  const handleActionComplete = () => {
    void utils.reportDetails.getReportDetails.invalidate();
  };

  const { data: users, isLoading: isLoadingUsers } = api.user.getUsers.useQuery();

  if (isLoadingUsers) {
    return <p>Loading users...</p>;
  }

  const userMap = new Map(users?.map(user => [user.id, user.name]) ?? []);

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>{reportData.name}</CardTitle>
          <div className="flex space-x-2">
            <Badge>{prioMap[reportData.prio as keyof typeof prioMap].name}</Badge>
            <Badge>{statusMap[currentStatus as keyof typeof statusMap].name}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold">{dictionary.components.reportDetails.description}</h3>
          <p>{reportData.description}</p>
        </div>
        <div>
          <h3 className="font-semibold">{dictionary.components.reportDetails.location}</h3>
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
            <h3 className="font-semibold mb-4">{dictionary.components.reportDetails.history}</h3>
            {protocolls.map((protocol, idx) => (
              <div key={idx} className="border-b py-2">
                <p>{new Date(protocol.timestamp).toLocaleDateString('de-GB')} | {userMap.get(protocol.userId) ?? 'Unknown User'}</p>
                <p>{dictionary.components.reportDetails.statuses.title}: {statusMap[protocol.status as keyof typeof statusMap].name}</p>
                {protocol.comment && <p>{protocol.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

