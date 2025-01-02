"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Dictionary } from "@/dictionaries/dictionary";
import { WorkerActions } from "./workerActions";
import { api } from "@/trpc/react";
import { logger } from "@/utils/logger";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const ReportMap = dynamic(
  () => import("@/components/ReportOverview/LocationViewDialog/Map"),
  {
    ssr: false,
    loading: () => (
      <Skeleton className="w-full h-[400px]" />
    )
  }
);

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
  logger.log('Report type:', typeof report.report.createdAt);
  const { report: reportData, images, protocolls } = report;
  const currentStatus = protocolls[protocolls.length - 1]?.status ?? 1;
  const currentPriority = reportData.prio;
  const utils = api.useUtils();

  const handleActionComplete = () => {
    void utils.reportDetails.getReportDetails.invalidate();
  };

  const userIds = [...new Set(protocolls.map(protocol => protocol.userId))];
  const { data: users, isLoading: isLoadingUsers } = api.user.getUserNamesByIds.useQuery({
    userIds
  });

  if (isLoadingUsers) {
    return (
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <div className="flex justify-between">
            <Skeleton className="h-8 w-48" />
            <div className="flex space-x-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-4/5 mb-4" />
            <div className="w-full h-[400px] rounded-lg overflow-hidden border border-border">
              <div className="w-full h-full bg-muted animate-pulse" />
            </div>
          </div>
          <div>
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const userMap = new Map(users?.map(user => [user.id, user.name]) ?? []);

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>{reportData.name}</CardTitle>
          <div className="flex space-x-2">
            {worker && (
              <Badge>{dictionary.metadata.prios[reportData.prio.toString() as keyof typeof dictionary.metadata.prios].name}</Badge>
            )}
            <Badge>{dictionary.metadata.statuses[currentStatus.toString() as keyof typeof dictionary.metadata.statuses].name}</Badge>
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
          <ReportMap location={{ lat: reportData.latitude, lng: reportData.longitude }} dictionary={dictionary} />
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
            currentPriority={currentPriority}
            onActionComplete={handleActionComplete}
          />
        )}

        {protocolls.length > 0 && (
          <div>
            <h3 className="font-semibold mb-4">{dictionary.components.reportDetails.history}</h3>
            {protocolls.map((protocol, idx) => (
              <div key={idx} className="border-b py-2">
                <p>{new Date(protocol.timestamp).toLocaleDateString('de-GB')} | {userMap.get(protocol.userId) ?? 'Unknown User'}</p>
                <p>{dictionary.components.reportDetails.statuses.title}: {dictionary.metadata.statuses[protocol.status.toString() as keyof typeof dictionary.metadata.statuses].name}</p>
                {protocol.comment && <p>{protocol.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

