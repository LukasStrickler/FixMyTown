import type { Dictionary } from "@/dictionaries/dictionary";
import { createSvgContent } from './map-content';

interface LegendProps {
    dictionary: Dictionary;
    filters: {
        types: Set<number>;
        statuses: Set<number>;
        prios: Set<number>;
    };
    onFilterChange: (category: 'types' | 'statuses' | 'prios', id: number, checked: boolean) => void;
}

export default function Legend({ dictionary, filters, onFilterChange }: LegendProps) {
    const dict = dictionary.metadata;
    const legendDict = dictionary.components.mapLegend;

    return (
        <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 rounded-lg border shadow-lg w-[250px] h-[620px] h-fit">
            <h3 className="font-medium mb-3">{legendDict.title}</h3>
            <div className="space-y-4 text-sm">
                <div>
                    <h4 className="font-medium mb-2">{legendDict.typeTitle}</h4>
                    <div className="space-y-2">
                        {(Object.keys(dict.types) as Array<keyof typeof dict.types>).map((type) => (
                            <label key={type} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.types.has(Number(type))}
                                    onChange={(e) => onFilterChange('types', Number(type), e.target.checked)}
                                    className="h-4 w-4 rounded border border-input bg-background text-secondary appearance-none checked:bg-secondary checked:border-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                <div dangerouslySetInnerHTML={{
                                    __html: createSvgContent(Number(type), 1, 0, 'shape')
                                }} />
                                <span>{dict.types[type].name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="font-medium mb-2">{legendDict.statusTitle}</h4>
                    <div className="space-y-2">
                        {(Object.keys(dict.statuses) as Array<keyof typeof dict.statuses>).map((status) => (
                            <label key={status} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.statuses.has(Number(status))}
                                    onChange={(e) => onFilterChange('statuses', Number(status), e.target.checked)}
                                    className="h-4 w-4 rounded border border-input bg-background text-secondary appearance-none checked:bg-secondary checked:border-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                <div dangerouslySetInnerHTML={{
                                    __html: createSvgContent(1, 1, Number(status), 'color')
                                }} />
                                <span>{dict.statuses[status].name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="font-medium mb-2">{legendDict.priorityTitle}</h4>
                    <div className="space-y-2">
                        {(Object.keys(dict.prios) as Array<keyof typeof dict.prios>).map((prio) => (
                            <label key={prio} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.prios.has(Number(prio))}
                                    onChange={(e) => onFilterChange('prios', Number(prio), e.target.checked)}
                                    className="h-4 w-4 rounded border border-input bg-background text-secondary appearance-none checked:bg-secondary checked:border-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                <div
                                    className="scale-90 -translate-y-1"
                                    dangerouslySetInnerHTML={{
                                        __html: createSvgContent(1, Number(prio), 0, 'size')
                                    }} />
                                <span>{dict.prios[prio].name}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
