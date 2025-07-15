import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

// type TravelPlan = {
//     _id: any;
//     id: string;
//     name?: string;
//     image: string;
//     destinations?: string[];
//     startDate?: string;
//     endDate?: string;
// };

type TravelPlan = {
    _id: string;
    name?: string;
    image: string;
    place: string;
    duration: number;
    description?: string;
    activities?: string[];
    attractions?: string[];
    foods?: string[];
    packing_list?: string[];
    destination?: String;
    startDate?: String;
    endDate?: String;
};

export default function PlansPage() {
    const [plans, setPlans] = useState<TravelPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await fetch('http://localhost:5000/plans');
                if (!res.ok) throw new Error('Failed to fetch plans');
                const data = await res.json();
                setPlans(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    if (loading) return <div className="p-8">Loading plans...</div>;
    if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">My Travel Plans</h1>
                <Button asChild>
                    <Link to="/dashboard" className="flex items-center gap-2">
                        Dashboard
                    </Link>
                </Button>
            </div>

            {plans.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <h2 className="text-xl font-medium mb-4">No travel plans yet</h2>
                    <p className="text-muted-foreground mb-6">Create your first travel plan to get started</p>
                    <Button asChild>
                        <Link to="/plans/new" className="flex items-center gap-2">
                            <Plus size={18} />
                            Create New Plan
                        </Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <Link to={`/plan/plan?id=${plan._id}`} className="group" key={plan._id}>
                            <Card className="hover:shadow-lg transition-shadow duration-300 h-full p-0 overflow-hidden">
                                <div className="relative h-60 w-full overflow-hidden">
                                    <img
                                        src={plan.image}
                                        alt={plan.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                    <div className="absolute bottom-0 left-0 p-4 w-full">
                                        <CardTitle className="text-white text-xl">
                                            {plan.name || 'Unnamed Plan'}
                                        </CardTitle>
                                        <div className="flex justify-between text-sm text-white/80 mt-1">
                                            <span>{plan.place}</span>
                                            <span>{plan.duration} days</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}

                </div>
            )}
        </div>
    );
}