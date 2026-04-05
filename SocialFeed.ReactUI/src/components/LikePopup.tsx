import React, { useEffect, useState } from 'react';

interface Props {
    id: string;
    type: 'post' | 'comment';
    fetchLikers: (id: string) => Promise<string[]>;
}

export default function LikePopup({ id, type, fetchLikers }: Props) {
    const [names, setNames] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLikers(id).then(data => {
            setNames(data);
            setLoading(false);
        });
    }, [id]);

    return (
        <div className="position-absolute bg-dark text-white p-2 rounded shadow" 
             style={{ bottom: '100%', left: '0', zIndex: 1000, fontSize: '12px', minWidth: '120px' }}>
            {loading ? 'Loading...' : names.length > 0 ? names.join(', ') : 'No likes yet'}
        </div>
    );
}