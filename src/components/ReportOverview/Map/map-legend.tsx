import type { Dictionary } from "@/dictionaries/dictionary";
import { createSvgContent } from './map-content';

interface LegendProps {
    dictionary: Dictionary;
}

export default function Legend({ dictionary }: LegendProps) {
    const dict = dictionary.metadata;

    return (
        <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 rounded-lg border shadow-lg w-[200px] h-fit">
            <h3 className="font-medium mb-3">Legende</h3>
            <div className="space-y-4 text-sm">
                <div>
                    <h4 className="font-medium mb-2">Typ</h4>
                    <div className="space-y-2">
                        {(Object.keys(dict.types) as Array<keyof typeof dict.types>).map((type) => (
                            <div key={type} className="flex items-center gap-2">
                                <div dangerouslySetInnerHTML={{
                                    __html: createSvgContent(Number(type), 1, 0, 'shape')
                                }} />
                                <span>{dict.types[type].name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="font-medium mb-2">Status</h4>
                    <div className="space-y-2">
                        {(Object.keys(dict.statuses) as Array<keyof typeof dict.statuses>).map((status) => (
                            <div key={status} className="flex items-center gap-2">
                                <div dangerouslySetInnerHTML={{
                                    __html: createSvgContent(1, 1, Number(status), 'color')
                                }} />
                                <span>{dict.statuses[status].name}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h4 className="font-medium mb-2">Priorität</h4>
                    <div className="space-y-2">
                        {(Object.keys(dict.prios) as Array<keyof typeof dict.prios>).map((prio) => (
                            <div key={prio} className="flex items-center gap-2">
                                <div dangerouslySetInnerHTML={{
                                    __html: createSvgContent(1, Number(prio), 0, 'size')
                                }} />
                                <span>{dict.prios[prio].name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
