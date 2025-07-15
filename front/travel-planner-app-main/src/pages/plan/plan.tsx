import { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer} from 'react-leaflet';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft, Share2, Download, Printer, Calendar, List, Wind, Thermometer, Eye, BookOpen, CloudSun, Landmark, Luggage, MapPin, Ruler, Utensils, MapPinCheck, X } from 'lucide-react';
import './plan.css';
import { Plus } from 'lucide-react';

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
type WeatherData = {
    weather: {
        id: number;
        main: string;
        description: string;
        icon: string;
    }[];
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
        sea_level?: number;
        grnd_level?: number;
    };
    wind: {
        speed: number;
        deg: number;
        gust?: number;
    };
    visibility: number;
    clouds: {
        all: number;
    };
    rain?: {
        '1h'?: number;
        '3h'?: number;
    };
    snow?: {
        '1h'?: number;
        '3h'?: number;
    };
};



export default function PlanPage() {
    const [plan, setPlan] = useState<TravelPlan | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchParams] = useSearchParams();
    const planId = searchParams.get('id');

    const overviewRef = useRef<HTMLDivElement>(null!);
    const descriptionRef = useRef<HTMLDivElement>(null!);
    const weatherRef = useRef<HTMLDivElement>(null!);
    const attractionsRef = useRef<HTMLDivElement>(null!);
    const foodRef = useRef<HTMLDivElement>(null!);
    const activitiesRef = useRef<HTMLDivElement>(null!);
    const packingRef = useRef<HTMLDivElement>(null!);
    const mapRef = useRef<HTMLDivElement>(null!);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [weatherLoading, setWeatherLoading] = useState(false);
    const [weatherError, setWeatherError] = useState<string | null>(null);
    const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
        setSidebarOpen(false);
    };

    useEffect(() => {
        const fetchPlan = async () => {
            try {
                setLoading(true);
                const res = await fetch(`http://localhost:5000/plans/${planId}`);

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();
                setPlan(data);

                // Fetch weather data after plan is loaded
                if (data.place) {
                    fetchWeatherData(data.place);
                }
            } catch (error) {
                console.error('Error fetching plan:', error);
                setError(error instanceof Error ? error.message : 'Failed to load plan');
            } finally {
                setLoading(false);
            }
        };

        const fetchWeatherData = async (location: string) => {
            try {
                setWeatherLoading(true);
                setWeatherError(null);

                // Replace with your actual OpenWeather API key
                const apiKey = '3c934da20c8f485fcbab835c6fa3e4c2';
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`
                );

                if (!response.ok) {
                    throw new Error('Weather data not found');
                }

                const data = await response.json();
                setWeather(data);
            } catch (err) {
                console.error('Error fetching weather:', err);
                setWeatherError(err instanceof Error ? err.message : 'Failed to load weather data');
            } finally {
                setWeatherLoading(false);
            }
        };

        fetchPlan();
    }, [planId]);

    const windDegToDirection = (deg: number) => {
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        return directions[Math.round(deg / 45) % 8];
    };

    const getWeatherIconUrl = (iconCode: string) => {
        return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    };

    if (loading) return <div className="p-8">Loading plan...</div>;
    if (error) return <div className="p-8 text-red-600">Error: {error}</div>;
    if (!plan) return <div className="p-8">Plan not found</div>;

    // Helper function to check if content exists
    // function hasContent(value?: string[] | string): boolean {
    //     if (Array.isArray(value)) {
    //         return value.length > 0;
    //     }
    //     return value !== undefined && value.trim().length > 0;
    // }
    function hasStringContent(value?: string): boolean {
        return value !== undefined && value.trim().length > 0;
    }

    function hasArrayContent(value?: string[]): boolean {
        return value !== undefined && value.length > 0;
    }
    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar for desktop */}
            <aside className="hidden md:block w-64 bg-white shadow-sm border-r border-gray-200 p-4 sticky top-0 h-screen overflow-y-auto">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    Plan Navigation
                </h3>
                <nav className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start" onClick={() => scrollToSection(overviewRef)}>
                        <MapPin className="h-4 w-4 mr-2" /> Overview
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => scrollToSection(descriptionRef)}>
                        <BookOpen className="h-4 w-4 mr-2" /> Description
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => scrollToSection(weatherRef)}>
                        <CloudSun className="h-4 w-4 mr-2" /> Weather
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => scrollToSection(attractionsRef)}>
                        <Landmark className="h-4 w-4 mr-2" /> Attractions
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => scrollToSection(foodRef)}>
                        <Utensils className="h-4 w-4 mr-2" /> Local Cuisine
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => scrollToSection(activitiesRef)}>
                        <Ruler className="h-4 w-4 mr-2" /> Activities
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => scrollToSection(packingRef)}>
                        <Luggage className="h-4 w-4 mr-2" /> Packing List
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => scrollToSection(mapRef)}>
                        <MapPinCheck className="h-4 w-4 mr-2" /> Destination Map
                    </Button>
                </nav>
            </aside>

            {/* Sidebar toggle for mobile */}
            <div className="md:hidden fixed bottom-4 right-4 z-50">
                <Button size="lg" className="rounded-full w-14 h-14 shadow-lg" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    <List className="h-6 w-6" />
                </Button>
            </div>

            {sidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Mobile Sidebar */}
            <aside className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>
                <div className="p-4">
                    <h3 className="font-semibold text-lg mb-4">Plan Navigation</h3>
                    <nav className="space-y-2">
                        <Button variant="ghost" className="w-full justify-start" onClick={() => scrollToSection(overviewRef)}>
                            <MapPin className="h-4 w-4 mr-2" /> Overview
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" onClick={() => scrollToSection(descriptionRef)}>
                            <BookOpen className="h-4 w-4 mr-2" /> Description
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" onClick={() => scrollToSection(weatherRef)}>
                            <CloudSun className="h-4 w-4 mr-2" /> Weather
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" onClick={() => scrollToSection(attractionsRef)}>
                            <Landmark className="h-4 w-4 mr-2" /> Attractions
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" onClick={() => scrollToSection(foodRef)}>
                            <Utensils className="h-4 w-4 mr-2" /> Local Cuisine
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" onClick={() => scrollToSection(activitiesRef)}>
                            <Ruler className="h-4 w-4 mr-2" /> Activities
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" onClick={() => scrollToSection(packingRef)}>
                            <Luggage className="h-4 w-4 mr-2" /> Packing List
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" onClick={() => scrollToSection(mapRef)}>
                            <MapPinCheck className="h-4 w-4 mr-2" /> Destination Map
                        </Button>
                    </nav>
                </div>
            </aside>

            <main className="flex-1">
                <header className="bg-white shadow-sm">
                    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                        <Button variant="ghost" asChild>
                            <Link to="/dashboard" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Dashboard
                            </Link>
                        </Button>
                        <div className="flex gap-2">
                            <Button variant="outline"><Share2 className="h-4 w-4 mr-2" /> Share</Button>
                            <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Download</Button>
                            <Button variant="outline"><Printer className="h-4 w-4 mr-2" /> Print</Button>
                        </div>
                    </div>
                </header>

                {/* Overview */}
                <section ref={overviewRef} className="container mx-auto px-4 py-4">
                    <Card className="mb-8">
                        <CardTitle className="text-lg font-semibold pl-6 flex items-center gap-2">
                            <MapPin className="h-5 w-5" /> {plan.place} Travel Plan
                        </CardTitle>

                        <CardContent className=""> {/* Remove padding from CardContent */}
                            {/* Image with title and duration overlay */}
                            <div className="relative">
                                {plan.image && (
                                    <img
                                        src={plan.image}
                                        alt="Travel Plan"
                                        className="w-full h-64 object-cover rounded-lg"
                                    />
                                )}

                                {/* Duration box */}
                                <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-md flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>{plan.duration} days</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>


                {/* Description */}
                <section ref={descriptionRef} className="container mx-auto px-4 py-4">
                    <Card className="mb-8">
                        <CardHeader className="flex justify-between items-center">
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5" /> Description
                            </CardTitle>
                            {/*PLUS BUTTON*/}
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {hasStringContent(plan.description) ? (
                                <p className="text-gray-700 whitespace-pre-line">{plan.description}</p>
                            ) : (
                                <p className="text-gray-500 italic">Click + to add description about the place</p>
                            )}
                        </CardContent>
                    </Card>
                </section>

                {/* Weather Section */}
                <section ref={weatherRef} className="container mx-auto px-4 py-4">
                    <Card className="mb-8">
                        <CardHeader className="flex justify-between items-center">
                            <CardTitle className="flex items-center gap-2">
                                <CloudSun className="h-5 w-5" /> Weather in {plan?.place}
                            </CardTitle>
                            {/*PLUS BUTTON*/}
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {weatherLoading && <div>Loading weather data...</div>}
                            {weatherError && <div className="text-red-500">{weatherError}</div>}

                            {weather && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Card 1: Main Weather */}
                                    <div className="bg-blue-50 rounded-lg p-6 flex flex-col items-center">
                                        <div className="flex items-center gap-4 mb-4">
                                            {weather.weather[0]?.icon && (
                                                <img
                                                    src={getWeatherIconUrl(weather.weather[0].icon)}
                                                    alt={weather.weather[0].description}
                                                    className="w-16 h-16"
                                                />
                                            )}
                                            <div>
                                                <h3 className="text-2xl font-bold">
                                                    {Math.round(weather.main.temp)}°C
                                                </h3>
                                                <p className="capitalize">
                                                    {weather.weather[0]?.description}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 w-full">
                                            <div className="bg-white p-3 rounded-lg text-center">
                                                <p className="text-sm text-gray-500">Feels like</p>
                                                <p className="font-semibold">
                                                    {Math.round(weather.main.feels_like)}°C
                                                </p>
                                            </div>
                                            <div className="bg-white p-3 rounded-lg text-center">
                                                <p className="text-sm text-gray-500">High/Low</p>
                                                <p className="font-semibold">
                                                    {Math.round(weather.main.temp_max)}°/{Math.round(weather.main.temp_min)}°
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card 2: Wind */}
                                    <div className="bg-blue-50 rounded-lg p-6">
                                        <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                                            <Wind className="h-5 w-5" /> Wind
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white p-3 rounded-lg">
                                                <p className="text-sm text-gray-500">Speed</p>
                                                <p className="font-semibold">
                                                    {weather.wind.speed} m/s
                                                </p>
                                            </div>
                                            <div className="bg-white p-3 rounded-lg">
                                                <p className="text-sm text-gray-500">Direction</p>
                                                <p className="font-semibold">
                                                    {windDegToDirection(weather.wind.deg)}
                                                </p>
                                            </div>
                                            {weather.wind.gust && (
                                                <div className="bg-white p-3 rounded-lg col-span-2">
                                                    <p className="text-sm text-gray-500">Gust</p>
                                                    <p className="font-semibold">
                                                        {weather.wind.gust} m/s
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Card 3: Atmosphere */}
                                    <div className="bg-blue-50 rounded-lg p-6">
                                        <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                                            <Thermometer className="h-5 w-5" /> Atmosphere
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white p-3 rounded-lg">
                                                <p className="text-sm text-gray-500">Humidity</p>
                                                <p className="font-semibold">
                                                    {weather.main.humidity}%
                                                </p>
                                            </div>
                                            <div className="bg-white p-3 rounded-lg">
                                                <p className="text-sm text-gray-500">Pressure</p>
                                                <p className="font-semibold">
                                                    {weather.main.pressure} hPa
                                                </p>
                                            </div>
                                            {weather.main.sea_level && (
                                                <div className="bg-white p-3 rounded-lg">
                                                    <p className="text-sm text-gray-500">Sea Level</p>
                                                    <p className="font-semibold">
                                                        {weather.main.sea_level} hPa
                                                    </p>
                                                </div>
                                            )}
                                            {weather.main.grnd_level && (
                                                <div className="bg-white p-3 rounded-lg">
                                                    <p className="text-sm text-gray-500">Ground Level</p>
                                                    <p className="font-semibold">
                                                        {weather.main.grnd_level} hPa
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Card 4: Visibility */}
                                    <div className="bg-blue-50 rounded-lg p-6">
                                        <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
                                            <Eye className="h-5 w-5" /> Visibility
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white p-3 rounded-lg">
                                                <p className="text-sm text-gray-500">Visibility</p>
                                                <p className="font-semibold">
                                                    {(weather.visibility / 1000).toFixed(1)} km
                                                </p>
                                            </div>
                                            <div className="bg-white p-3 rounded-lg">
                                                <p className="text-sm text-gray-500">Cloudiness</p>
                                                <p className="font-semibold">
                                                    {weather.clouds.all}%
                                                </p>
                                            </div>
                                            {weather.rain?.['1h'] && (
                                                <div className="bg-white p-3 rounded-lg">
                                                    <p className="text-sm text-gray-500">Rain (1h)</p>
                                                    <p className="font-semibold">
                                                        {weather.rain['1h']} mm
                                                    </p>
                                                </div>
                                            )}
                                            {weather.snow?.['1h'] && (
                                                <div className="bg-white p-3 rounded-lg">
                                                    <p className="text-sm text-gray-500">Snow (1h)</p>
                                                    <p className="font-semibold">
                                                        {weather.snow['1h']} mm
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </section>

                {/* Attractions */}
                <section ref={attractionsRef} className="container mx-auto px-4 py-4">
                    <Card className="mb-8">
                        <CardHeader className="flex justify-between items-center">
                            <CardTitle className="flex items-center gap-2">
                                <Landmark className="h-5 w-5" /> Attractions
                            </CardTitle>
                            {/*PLUS BUTTON*/}
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {hasArrayContent(plan.attractions) ? (
                                <ol className="text-gray-700 list-decimal pl-10 space-y-2">
                                    {plan.attractions?.map((attraction, index) => (
                                        <li key={index} className="pl-2">{attraction}</li>
                                    ))}
                                </ol>
                            ) : (
                                <p className="text-gray-500 italic">Click + to add new attractions</p>
                            )}
                        </CardContent>
                    </Card>
                </section>

                {/* Local Cuisine Recommendations */}
                <section ref={foodRef} className="container mx-auto px-4 py-4">
                    <Card className="mb-8">
                        <CardHeader className="flex justify-between items-center">
                            <CardTitle className="flex items-center gap-2">
                                <Utensils className="h-5 w-5" /> Local Cuisine Recommendations
                            </CardTitle>
                            {/*PLUS BUTTON*/}
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {hasArrayContent(plan.foods) ? (
                                <ol className="text-gray-700 list-decimal pl-10 space-y-2">
                                    {plan.foods?.map((foods, index) => (
                                        <li key={index} className="pl-2">{foods}</li>
                                    ))}
                                </ol>
                            ) : (
                                <p className="text-gray-500 italic">Click + to add food item</p>
                            )}
                        </CardContent>
                    </Card>
                </section>

                {/* Activities */}
                <section ref={activitiesRef} className="container mx-auto px-4 py-4">
                    <Card className="mb-8">
                        <CardHeader className="flex justify-between items-center">
                            <CardTitle className="flex items-center gap-2">
                                <Ruler className="h-5 w-5" /> Activities
                            </CardTitle>
                            {/*PLUS BUTTON*/}
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {hasArrayContent(plan.activities) ? (
                                <ol className="text-gray-700 list-decimal pl-10 space-y-2">
                                    {plan.activities?.map((activities, index) => (
                                        <li key={index} className="pl-2">{activities}</li>
                                    ))}
                                </ol>
                            ) : (
                                <p className="text-gray-500 italic">Click + to add activities</p>
                            )}
                        </CardContent>
                    </Card>
                </section>

                {/* Packing List */}
                <section ref={packingRef} className="container mx-auto px-4 py-4">
                    <Card className="mb-8">
                        <CardHeader className="flex justify-between items-center">
                            <CardTitle className="flex items-center gap-2">
                                <Luggage className="h-5 w-5" /> Packing List
                            </CardTitle>
                            {/*PLUS BUTTON*/}
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {hasArrayContent(plan.packing_list) ? (
                                <ol className="text-gray-700 list-decimal pl-10 space-y-2">
                                    {plan.packing_list?.map((packing_list, index) => (
                                        <li key={index} className="pl-2">{packing_list}</li>
                                    ))}
                                </ol>
                            ) : (
                                <p className="text-gray-500 italic">Click + to add items</p>
                            )}
                        </CardContent>
                    </Card>
                </section>

                {/* Destination Map */}
                <section ref={mapRef} className="container mx-auto px-4 py-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPinCheck className="h-5 w-5" /> Places to visit
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex">
                                {/* Attractions sidebar - left of map */}
                                <div className="w-1/3 pr-4">
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 h-96 overflow-y-auto">
                                        <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
                                            <Landmark className="h-4 w-4" /> Selected Attractions
                                        </h3>
                                        {hasArrayContent(plan.attractions) ? (
                                            <div className="space-y-3">
                                                {plan.attractions?.map((attraction, index) => (
                                                    <div
                                                        key={index}
                                                        className="relative bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-700">{attraction}</span>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6 rounded-full text-gray-400 hover:text-red-500"
                                                                onClick={() => { }}
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 italic">No attractions added yet</p>
                                        )}
                                    </div>
                                </div>

                                {/* Map container - right side */}
                                <MapContainer center={[48.8566, 2.3522]} zoom={5} className="h-96 w-full rounded-lg">
                                    <TileLayer
                                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                </MapContainer>
                            </div>
                        </CardContent>
                    </Card>
                </section>

            </main>
        </div>
    );
}