import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from '@/components/ui/drawer';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Menu, Plus, Edit, Trash2, LogOut, LayoutDashboard, Plane, Mountain, Sun, Map, X } from 'lucide-react';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from 'react-datepicker';
import '../../components/css/daterange.css';

// Interface pour un itinéraire
interface Itinerary {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  budget: number;
  destinations: { name: string }[];
}

// Exemples de plans de voyage
const sampleItineraries = [
  {
    title: 'Une semaine à Paris',
    startDate: '2024-12-01',
    endDate: '2024-12-07',
    budget: 800,
    destinations: [{ name: 'Paris' }],
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'city',
  },
  {
    title: 'Road trip en Toscane',
    startDate: '2024-11-15',
    endDate: '2024-11-22',
    budget: 1200,
    destinations: [{ name: 'Florence' }, { name: 'Sienne' }, { name: 'Pise' }],
    image: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'roadtrip',
  },
  {
    title: 'Plages de Bali',
    startDate: '2025-01-10',
    endDate: '2025-01-20',
    budget: 1500,
    destinations: [{ name: 'Ubud' }, { name: 'Kuta' }],
    image: 'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'beach',
  },
  {
    title: 'Découverte du Japon',
    startDate: '2025-03-15',
    endDate: '2025-03-30',
    budget: 2500,
    destinations: [{ name: 'Tokyo' }, { name: 'Kyoto' }, { name: 'Osaka' }],
    image: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'cultural',
  },
  {
    title: 'Aventure en Patagonie',
    startDate: '2024-12-10',
    endDate: '2024-12-20',
    budget: 1800,
    destinations: [{ name: 'El Calafate' }, { name: 'Torres del Paine' }],
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'adventure',
  },
  {
    title: 'Safari en Tanzanie',
    startDate: '2025-06-01',
    endDate: '2025-06-10',
    budget: 3000,
    destinations: [{ name: 'Serengeti' }, { name: 'Ngorongoro' }],
    image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'safari',
  },
  {
    title: 'Randonnée en Islande',
    startDate: '2025-07-05',
    endDate: '2025-07-15',
    budget: 2000,
    destinations: [{ name: 'Reykjavik' }, { name: 'Landmannalaugar' }],
    image: 'https://images.unsplash.com/photo-1535914254981-b5012eebbd15?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'hiking',
  },
  {
    title: 'Séjour en Laponie',
    startDate: '2024-12-20',
    endDate: '2024-12-27',
    budget: 2200,
    destinations: [{ name: 'Rovaniemi' }],
    image: 'https://images.unsplash.com/photo-1570021974427-08a69e46a409?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'winter',
  }
];


// Configuration d'axios
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fonction pour obtenir une icône en fonction du type de voyage
const getTravelIcon = (type: string) => {
  switch (type) {
    case 'city':
      return <Plane className="h-6 w-6 text-blue-500" />;
    case 'roadtrip':
      return <Map className="h-6 w-6 text-green-500" />;
    case 'beach':
      return <Sun className="h-6 w-6 text-yellow-500" />;
    default:
      return <Mountain className="h-6 w-6 text-gray-500" />;
  }
};

