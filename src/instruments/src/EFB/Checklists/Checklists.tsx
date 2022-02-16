import React from 'react';
import { usePersistentNumberProperty } from '@instruments/common/persistence';
import { ChecklistPage } from './ChecklistsPage';
import { CHECKLISTS } from './Lists';
import { ScrollableContainer } from '../UtilComponents/ScrollableContainer';
import {
    areAllChecklistItemsCompleted,
    setChecklistCompletion, setChecklistItemCompletion,
    setSelectedChecklistIndex,
} from '../Store/features/checklists';
import { useAppDispatch, useAppSelector } from '../Store/store';

export interface ChecklistItem {
    item: string;
    result: string;
    condition?: () => boolean;
    divider?: boolean;
}

export interface Checklist {
    name: string;
    items: ChecklistItem[]
}

export const Checklists = () => {
    const dispatch = useAppDispatch();

    const handleClick = (index: number) => {
        dispatch(setSelectedChecklistIndex(index));
    };

    const { selectedChecklistIndex, checklists } = useAppSelector((state) => state.checklists);

    const [autoFillChecklists] = usePersistentNumberProperty('EFB_AUTOFILL_CHECKLISTS', 0);

    const getTabClassName = (index: number) => {
        if (index === selectedChecklistIndex && areAllChecklistItemsCompleted(index)) {
            return 'bg-colors-lime-400 text-theme-body border-colors-lime-400';
        }
        if (index === selectedChecklistIndex) {
            return 'bg-theme-highlight text-theme-body border-theme-highlight';
        }
        if (areAllChecklistItemsCompleted(index)) {
            return 'bg-theme-body border-colors-lime-400 text-colors-lime-400';
        }
        return 'bg-theme-accent border-theme-accent text-theme-text hover:bg-theme-highlight hover:text-theme-body';
    };

    return (
        <>
            <h1 className="mb-4 font-bold">Checklists</h1>
            <div className="flex flex-row space-x-6">
                <div className="flex-shrink-0 w-1/4">
                    <ScrollableContainer height={51}>
                        <div className="space-y-4">
                            {CHECKLISTS.map((cl, index) => (
                                <div
                                    className={`flex justify-center items-center w-full h-12 rounded-md border transition duration-100 ${getTabClassName(index)}`}
                                    onClick={() => handleClick(index)}
                                >
                                    {cl.name}
                                </div>
                            ))}
                        </div>
                    </ScrollableContainer>
                    <div
                        className="flex justify-center items-center h-12 text-red-500 hover:text-theme-body bg-theme-body hover:bg-red-500 rounded-md border border-red-500 transition duration-100"
                        onClick={() => {
                            checklists[selectedChecklistIndex].items.forEach((_, itemIdx) => {
                                if (autoFillChecklists && CHECKLISTS[selectedChecklistIndex].items[itemIdx].condition) {
                                    return;
                                }

                                dispatch(setChecklistItemCompletion({ checklistIndex: selectedChecklistIndex, itemIndex: itemIdx, completionValue: false }));
                            });
                            dispatch(setChecklistCompletion({ checklistIndex: selectedChecklistIndex, completion: false }));
                        }}
                    >
                        Reset Checklist
                    </div>
                </div>
                <ChecklistPage />
            </div>
        </>
    );
};
