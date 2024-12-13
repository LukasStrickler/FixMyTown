import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  dictionary: Record<string, any>;
}

export default function ReportDetails({ report, worker, dictionary }: ReportDetailsProps) {
  console.log('Report type:', typeof report.report.createdAt);
  const { report: reportData, images, protocolls } = report;
  const currentStatus = protocolls[protocolls.length - 1]?.status ?? 1;

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>{reportData.name}</CardTitle>
          <Badge>{currentStatus}</Badge>
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
        {worker && protocolls.length > 0 && (
          <div>
            <h3 className="font-semibold">History</h3>
            {protocolls.map((protocol, idx) => (
              <div key={idx} className="border-b py-2">
                <p>{new Date(protocol.timestamp).toLocaleDateString()}</p>
                <p>Status: {protocol.status}</p>
                {protocol.comment && <p>{protocol.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

