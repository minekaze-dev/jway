
import React from 'react';
import type { Guide } from '../types';
import { CheckCircleIcon, LightBulbIcon } from './icons';

interface GuidePreviewProps {
    guide: Guide;
}

const GuidePreview: React.FC<GuidePreviewProps> = ({ guide }) => {
    return (
        <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700 h-full flex flex-col">
            <h4 className="text-lg font-bold text-gray-100 mb-3 text-center flex-shrink-0">Pratinjau Panduan</h4>
            <div className="bg-gray-800 p-4 rounded-lg overflow-y-auto flex-grow min-h-0">
                <h2 className="text-xl font-bold text-gray-100 break-words">{guide.title || "..."}</h2>
                <div className="text-sm text-gray-400 mt-1">{(guide.cities || []).join(', ')} · {guide.category}</div>
                <div className="text-xs text-gray-400 mt-1">
                    Kontribusi oleh: <span className="font-medium text-gray-300">{guide.author || "..."}</span>
                </div>

                <div className="mt-6 space-y-6">
                    <div>
                        <h3 className="font-semibold text-md flex items-center gap-2 text-gray-200"><CheckCircleIcon className="h-5 w-5 text-blue-500" />Langkah-langkah</h3>
                        {(guide.steps || []).length > 0 ? (
                            <ol className="list-decimal list-outside ml-5 mt-3 space-y-2 text-gray-300 text-sm">
                                {guide.steps.map((step, index) => <li key={index} className="pl-2 break-words">{step}</li>)}
                            </ol>
                        ) : (
                            <p className="text-sm text-gray-500 mt-2 ml-5">Langkah-langkah akan muncul di sini.</p>
                        )}
                    </div>

                    <div>
                        <h3 className="font-semibold text-md flex items-center gap-2 text-gray-200"><LightBulbIcon className="h-5 w-5 text-amber-400" />Tips Tambahan</h3>
                        {(guide.tips || []).length > 0 ? (
                            <ul className="list-disc list-outside ml-5 mt-3 space-y-2 text-gray-300 text-sm">
                                {guide.tips.map((tip, index) => <li key={index} className="pl-2 break-words">{tip}</li>)}
                            </ul>
                        ) : (
                                <p className="text-sm text-gray-500 mt-2 ml-5">Tips opsional akan muncul di sini.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuidePreview;