const Dashboard: React.FC = () => {
  const [city, setCity] = useState<string>('');
  const [location, setLocation] = useState<any>(null);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false); // État pour la boîte de dialogue
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);

    const fetchItineraries = async () => {
      try {
        const response = await api.get('/itineraries');
        setItineraries(response.data);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          setError('Session expirée. Veuillez vous reconnecter.');
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          //setError('Erreur lors du chargement des itinéraires');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchItineraries();
  }, [navigate]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet itinéraire ?')) {
      try {
        await api.delete(`/itineraries/${id}`);
        setItineraries(itineraries.filter((itinerary) => itinerary._id !== id));
      } catch (err) {
        setError('Erreur lors de la suppression de l\'itinéraire');
      }
    }
  };

  const handleUseSample = (sample: any) => {
    navigate('/itineraries/new', { state: sample });
  };

  // Ouvrir la boîte de dialogue
  const openModal = () => setModalOpen(true);

  // Fermer la boîte de dialogue
  const closeModal = () => setModalOpen(false);

  // normal creation for plan works :)
  const handleCreateYourPlan = async () => {
    if (!startDate || !endDate || !city) {
      alert("Please fill all required data");
      return;
    }

    const duration = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const userId = localStorage.getItem('userId');

    if (!userId) {
      alert("User undefined pls try again");
      return;
    }

    try {
      const unsplashAccessKey = "VnZel2m9GFcVJs_vbpb2bAr3iQMhBqFbdcEZoQoTQpU";
      const imageRes = await fetch(
        `https://api.unsplash.com/search/photos?query=${city}&client_id=${unsplashAccessKey}&orientation=landscape&per_page=1`
      );

      const imageData = await imageRes.json();
      const imageUrl = imageData?.results?.[0]?.urls?.regular || "";

      const response = await api.post('/plans', {
        userId,
        place: city,
        duration,
        name: `Plan à ${city}`,
        image: imageUrl,
      });

      console.log("Plan créé avec succès :", response.data);
      navigate('/plan/planspage');
      closeModal();
    } catch (error) {
      console.error("Erreur lors de la création du plan :", error);
      alert("Échec de la création du plan. Veuillez réessayer.");
    }
  };



  // Generate AI plan works :)

  const handleGenerateAIPlan = async () => {
    if (!startDate || !endDate || !city) {
      alert("Please fill all required data");
      return;
    }

    const duration = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const userId = localStorage.getItem('userId');

    if (!userId) {
      alert("User undefined pls try again");
      return;
    }

    setIsGenerating(true);

    try {
      const guideResponse = await fetch('http://localhost:5001/generate-guide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city })
      });

      if (!guideResponse.ok) {
        throw new Error('Failed to get AI guide');
      }

      const guideData = await guideResponse.json();

      const unsplashAccessKey = "VnZel2m9GFcVJs_vbpb2bAr3iQMhBqFbdcEZoQoTQpU";
      const imageRes = await fetch(
        `https://api.unsplash.com/search/photos?query=${city}&client_id=${unsplashAccessKey}&orientation=landscape&per_page=1`
      );
      const imageData = await imageRes.json();
      const imageUrl = imageData?.results?.[0]?.urls?.regular || "";

      const response = await api.post('/plans', {
        userId,
        place: city,
        duration,
        name: `AI Plan for ${city}`,
        image: imageUrl,
        description: guideData.description || `A wonderful trip to ${city}`,
        attractions: guideData.attractions || [],
        foods: guideData.foods || [],
        activities: guideData.activities || [],
        packing_list: guideData.packing_list || []
      });

      console.log("AI Plan created successfully:", response.data);
      navigate('/plan/planspage');
      closeModal();
    } catch (error) {
      console.error("Error creating AI plan:", error);
      alert("Failed to create AI plan. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // search city function :)

  const handleCitySearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value;
    setCity(searchQuery);

    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      setLoading(true);
      setError('');

      try {
        const response = await axios.get('https://wft-geo-db.p.rapidapi.com/v1/geo/cities', {
          params: { namePrefix: searchQuery, limit: 5 },
          headers: {
            'X-RapidAPI-Key': 'ed5110a902msha83efbb6f54193ep1e74b0jsnd659002133a4',
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
          }
        });

        const results = response.data.data;
        setSuggestions(results);
      } catch (err) {
        setError('Error fetching data from GeoDB');
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 500);
  };
  // select city from dropdown :)
  const handleSuggestionClick = (cityObj: any) => {
    setCity(`${cityObj.name}`);
    setLocation(cityObj);
    setSuggestions([]);
  };
  // select date range function :)
  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-b from-blue-50 to-gray-100'}`}>
      {/* Barre de navigation */}
      <header className={`shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                <DrawerTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden" aria-label="Ouvrir le menu">
                    <Menu className="h-6 w-6" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Menu</DrawerTitle>
                  </DrawerHeader>
                  <div className="p-4">
                    <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/dashboard')}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Tableau de bord
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Déconnexion
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" onClick={toggleDarkMode}>
                      <Sun className="mr-2 h-4 w-4" />
                      {darkMode ? 'Mode Clair' : 'Mode Sombre'}
                    </Button>
                  </div>
                  <DrawerClose asChild>
                    <Button variant="outline" className="m-4">
                      Fermer
                    </Button>
                  </DrawerClose>
                </DrawerContent>
              </Drawer>
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-blue-600">Travel Planner</h1>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Tableau de bord
              </Button>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </Button>
              <Button variant="ghost" onClick={toggleDarkMode}>
                <Sun className="mr-2 h-4 w-4" />
                {darkMode ? 'Mode Clair' : 'Mode Sombre'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${darkMode ? 'text-white' : ''}`}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">Tableau de bord</h2>
            {/* <p className="mt-1">Planifiez et gérez vos aventures ici.</p> */}
          </div>
          {/* Bouton "Create Travel Plan" */}
          <div className="flex gap-4">
            <Button
              onClick={openModal}
              className={darkMode ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Travel Plan
            </Button>

            <Button className={darkMode ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}>
              <Link to="/plan/planspage" className="flex items-center gap-2">
                My Plans
              </Link>
            </Button>
          </div>


        </div>

        {/* Boîte de dialogue modale */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className={`p-6 rounded-lg shadow-lg max-w-lg w-full ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
              {/* En-tête de la boîte de dialogue */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Create Travel Plan</h3>
                <Button variant="ghost" size="icon" onClick={closeModal}>
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {/* city search working :) */}
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for your destination city..."
                    value={city}
                    onChange={handleCitySearch}
                    className="w-full p-2 border rounded-md"
                  />
                  {suggestions.length > 0 && (
                    <ul className="absolute bg-white border w-full mt-1 z-10 rounded-md max-h-60 overflow-y-auto shadow">
                      {suggestions.map((s) => (
                        <li
                          key={s.id}
                          onClick={() => handleSuggestionClick(s)}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                        >
                          {s.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {location && (
                  <div className="mt-4">
                    <p>{location.formatted}</p>
                  </div>
                )}

                {/* pick travel date works :) */}
                <div className="w-full">
                  <label className="block text-sm font-medium">Select Dates</label>
                  <DatePicker
                    selected={startDate}
                    onChange={handleDateChange}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    placeholderText="Pick Travel Dates"
                    className={`w-full p-2 border rounded-md ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'}`}
                    calendarClassName="calendar"
                    wrapperClassName="datepicker-wrapper"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Select the kind of activities you want to do (Optional)</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Button variant="outline">Sightseeing</Button>
                    <Button variant="outline">Adventure</Button>
                    <Button variant="outline">Cultural Experiences</Button>
                    <Button variant="outline">Historical</Button>
                    <Button variant="outline">Relaxation</Button>
                    <Button variant="outline">Shopping</Button>
                    <Button variant="outline">Nightlife</Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium">Who are you travelling with (Optional)</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Button variant="outline">Solo</Button>
                    <Button variant="outline">Couple</Button>
                    <Button variant="outline">Family</Button>
                    <Button variant="outline">Group</Button>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <Button
                    //onClick={handleCreateYourPlan}
                    className="bg-purple-500 hover:bg-purple-600 text-white"
                  >
                    Create Your Plan
                  </Button>
                  <Button
                    onClick={handleGenerateAIPlan}
                    className={`bg-purple-600 hover:bg-purple-700 text-white ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <div className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                      </div>
                    ) : (
                      "Generate AI Plan"
                    )}
                  </Button>
                </div>
              </div>
            </div>

          </div>
        )
        }

        {
          error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )
        }

        {
          loading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner className={`h-8 w-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
          ) : itineraries.length === 0 ? (
            <div>
              {/* <p className="mb-6 text-center">
                Aucun itinéraire trouvé. Commencez par en ajouter un ou inspirez-vous de nos exemples ci-dessous !
              </p> */}
              <h3 className="text-xl font-bold mb-4">Exemples de plans de voyage</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sampleItineraries.map((sample, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`shadow-lg hover:shadow-xl transition-shadow duration-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
                      <CardHeader className="relative">
                        <img
                          src={sample.image}
                          alt={sample.title}
                          className="w-full h-40 object-cover rounded-t-lg"
                        />
                        <div className="absolute top-2 right-2 bg-white p-1 rounded-full">
                          {getTravelIcon(sample.type)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardTitle className="text-lg font-semibold">{sample.title}</CardTitle>
                        <p className="text-sm">
                          Du {new Date(sample.startDate).toLocaleDateString()} au{' '}
                          {new Date(sample.endDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm">Budget : {sample.budget} €</p>
                        <p className="text-sm">
                          Destinations : {sample.destinations.map((d) => d.name).join(', ')}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="outline"
                          className={`w-full ${darkMode ? 'text-white border-gray-500 hover:bg-gray-700' : 'hover:bg-blue-100'}`}
                          onClick={() => handleUseSample(sample)}
                        >
                          Utiliser ce plan
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {itineraries.map((itinerary, index) => (
                <motion.div
                  key={itinerary._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`shadow-lg hover:shadow-xl transition-shadow duration-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
                    <CardHeader className="relative">
                      <img
                        src={`https://source.unsplash.com/800x400/?${itinerary.destinations[0]?.name || 'travel'}`}
                        alt={itinerary.title}
                        className="w-full h-40 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-2 right-2 bg-white p-1 rounded-full">
                        <Map className="h-6 w-6 text-blue-500" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardTitle className="text-lg font-semibold">{itinerary.title}</CardTitle>
                      <p className="text-sm">
                        Du {new Date(itinerary.startDate).toLocaleDateString()} au{' '}
                        {new Date(itinerary.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm">Budget : {itinerary.budget} €</p>
                      <p className="text-sm">
                        Destinations : {itinerary.destinations.map((d) => d.name).join(', ')}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/itineraries/edit/${itinerary._id}`)}
                        className={darkMode ? 'text-white border-gray-500 hover:bg-gray-700' : 'hover:bg-blue-100'}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(itinerary._id)}
                        className={darkMode ? 'hover:bg-red-600' : 'hover:bg-red-700'}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )
        }
      </main >
    </div >
  );
};

export default Dashboard;